// Shadcn Imports
import { Calendar } from "@/components/ui/calendar"
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"

export default function SidebarDatePicker() {
    return (
        <SidebarGroup className="px-0">
            <SidebarGroupContent>
                <Calendar />
            </SidebarGroupContent>
        </SidebarGroup>
    );
}