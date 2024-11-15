"use client"

// Next and React Imports
import { useEffect } from "react"
import { useRouter } from "next/navigation"

// App Imports
import NavBar from "@/components/nav-bar"
import { useAuth } from "@/context/AuthContext"
import SidebarApp from "@/components/sidebar-app"
import ClosetGrid from "@/components/closet-grid"

// Shadcn Imports
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function ClosetPage() {

	const { user } = useAuth();
    const router = useRouter();

	// Redirect only when "user" changes
	useEffect(() => {
        if (!user) {
            router.push("/auth/login");
        }
    }, [user, router]);

	// Show nothing while redirecting
    if (!user) {
        return null;
    }

	return (
		<div className="relative flex flex-col md:flex-row min-h-screen overflow-hidden">
            <NavBar />
            <div className="p-8">
                <p className="text-sm">closet</p>
            </div>
		</div>
		// <div>
		// 	<SidebarProvider>

		// 		<SidebarApp />

		// 		<SidebarInset>
		// 			<header className="sticky top-0 flex h-16 items-center gap-2 border-b bg-background px-4">
		// 				<SidebarTrigger className="-ml-1" />
		// 				<Separator orientation="vertical" className="mr-2 h-4" />
		// 				<Breadcrumb>
		// 					<BreadcrumbList>
		// 						<BreadcrumbItem>
		// 							<BreadcrumbPage>My Closet</BreadcrumbPage>
		// 						</BreadcrumbItem>
		// 					</BreadcrumbList>
		// 				</Breadcrumb>
		// 			</header>
		// 			<div className="flex flex-1 flex-col gap-4 p-4">
		// 				{/* <ClosetGrid /> */}
		// 			</div>
		// 		</SidebarInset>
		// 	</SidebarProvider>
		// </div>
	)
}