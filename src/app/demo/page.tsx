"use client"

// Next and React Imports
import { useState, useEffect } from "react"

// App Imports
import { Item } from "@/lib/types"
import SidebarApp from "@/components/sidebar-app"
import ClosetGrid from "@/components/closet-grid"

// Firebase Imports
import { fetchClosetItems } from "@/lib/firebaseFunctions"

// Shadcn Imports
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID!;

export default function Demo() {
    const [closetItems, setClosetItems] = useState<Item[]>([]);
    const [filters, setFilters] = useState<Record<string, any>>({});

    // Fetch closet items on load and when filters update
    useEffect(() => {
        const fetchItems = async () => {
            const items = await fetchClosetItems(DEMO_USER_ID, filters);
            setClosetItems(items);
        };
        fetchItems();
    }, [filters]);

    // Handle filter updates from SidebarApp
    const handleFiltersChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters);
    };

	return (
		<div>
			<SidebarProvider>

                <SidebarApp />

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
                        <ClosetGrid items={closetItems} />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	)
}