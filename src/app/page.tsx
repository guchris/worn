// Next Imports
import Link from "next/link"

// Shadcn Imports
import { Button } from "@/components/ui/button"

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center space-y-6">
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-800">worn</h1>

                {/* Buttons Row */}
                <div className="flex justify-center space-x-4">
                    <Button variant="outline">view example closet</Button>
                    <Button variant="default">login</Button>
                </div>
            </div>
        </div>
	)
}