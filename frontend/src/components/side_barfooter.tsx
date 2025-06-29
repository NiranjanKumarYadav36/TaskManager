import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../components/ui/sidebar";
import { useEffect, useState } from "react";
import AxiosClient from "./ApiClient/AxiosClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Skeleton } from "../components/ui/skeleton";

export function SideBarFooter() {
  const { isMobile } = useSidebar();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = async () => {
      try {
        const response = await AxiosClient.get("/user");
        if (response) {
          setUsername(response.data.username || "User");
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          // Handle unauthorized (logged out) state
          navigate("/");
        }
        setUsername("User");
      } finally {
        setLoading(false);
      }
    };

    userDetails();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await AxiosClient.post("/logout");
      if (response) {
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-3 px-3 py-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="font-medium truncate">{username}</p>
                  {email && (
                    <p className="text-xs text-muted-foreground truncate">
                      {email}
                    </p>
                  )}
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuItem
              onSelect={handleLogout}
              className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-900/20 dark:focus:text-red-400 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}