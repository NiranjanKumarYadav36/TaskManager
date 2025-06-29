import { NavMain } from "../components/nav-main"
import { SideBarFooter } from "../components/side_barfooter"
import { SideBarHeader } from "../components/side-barheader"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SideBarHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <SideBarFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
};