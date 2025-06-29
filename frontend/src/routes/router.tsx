import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoutes from "../components/ProtectiveRoutes/PublicRoutes";
import UserProtectedRoutes from "../components/ProtectiveRoutes/UserProtectedRoutes";
import PageNotFound from "../components/PageNotFound/PageNotFound";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import ShowTodayTasks from "../pages/ShowTodayTasks/ShowTodayTasks";
import AddNewTask from "../pages/AddNewTask/AddNewTask";
import ShowUpcomingTasks from "../pages/ShowUpcomingTasks/ShowUpcomingTasks";
import ShowCompletedTasks from "../pages/ShowCompletedTasks/ShowCompletedTasks";

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicRoutes />}>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* User Protected Routes */}
                <Route element={<UserProtectedRoutes />}>
                    <Route path="/today-task" element={<ShowTodayTasks />} />
                    <Route path="/upcoming-task" element={<ShowUpcomingTasks />} />
                    <Route path="/completed-task" element={<ShowCompletedTasks />} />
                    <Route path="/new-task" element={<AddNewTask />} />
                </Route>

                {/* Catch-all route for 404 */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;