import { CalendarDays, Clock, PlusCircle, BookCheck } from "lucide-react"
import {
  Collapsible,
  CollapsibleTrigger,
} from "../components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import AxiosClient from "./ApiClient/AxiosClient"

export function NavMain() {
  const [todayCount, setTodayCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [upcomingCount, setUpcomingCount] = useState(0)

  useEffect(() => {
    const fetchAllTasksCount = async () => {
      try {
        const response = await AxiosClient.get("/all_task_count")
        if (response) {
          setTodayCount(response.data.message["todayCount"])
          setCompletedCount(response.data.message["completedCount"])
          setUpcomingCount(response.data.message["upcomingCount"])
        }

      } catch (error) {
        console.log(error);
      }
    }
    fetchAllTasksCount();
  }, []);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tasks</SidebarGroupLabel>
      <SidebarMenu>

        {/* Today Task */}
        <Link to={"/today-task"}>
          <Collapsible asChild defaultOpen className="group/collapsible">
            <SidebarMenuItem className="hover:font-black">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Today Task">
                  <Clock />
                  <span>Today Task</span>
                  <p className="ml-auto">{todayCount}</p>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        </Link>

        {/* Upcoming Task */}
        <Link to={"/upcoming-task"}>
          <Collapsible asChild defaultOpen className="group/collapsible">
            <SidebarMenuItem className="hover:font-black">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Upcoming Task">
                  <CalendarDays />
                  <span>Upcoming Task</span>
                  <p className="ml-auto">{upcomingCount}</p>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        </Link>

        {/* Completed Task */}
        <Link to={"/completed-task"}>
          <Collapsible asChild defaultOpen className="group/collapsible">
            <SidebarMenuItem className="hover:font-black">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Completed Task">
                  <BookCheck />
                  <span>Completed Task</span>
                  <p className="ml-auto">{completedCount}</p>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        </Link>

        {/* New Task */}
        <Link to={"/new-task"}>
          <Collapsible asChild defaultOpen className="group/collapsible">
            <SidebarMenuItem className="hover:font-black">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="New Task">
                  <PlusCircle />
                  <span>New Task</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        </Link>
      </SidebarMenu>
    </SidebarGroup>
  )
}

// className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90