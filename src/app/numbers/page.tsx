"use client"

// Next and React Imports
import { useEffect } from "react"
import { useRouter } from "next/navigation"

// App Imports
import NavBar from "@/components/nav-bar"
import { useAuth } from "@/context/AuthContext"
import { ClosetPieChartTotalItems } from "@/components/chart-pie-total-items"
import { ClosetPieChartTotalSpent } from "@/components/chart-pie-total-spent"
import { ClosetBarChartTopBrands } from "@/components/chart-bar-top-brands"
import { ClosetBarChartTopCategories } from "@/components/chart-bar-top-categories"
import { ClosetBarChartThreeMonthsItems } from "@/components/chart-bar-three-months-items"
import { ClosetBarChartThreeMonthsSpent } from "@/components/chart-bar-three-months-spent"
import { ClosetBarChartYearlySpending } from "@/components/chart-bar-yearly-spending"

export default function NumbersPage() {

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
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <ClosetPieChartTotalItems />
                    </div>
                    <div className="flex-1">
                        <ClosetPieChartTotalSpent />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <ClosetBarChartTopBrands />
                    </div>
                    <div className="flex-1">
                        <ClosetBarChartTopCategories />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <ClosetBarChartThreeMonthsItems />
                    </div>
                    <div className="flex-1">
                        <ClosetBarChartThreeMonthsSpent />
                    </div>
                </div>
                <ClosetBarChartYearlySpending />
            </main>
		</div>
	)
}