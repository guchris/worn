"use client"

// React Imports
import { useEffect, useState } from "react"

// App Imports
import { useAuth } from "@/context/AuthContext"

// Firebase Imports
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Chart Imports
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

// Shadcn Imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

const chartConfig = Object.fromEntries(
    colors.map((color, index) => [`color${index + 1}`, { color }])
) satisfies ChartConfig;

export function ClosetBarChartTopBrands() {
    const { user } = useAuth();
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchBrandData = async () => {
            if (!user) return;

            try {
                const closetRef = collection(db, "users", user.uid, "closet");
                const snapshot = await getDocs(closetRef);

                // Aggregate items by brand
                const brandCounts: Record<string, number> = {};
                snapshot.forEach((doc) => {
                    const item = doc.data();
                    const brand = item.brand || "Unknown";
                    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
                });

                // Prepare top 5 brands for the chart
                const topBrands = Object.entries(brandCounts)
                    .sort(([, a], [, b]) => b - a) // Sort by count, descending
                    .slice(0, 5)
                    .map(([brand, count], index) => ({
                        brand,
                        items: count,
                        fill: chartConfig[`color${index + 1}`]?.color, // Map the color dynamically
                    }));

                setChartData(topBrands);
            } catch (error) {
                console.error("Error fetching brand data:", error);
            }
        };

        fetchBrandData();
    }, [user]);

    return (
        <Card className="shadow-none rounded-md">
            <CardHeader>
                <CardTitle>top 5 brands</CardTitle>
                <CardDescription>based on your closet</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <YAxis
                            type="category"
                            dataKey="brand"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            hide
                        />
                        <XAxis
                            type="number"
                            dataKey="items"
                            hide
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="items"
                            layout="vertical"
                            radius={5}
                        >
                            <LabelList
                                dataKey="brand"
                                position="insideLeft"
                                offset={12}
                                style={{
                                    fill: "white",
                                    fontSize: 12,
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}