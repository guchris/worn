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
        return <p className="p-4 text-sm">loading</p>;
    }

    if (!user) {
        return null;
    }

	return (
		<div className="relative flex flex-col md:flex-row min-h-screen overflow-hidden">
            <NavBar />
			<div className="p-8">
                <p className="text-sm">home</p>
            </div>
		</div>
	)
}