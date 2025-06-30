import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar/SideBar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../components/ui/pagination';
import AxiosClient from '../../components/ApiClient/AxiosClient';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from "../../components/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from '../../components/ui/popover';
import { MoreVertical } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Toaster, toast } from 'react-hot-toast';
import { Skeleton } from '../../components/ui/skeleton'; // Import skeleton component

interface Task {
    id: number;
    title: string;
    content: string;
    status: string;
    priority: string;
    due_date: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

function ShowTodayTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 6;
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

    useEffect(() => {
        fetchTodayTasks();
    }, [currentPage, priorityFilter]);

    useEffect(() => {
        if (priorityFilter === 'all') {
            setFilteredTasks(tasks);
        } else {
            setFilteredTasks(tasks.filter(task => task.priority.toLowerCase() === priorityFilter));
        }
    }, [tasks, priorityFilter]);

    const fetchTodayTasks = async () => {
        setLoading(true);
        try {
            const url = `/today_task?page=${currentPage}&limit=${itemsPerPage}${priorityFilter !== 'all' ? `&priority=${priorityFilter}` : ''
                }`;
            const response = await AxiosClient.get(url);
            const data = response.data;
            setTasks(data.message.tasks);
            setTotalPages(data.message.totalPages);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    // Add new handler for tab changes
    const handleFilterChange = (value: string) => {
        if (value === 'all' || value === 'high' || value === 'medium' || value === 'low') {
            setPriorityFilter(value);
            setCurrentPage(1);
        }

    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityCardColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-50 border-red-200 hover:border-red-300';
            case 'medium':
                return 'bg-yellow-50 border-yellow-200 hover:border-yellow-300';
            case 'low':
                return 'bg-green-50 border-green-200 hover:border-green-300';
            default:
                return 'bg-gray-50 border-gray-200 hover:border-gray-300';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'todo':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-purple-100 text-purple-800';
            case 'done':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const toggleDescription = (taskId: number) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderSkeletonLoader = () => {
        return Array.from({ length: itemsPerPage }).map((_, index) => (
            <Card key={index} className="mb-4 h-full flex flex-col overflow-hidden">
                <CardHeader className="flex flex-row justify-between items-start">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                    <Skeleton className="h-4 w-16" />
                </CardContent>
                <CardFooter className="flex justify-between items-center mt-auto space-x-2">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                </CardFooter>
            </Card>
        ));
    };

    const renderTaskCards = () => {
        return filteredTasks.map(task => (
            <Card 
                key={task.id} 
                className={`mb-4 transition-shadow h-full flex flex-col overflow-hidden border ${getPriorityCardColor(task.priority)} hover:shadow-md`}
            >
                <CardHeader className="flex flex-row justify-between items-start">
                    <CardTitle className="text-lg font-semibold whitespace-normal break-words overflow-wrap-anywhere">
                        {task.title}
                    </CardTitle>
                    <Dialog>
                        <DialogTrigger asChild onClick={() => setCurrentTask(task)}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl overflow-wrap-anywhere">{task.title}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="status" className="text-sm font-medium">
                                        Status: {task.status}
                                    </label>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="priority" className="text-sm font-medium">
                                        Priority: {task.priority}
                                    </label>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-sm font-medium">Due Date:</span>
                                    <span className="col-span-3 text-sm">{formatDate(task.due_date)}</span>
                                </div>

                                <div className="grid gap-2">
                                    <span className="text-sm font-medium">Description:</span>
                                    <div
                                        className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg overflow-wrap-anywhere"
                                        dangerouslySetInnerHTML={{ __html: task.content || '<p>No description provided</p>' }}
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="mb-4">
                        <div
                            className={`prose prose-sm max-w-none ${expandedDescriptions[task.id] ? '' : 'line-clamp-3'}`}
                            dangerouslySetInnerHTML={{ __html: task.content || '<p>No description provided</p>' }}
                        />
                        {task.content && task.content.length > 100 && (
                            <Button
                                variant="link"
                                className="p-0 h-auto text-sm text-blue-300"
                                onClick={() => toggleDescription(task.id)}
                            >
                                {expandedDescriptions[task.id] ? 'Show less' : '...Show more'}
                            </Button>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center mt-auto">
                    <div className="text-sm text-gray-600">
                        Due: {formatDate(task.due_date)}
                    </div>
                    <div className="flex gap-2">
                        <Badge
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                            variant="outline"
                        >
                            {task.status}
                        </Badge>
                        <Badge
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                            variant="outline"
                        >
                            {task.priority}
                        </Badge>
                    </div>
                </CardFooter>
            </Card>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position='top-center' />
            <SideBar>
                <div className="flex-grow p-4 md:p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Today's Tasks</h1>
                        <Tabs
                            value={priorityFilter}
                            onValueChange={handleFilterChange}
                            className="w-auto"
                        >
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="high">High</TabsTrigger>
                                <TabsTrigger value="medium">Medium</TabsTrigger>
                                <TabsTrigger value="low">Low</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {renderSkeletonLoader()}
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                {priorityFilter !== 'all'
                                    ? `No today's tasks found with ${priorityFilter} priority`
                                    : "No tasks due today"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {renderTaskCards()}
                        </div>
                    )}

                    {!loading && totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                onClick={() => handlePageChange(page)}
                                                isActive={page === currentPage}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </SideBar>
        </div>
    );
}

export default ShowTodayTasks;