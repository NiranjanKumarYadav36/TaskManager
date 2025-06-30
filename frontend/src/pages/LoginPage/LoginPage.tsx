import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Toaster, toast } from "react-hot-toast"
import AxiosClient from "../../components/ApiClient/AxiosClient"
import { useState } from "react"

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: "", password: "" })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await AxiosClient.post("/login",
                {
                    username: formData.username,
                    password: formData.password,
                }
            );

            if (response) {
                toast.success(response.data.message)
                navigate("/today-task")
            }
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status
                const message = error.response.data.message

                switch (status) {
                    case 400:
                        toast.error(message || "")
                        break
                    case 500:
                        toast.error(message || "")
                        break
                    default:
                        toast.error("Unexpected error!")
                }
            } else if (error.request) {
                toast.error("No response from server. Please check your connection.")
            } else {
                toast.error("Unexpected error!")
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center min-h-screen p-4">
            <Toaster position="top-center" />
            <Card className="w-full max-w-md shadow-xl rounded-2xl overflow-hidden border-0">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2 w-full"></div>
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold text-gray-800">Welcome Back</CardTitle>
                    <CardDescription className="text-gray-600">
                        Sign in to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-gray-700 font-medium">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your username"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700 font-medium">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link 
                            to="/register" 
                            className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default LoginPage;