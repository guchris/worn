"use client"

// React Imports
import { useEffect, useState, useMemo } from "react"

// App Imports
import { useAuth } from "@/context/AuthContext"

// Firestore Imports
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Shadcn Imports
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
    views: {
        label: "amount spent",
    },
    2024: {
        label: "2024",
        color: "hsl(var(--chart-1))",
    },
    2023: {
        label: "2023",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

// Helper function to initialize months
const initializeMonths = (year: number) => {
    const months = [];
    for (let month = 0; month < 12; month++) {
        const date = `${year}-${String(month + 1).padStart(2, "0")}`;
        months.push({ date, usd: 0 });
    }
    return months;
};

export function ClosetBarChartYearlySpending() {
    const { user } = useAuth();
    const [chartData2023, setChartData2023] = useState<any[]>([]);
    const [chartData2024, setChartData2024] = useState<any[]>([]);
    const [totalSpent2023, setTotalSpent2023] = useState(0);
    const [totalSpent2024, setTotalSpent2024] = useState(0);
    const [activeYear, setActiveYear] = useState<"2024" | "2023">("2024");

    useEffect(() => {
        const fetchClosetData = async () => {
            if (!user) return;
    
            try {
                const closetRef = collection(db, "users", user.uid, "closet");
                const snapshot = await getDocs(closetRef);
    
                // Initialize months
                const aggregatedData2023 = initializeMonths(2023);
                const aggregatedData2024 = initializeMonths(2024);
    
                let total2023 = 0;
                let total2024 = 0;
    
                // Process Firestore data
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const purchaseDate = data.purchaseDate; // "YYYY-MM-DD"
                    const purchaseCost = parseFloat(data.purchaseCost) || 0;

                    if (purchaseDate && purchaseCost) {
                        const [year, month] = purchaseDate.split("-").map(Number);
                        const monthIndex = month - 1; // 0-based index for months

                        if (year === 2023) {
                            aggregatedData2023[monthIndex].usd += purchaseCost;
                            total2023 += purchaseCost;
                        } else if (year === 2024) {
                            aggregatedData2024[monthIndex].usd += purchaseCost;
                            total2024 += purchaseCost;
                        }
                    }
                });
    
                // Ensure data is sorted by date
                const chartData2023 = aggregatedData2023.sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );
    
                const chartData2024 = aggregatedData2024.sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );
    
                setChartData2023(chartData2023);
                setChartData2024(chartData2024);
                setTotalSpent2023(total2023);
                setTotalSpent2024(total2024);
            } catch (error) {
                console.error("Error fetching closet data:", error);
            }
        };
    
        fetchClosetData();
    }, [user]);

    const activeChartData = activeYear === "2024" ? chartData2024 : chartData2023;
    const activeTotalSpent = activeYear === "2024" ? totalSpent2024 : totalSpent2023;

    return (
        <Card className="shadow-none rounded-md">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>cost breakdown</CardTitle>
                    <CardDescription>
                        showing total spent for {activeYear}
                    </CardDescription>
                </div>
                <div className="flex">
                    {["2024", "2023"].map((year) => (
                        <button
                            key={year}
                            data-active={activeYear === year}
                            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                            onClick={() => setActiveYear(year as "2024" | "2023")}
                        >
                            <span className="text-xs text-muted-foreground">
                                {chartConfig[year as keyof typeof chartConfig].label}
                            </span>
                            <span className="text-lg font-bold leading-none sm:text-3xl">
                                ${activeYear === year
                                    ? activeTotalSpent.toLocaleString()
                                    : year === "2024"
                                    ? totalSpent2024.toLocaleString()
                                    : totalSpent2023.toLocaleString()}
                            </span>
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={activeChartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleString("en-US", { month: "short" });
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="usd"
                                    labelFormatter={(value) => {
                                        const date = new Date(value);
                                        return date.toLocaleString("en-US", { month: "long" });
                                    }}
                                />
                            }
                        />
                        <Bar dataKey="usd" fill={chartConfig[activeYear].color} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}