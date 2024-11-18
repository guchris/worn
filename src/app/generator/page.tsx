"use client"

// Next and React Imports
import { useEffect } from "react"
import { useRouter } from "next/navigation"

// App Imports
import NavBar from "@/components/nav-bar"
import { useAuth } from "@/context/AuthContext"

export default function GeneratorPage() {

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
            </div>
		</div>
	)
}