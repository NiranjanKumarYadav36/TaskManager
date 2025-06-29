import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AxiosClient from "../ApiClient/AxiosClient";
import { Toaster } from "react-hot-toast";

const UserProtectedRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        let isMounted = true;

        const checkToken = async () => {
            try {
                const response = await AxiosClient.get("/protected", { withCredentials: true });

                if (isMounted) {
                    setIsAuthenticated(response.status === 200);
                }
            } catch (error) {
                if (isMounted) {
                    setIsAuthenticated(false);
                }
                console.error("Authentication check failed:", error);
            }
        };

        checkToken();
        return () => { isMounted = false; };
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-xl font-semibold animate-pulse">Checking authentication...</h1>
            </div>
        );
    }

    // Redirect Admin to Admin Page
    if (isAuthenticated) {
        return <Outlet />;
    }

    // Redirect Unauthorized Users to Login
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default UserProtectedRoutes;