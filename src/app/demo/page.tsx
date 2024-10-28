"use client"

// Next and React Imports
import Link from "next/link"
import { useState, useEffect } from "react"

// App Imports
import { User, Item } from "@/lib/types"
import SidebarFilters from "@/components/sidebar-filters"
import SidebarNav from "@/components/sidebar-nav"
import ClosetGrid from "@/components/closet-grid"

// Firebase Imports
import { fetchUserData, fetchClosetItems } from "@/lib/firebaseFunctions"

// Shadcn Imports
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { Plus } from "lucide-react"

const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID!;

export default function Demo() {
    const [user, setUser] = useState<User | null>(null);
    const [closetItems, setClosetItems] = useState<Item[]>([]);
    const [filters, setFilters] = useState<Record<string, string[]>>({
        Categories: ["Tops", "Bottoms", "Accessories"],
        Brand: [],
    });
    const [loading, setLoading] = useState(true);

    // Fetch user data on load
    useEffect(() => {
        const getUserData = async () => {
            const fetchedUser = await fetchUserData(DEMO_USER_ID);
            setUser(fetchedUser);
        };

        getUserData();
    }, []);

    // Fetch closet items on load and when filters update
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            const items = await fetchClosetItems(DEMO_USER_ID, filters);
            setClosetItems(items);
            setLoading(false);
        };
        fetchItems();
    }, [filters]);

    // Update filters based on SidebarFilters selections
    const handleFiltersChange = (newFilters: Record<string, string[]>) => {
        setFilters(newFilters);
    };

	return (
        <SidebarProvider>

            <Sidebar>

                {/* Nav Header */}
                <SidebarHeader className="h-16 border-b border-sidebar-border">
                    {user ? <SidebarNav user={user} /> : <p>Loading...</p>}
                </SidebarHeader>

                <SidebarContent className="pt-2">
                    <SidebarFilters userId={DEMO_USER_ID} onFiltersChange={handleFiltersChange} />
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

            <SidebarInset>
                <header className="sticky top-0 flex h-16 items-center gap-2 border-b bg-background px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>My Closet</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <ClosetGrid items={closetItems} loading={loading} />
                </div>
            </SidebarInset>
        </SidebarProvider>
	)
}