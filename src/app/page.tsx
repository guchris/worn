// Next Imports
import Link from "next/link"

// Shadcn Imports
import { Button } from "@/components/ui/button"

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center">
            <div className="text-center space-y-6">
                {/* Title */}
                <h1 className="text-4xl font-bold">worn</h1>

                {/* Buttons Row */}
                <div className="flex justify-center space-x-4">
					<Link href="/demo" passHref>
						<Button variant="outline">view demo closet</Button>
					</Link>
					<Link href="/auth/login" passHref>
						<Button variant="default">login</Button>
					</Link>
                </div>
            </div>
        </div>
	)
}