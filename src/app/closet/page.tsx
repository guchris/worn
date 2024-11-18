"use client"

// Next and React Imports
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// App Imports
import NavBar from "@/components/nav-bar"
import { useAuth } from "@/context/AuthContext"

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
            <div className="w-full p-6 md:p-8">
				<div className="flex items-center justify-between">
					<p className="hidden md:block text-sm">closet</p>
					<Link href="/add-item" className="text-sm hover:text-green-500" passHref>
						+ add clothing item
					</Link>
				</div>
            </div>
		</div>
	)
}