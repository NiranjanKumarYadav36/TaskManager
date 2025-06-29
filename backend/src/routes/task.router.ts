import { registerHandle, loginHandle, logoutHandle, user } from "../controller/task.controller";
import express from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { addNewTask, allTasksCount, changePriority, changeStatus, completedTask, todayTask, upcomingTask } from "../controller/user.controller";

const route = express.Router()

route.get("/protected", authenticateJWT, (req: express.Request, res: express.Response) => {
    const user = (req as any).user;    
    res.status(200).json({ success: true, message: "You have access to this protected route!", username: user.username});
});

route.post("/register", registerHandle);
route.post("/login", loginHandle);
route.post("/logout", logoutHandle);
route.get("/user", authenticateJWT, user);

route.get("/all_task_count", authenticateJWT, allTasksCount);
route.post("/add_new_task", authenticateJWT, addNewTask);
route.get("/upcoming_task", authenticateJWT, upcomingTask);
route.get("/completed_task", authenticateJWT, completedTask);
route.get("/today_task", authenticateJWT, todayTask);

route.patch("/tasks_status_change/:id", authenticateJWT, changeStatus);
route.patch("/tasks_priority_change/:id", authenticateJWT, changePriority);

export default route;