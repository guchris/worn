// App Imports
import SidebarApp from "@/components/sidebar-app"

// Shadcn Imports
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function Home() {
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
						<div className="grid auto-rows-min gap-4 md:grid-cols-5">
							{Array.from({ length: 20 }).map((_, i) => (
								<div key={i} className="aspect-square rounded-xl bg-muted/50" />
							))}
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	)
}