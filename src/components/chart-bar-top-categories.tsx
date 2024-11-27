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

export function ClosetBarChartTopCategories() {
    const { user } = useAuth();
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchSubCategoryData = async () => {
            if (!user) return;

            try {
                const closetRef = collection(db, "users", user.uid, "closet");
                const snapshot = await getDocs(closetRef);

                // Aggregate items by sub-category (value field of category)
                const subCategoryCounts: Record<string, number> = {};
                snapshot.forEach((doc) => {
                    const item = doc.data();
                    const subCategory = item.category?.value || "Unknown";
                    subCategoryCounts[subCategory] = (subCategoryCounts[subCategory] || 0) + 1;
                });

                // Prepare top 5 sub-categories for the chart
                const topSubCategories = Object.entries(subCategoryCounts)
                    .sort(([, a], [, b]) => b - a) // Sort by count, descending
                    .slice(0, 5)
                    .map(([subCategory, count], index) => ({
                        subCategory,
                        items: count,
                        fill: chartConfig[`color${index + 1}`]?.color, // Map the color dynamically
                    }));

                setChartData(topSubCategories);
            } catch (error) {
                console.error("Error fetching sub-category data:", error);
            }
        };

        fetchSubCategoryData();
    }, [user]);

    return (
        <Card className="shadow-none rounded-md">
            <CardHeader>
                <CardTitle>top 5 categories</CardTitle>
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
                            dataKey="subCategory"
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
                                dataKey="subCategory"
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
