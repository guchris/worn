"use client"

// Next and React Imports
import { useEffect } from "react"
import { useRouter } from "next/navigation"

// App Imports
import NavBar from "@/components/nav-bar"
import { useAuth } from "@/context/AuthContext"
import { ClosetPieChart } from "@/components/chart-pie"
import { ClosetBarChart } from "@/components/chart-bar"

export default function NumbersPage() {

    const { user, loading } = useAuth();
    const router = useRouter();

	useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

	// Show nothing while redirecting
    if (!user) {
        return null;
    }

	return (
		<div className="relative flex flex-col md:flex-row min-h-screen overflow-hidden">
            <NavBar />
            <main className="flex-1 p-8 space-y-8">
                <ClosetPieChart />
                <ClosetBarChart />
            </main>
		</div>
	)
}