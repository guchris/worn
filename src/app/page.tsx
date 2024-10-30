// App Imports
import TopBar from "@/components/top-bar"
import Playground from "@/components/playground"

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
            <TopBar />
			<Playground />
		</div>
	)
}