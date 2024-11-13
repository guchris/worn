// App Imports
import NavBar from "@/components/nav-bar"

export default function ClosetPage() {
	return (
		<div className="relative flex flex-col md:flex-row min-h-screen overflow-hidden">
            <NavBar />
            <div className="p-8">
                <p className="text-sm">closet</p>
            </div>
		</div>
	)
}