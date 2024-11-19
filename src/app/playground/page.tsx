"use client"

// Next and React Imports
import { useEffect } from "react"
import { useRouter } from "next/navigation"

// App Imports
import NavBar from "@/components/nav-bar"
import { useAuth } from "@/context/AuthContext"
import UserPlayground from "@/components/user-playground"

export default function PlaygroundPage() {
    
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
            <div className="p-8">
                <UserPlayground userId={user.uid} />
            </div>
		</div>
	)
}