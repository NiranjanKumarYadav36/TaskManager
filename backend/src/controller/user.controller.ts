import { Request, Response } from "express";
import { queryDB } from "../config/db";
import { use } from "passport";

export const addNewTask = async (req: Request, res: Response): Promise<void> => {
  const { title, priority, editorContent, dueDate } = req.body
  const tableName = "taskmanager.tasks"
  const user = (req as any).user
  console.log(dueDate);
  

  try {
    if (!title || !priority || !editorContent || !dueDate) {
      res.status(401).json({ message: "enter all details" })
      return
    }

    const userExists = await queryDB(`SELECT id FROM taskmanager.users WHERE id = $1`, [user.userId])

    if (userExists.length == 0) {
      res.status(401).json({ message: "Something went wromg" })
      return
    }
    
    const query = `INSERT INTO ${tableName} (title, content, priority, due_date, user_id) VALUES($1, $2, $3, $4, $5)`

    const response = await queryDB(query, [title, editorContent, priority, dueDate, user.userId])

    if (response) {
      res.status(201).json({ message: "Task added successfully" })
      return
    }
  } catch (error) {
    res.status(500).json({ message: "server error" })
    return
  }
};

export const todayTask = async (req: Request, res: Response): Promise<void> => {
  const tableName = "taskmanager.tasks";
  const user = (req as any).user;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;
  const offset = (page - 1) * limit;

  const now = new Date();
  const startOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  const endOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

  try {
    const tasksQuery = `
      SELECT * FROM ${tableName} 
      WHERE due_date BETWEEN $1 AND $2
      AND user_id = $3
      AND (status = 'in_progress' OR status = 'todo')
      ORDER BY due_date ASC
      LIMIT $4 OFFSET $5
    `;

    // IMPORTANT: Add the same status filter to the count query
    const countQuery = `
      SELECT COUNT(*) FROM ${tableName} 
      WHERE due_date BETWEEN $1 AND $2
      AND user_id = $3
      AND (status = 'in_progress' OR status = 'todo')
    `;

    const [tasksResponse, countResponse] = await Promise.all([
      queryDB(tasksQuery, [startOfDayUTC.toISOString(), endOfDayUTC.toISOString(), user.userId, limit, offset]),
      queryDB(countQuery, [startOfDayUTC.toISOString(), endOfDayUTC.toISOString(), user.userId])
    ]);

    const totalTasks = parseInt(countResponse[0].count, 10);
    const totalPages = Math.ceil(totalTasks / limit);

    res.status(200).json({
      message: {
        tasks: tasksResponse,
        totalPages,
        currentPage: page,
        totalTasks
      }
    });
  } catch (error) {
    console.error("Error fetching today's tasks:", error);
    res.status(500).json({ 
      message: "server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const upcomingTask = async (req: Request, res: Response): Promise<void> => {
  const tableName = "taskmanager.tasks";
  const user = (req as any).user;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;
  const offset = (page - 1) * limit;

  const nowUTC = new Date().toISOString(); // Ensures UTC comparison for timestampz

  try {
    const tasksQuery = `
      SELECT * FROM ${tableName} 
      WHERE due_date > $1 
      AND user_id = $2 
      AND (status = 'in_progress' OR status = 'todo') 
      ORDER BY due_date ASC
      LIMIT $3 OFFSET $4
    `; // IN ()

    const countQuery = `
      SELECT COUNT(*) FROM ${tableName} 
      WHERE due_date > $1
      AND user_id = $2
      AND (status = 'in_progress' OR status = 'todo')
    `;

    const [tasksResponse, countResponse] = await Promise.all([
      queryDB(tasksQuery, [nowUTC, user.userId, limit, offset]),
      queryDB(countQuery, [nowUTC, user.userId])
    ]);

    const totalTasks = parseInt(countResponse[0].count, 10);
    const totalPages = Math.ceil(totalTasks / limit);

    res.status(200).json({
      message: {
        tasks: tasksResponse,
        totalPages,
        currentPage: page,
        totalTasks
      }
    });
  } catch (error) {
    console.error("Error fetching upcoming tasks:", error);
    res.status(500).json({ message: "server error" });
  }
};

export const completedTask = async (req: Request, res: Response): Promise<void> => {
  const tableName = "taskmanager.tasks";
  const user = (req as any).user;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;
  const offset = (page - 1) * limit;

  try {
    const tasksQuery = `
      SELECT * FROM ${tableName} 
      WHERE user_id = $1
      AND status = 'done' 
      ORDER BY due_date ASC
      LIMIT $2 OFFSET $3
    `; // IN ()

    const countQuery = `
      SELECT COUNT(*) FROM ${tableName} 
      WHERE user_id = $1 AND status = 'done'
    `;

    const [tasksResponse, countResponse] = await Promise.all([
      queryDB(tasksQuery, [user.userId, limit, offset]),
      queryDB(countQuery, [user.userId])
    ]);

    const totalTasks = parseInt(countResponse[0].count, 10);
    const totalPages = Math.ceil(totalTasks / limit);

    res.status(200).json({
      message: {
        tasks: tasksResponse,
        totalPages,
        currentPage: page,
        totalTasks
      }
    });
  } catch (error) {
    console.error("Error fetching upcoming tasks:", error);
    res.status(500).json({ message: "server error" });
  }
};

export const changeStatus = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;
  const { id } = req.params;
  const tableName = "taskmanager.tasks";
  const user = (req as any).user;

  try {
    // Validate input
    if (!status || !id) {
      res.status(400).json({ message: "Status and task ID are required" });
      return;
    }

    // Check if task exists and belongs to user
    const taskResult = await queryDB(
      `SELECT id, user_id, status FROM ${tableName} WHERE id = $1 AND user_id = $2`,
      [id, user.userId]
    );

    if (taskResult.length === 0) {
      res.status(404).json({ message: "Task not found or not owned by user" });
      return;
    }

    const task = taskResult[0];

    // Check if status is already the same
    if (task.status === status) {
      res.status(200).json({
        success: true,
        message: "Status unchanged (already set to this value)"
      });
      return;
    }

    // Update the status
    const updateResult = await queryDB(
      `UPDATE ${tableName} SET status = $1
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [status, id, user.userId]
    );

    if (updateResult.length === 0) {
      res.status(500).json({ message: "Update failed - no rows affected" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updateResult[0] // Return the updated task
    });

  } catch (error: any) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const changePriority = async (req: Request, res: Response): Promise<void> => {
  const { priority } = req.body;
  const { id } = req.params;
  const tableName = "taskmanager.tasks";
  const user = (req as any).user;

  try {
    // Validate input
    if (!priority || !id) {
      res.status(400).json({ message: "Priority and task ID are required" });
      return;
    }

    // Check if task exists and belongs to user
    const taskResult = await queryDB(
      `SELECT id, user_id, priority FROM ${tableName} WHERE id = $1 AND user_id = $2`,
      [id, user.userId]
    );

    if (taskResult.length === 0) {
      res.status(404).json({ message: "Task not found or not owned by user" });
      return;
    }

    const task = taskResult[0];

    // Check if status is already the same
    if (task.priority === priority) {
      res.status(200).json({
        success: true,
        message: "Priority unchanged (already set to this value)"
      });
      return;
    }

    // Update the status
    const updateResult = await queryDB(
      `UPDATE ${tableName} SET priority = $1
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [priority, id, user.userId]
    );

    if (updateResult.length === 0) {
      res.status(500).json({ message: "Update failed" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "priority updated successfully",
      data: updateResult[0] // Return the updated task
    });

  } catch (error: any) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const allTasksCount = async (req: Request, res: Response): Promise<void> => {
  const tableName = "taskmanager.tasks";
  const user = (req as any).user;

  const now = new Date();
  const startOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  const endOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

  try {
    const [todayCountResult, upcomingCountResult, completedCountResult] = await Promise.all([
      // Today's tasks
      queryDB(`
        SELECT COUNT(*) as count FROM ${tableName} 
        WHERE due_date BETWEEN $1 AND $2
        AND user_id = $3
        AND (status = 'in_progress' OR status = 'todo')
      `, [startOfDayUTC.toISOString(), endOfDayUTC.toISOString(), user.userId]),
      
      // Upcoming tasks
      queryDB(`
        SELECT COUNT(*) as count FROM ${tableName} 
        WHERE due_date > $1
        AND user_id = $2
        AND (status = 'in_progress' OR status = 'todo')
      `, [now.toISOString(), user.userId]),

      // Completed tasks
      queryDB(`
        SELECT COUNT(*) as count FROM ${tableName} 
        WHERE status = 'done' AND user_id = $1 
      `, [user.userId]),
      
    ]);

    res.status(200).json({
      message: {
        todayCount: parseInt(todayCountResult[0].count) || 0,
        upcomingCount: parseInt(upcomingCountResult[0].count) || 0,
        completedCount: parseInt(completedCountResult[0].count) || 0
      }
    });
  } catch (error) {
    console.error('Error fetching task counts:', error);
    res.status(500).json({ 
      message: "Failed to fetch task counts",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};