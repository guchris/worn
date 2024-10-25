"use client"

// Next and React Imports
import Link from "next/link"
import { useEffect, useState } from "react"

// App Imports
import SidebarNav from "@/components/sidebar-nav"
import SidebarFilters from "@/components/sidebar-filters"
import { User } from "@/lib/types"

// Firebase Imports
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Shadcn Imports
import { Sidebar, SidebarHeader, SidebarFooter, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail } from "@/components/ui/sidebar"
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

            <SidebarContent className="pt-2">
                <SidebarFilters />
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