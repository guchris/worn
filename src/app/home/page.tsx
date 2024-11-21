"use client"

// Next and React Imports
import { useEffect } from "react"
import { useRouter } from "next/navigation"

// App Imports
import NavBar from "@/components/nav-bar"
import { useAuth } from "@/context/AuthContext"

export default function Home() {
    
	const { user, loading } = useAuth();
    const router = useRouter();

	useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

	if (loading) {
        return null;
    }

    if (!user) {
        return null;
    }

	return (
		<div className="relative flex flex-col md:flex-row min-h-screen overflow-hidden">
            <NavBar />
			<main className="flex-1 px-6 pb-6 space-y-6 md:p-8">
                <p className="hidden md:block text-sm">home</p>
            </main>
		</div>
	)
}