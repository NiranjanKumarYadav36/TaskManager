// side-bar.tsx
import { AppSidebar } from "../../components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "../../components/ui/sidebar"

export default function SideBar({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-h-screen">
                <div className="p-4">
                    <SidebarTrigger className="-ml-1" />
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}