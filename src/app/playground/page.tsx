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

    useEffect(() => {
        // Prevent scrolling on mount
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        // Revert on unmount
        return () => {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        };
    }, []);

    if (loading) {
        return null;
    }

    if (!user) {
        return null;
    }

	return (
		<div className="relative flex flex-col md:flex-row min-h-screen overflow-hidden">
            <NavBar />
            <UserPlayground userId={user.uid} />
		</div>
	)
}