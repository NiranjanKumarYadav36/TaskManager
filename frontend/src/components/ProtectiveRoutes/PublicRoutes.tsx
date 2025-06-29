import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AxiosClient from "../ApiClient/AxiosClient";

const PublicRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await AxiosClient.get("/protected", { withCredentials: true });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                }
            } catch {
                setIsAuthenticated(false);
            }
        };
        checkToken();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-xl font-semibold animate-pulse">Checking authentication...</h1>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/today-task" />;
    }

    // Show public content (like login, register, etc.)
    return <Outlet />;
};

export default PublicRoutes;