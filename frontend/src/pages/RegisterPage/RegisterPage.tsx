import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import {
    Card,
    CardAction,
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


const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: "", password: "" })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await AxiosClient.post("/register",
                {
                    username: formData.username,
                    password: formData.password,
                }
            );

            if (response) {
                toast.success(response.data.message)
                navigate("/homepage")
            }
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status
                const message = error.response.data.message

                switch (status) {
                    case 400:
                        toast.error(message || "")
                        break
                    case 409:
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
        <div className="bg-gray-300 flex justify-center items-center min-h-screen">
            <Toaster position="top-center" />
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="items-center flex justify-center font-bold">Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="username"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <CardAction className="flex gap-2 ml-15">
                        <CardDescription>already have an account</CardDescription>
                        <Link to={"/"} className="font-mono hover:underline">login</Link>
                    </CardAction>
                </CardFooter>
            </Card>
        </div>
    )
}

export default RegisterPage;