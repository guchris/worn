"use client"

// Next and React Imports
import Link from "next/link"
import { useEffect, useState } from "react"

// App Imports
import SidebarNav from "@/components/sidebar-nav"
import SidebarFilters from "@/components/sidebar-filters"
import { User } from "@/lib/types"
import { fetchUserData } from "@/lib/firebaseFunctions"

// Shadcn Imports
import { Sidebar, SidebarHeader, SidebarFooter, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"

const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID!;

export default function SidebarApp() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUserData = async () => {
            const fetchedUser = await fetchUserData(DEMO_USER_ID);
            setUser(fetchedUser);
        };

        getUserData();
    }, []);

    return (
        <Sidebar>

            {/* Nav Header */}
            <SidebarHeader className="h-16 border-b border-sidebar-border">
                {user ? <SidebarNav user={user} /> : <p>Loading...</p>}
            </SidebarHeader>

            <SidebarContent className="pt-2">
                {/* <SidebarFilters userId={DEMO_USER_ID}/> */}
            </SidebarContent>

            {/* Footer Actions */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/add-item" passHref>
                            <SidebarMenuButton>
                                <Plus />
                                <span>Add Clothing Item</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            {/* Optional SidebarRail for smaller screens */}
            <SidebarRail />
        </Sidebar>
    );
}