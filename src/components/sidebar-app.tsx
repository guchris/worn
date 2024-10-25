// App Imports
import SidebarNav from "@/components/sidebar-nav"
import SidebarFilters from "@/components/sidebar-filters"
import SidebarDatePicker from "@/components/sidebar-datepicker"

// Shadcn Imports
import { Sidebar, SidebarHeader, SidebarSeparator, SidebarFooter, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"

const data = {
    user: { name: "Chris Gu", email: "cleegu@gmail.com" },
};

export default function SidebarApp() {
    return (
        <Sidebar>

            {/* Nav Header */}
            <SidebarHeader className="h-16 border-b border-sidebar-border">
                <SidebarNav user={data.user} />
            </SidebarHeader>

            <SidebarContent>
                <SidebarDatePicker />
                <SidebarSeparator className="mx-0" />
                <SidebarFilters />
            </SidebarContent>

            {/* Footer Actions */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Plus />
                            <span>Add Clothing Item</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            {/* Optional SidebarRail for smaller screens */}
            <SidebarRail />
        </Sidebar>
    );
}