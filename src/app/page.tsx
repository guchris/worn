"use client"

// Next Imports
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// App Imports
import { useAuth } from "@/context/AuthContext"
import DemoPlayground from "@/components/demo-playground"

export default function Landing() {
	const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect logged-in users to /home
    useEffect(() => {
        if (!loading && user) {
            router.push("/home");
        }
    }, [user, loading, router]);

    // Show nothing while checking auth status
    if (loading || user) {
        return null;
    }
	
	return (
		<div className="relative flex flex-col min-h-screen overflow-hidden">
			<DemoPlayground />
		</div>
	)
}