"use client"

// React Imports
import { useEffect, useState } from "react"

// App Imports
import SidebarNav from "@/components/sidebar-nav"
import SidebarFilters from "@/components/sidebar-filters"
import SidebarDatePicker from "@/components/sidebar-datepicker"
import { User } from "@/lib/types"

// Firebase Imports
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Shadcn Imports
import { Sidebar, SidebarHeader, SidebarSeparator, SidebarFooter, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"

export default function SidebarApp() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {

        const fetchUserData = async () => {
            const userDoc = doc(db, "users", "vhDFojFLrNIjkqo0vCmI"); 
            const docSnapshot = await getDoc(userDoc);

            if (docSnapshot.exists()) {
                setUser(docSnapshot.data() as User);
            } else {
                console.log("No such document!");
            }
        };

        fetchUserData();
    }, []);

    return (
        <Sidebar>

            {/* Nav Header */}
            <SidebarHeader className="h-16 border-b border-sidebar-border">
                {user ? <SidebarNav user={user} /> : <p>Loading...</p>}
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