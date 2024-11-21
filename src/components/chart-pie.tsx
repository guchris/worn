"use client"

// React Imports
import { useEffect, useState } from "react"

// App Imports
import { useAuth } from "@/context/AuthContext"

// Firestore Imports
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Shadcn Imports
import { Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
    count: {
        label: "items count",
    },
    tops: {
        label: "tops",
        color: "hsl(var(--chart-1))",
    },
    bottoms: {
        label: "bottoms",
        color: "hsl(var(--chart-2))",
    },
    accessories: {
        label: "accessories",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

export function ClosetPieChart() {
    const { user } = useAuth();
    const [chartData, setChartData] = useState<any[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const fetchClosetData = async () => {
            if (!user) return; // Ensure user is available before proceeding
            try {
                const closetRef = collection(db, "users", user.uid, "closet");
                const snapshot = await getDocs(closetRef);

                const categoryCounts = { tops: 0, bottoms: 0, accessories: 0 };

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const categoryGroup = data.category?.group as keyof typeof categoryCounts;
                    if (categoryCounts[categoryGroup] !== undefined) {
                        categoryCounts[categoryGroup]++;
                    }
                });

                const dataForChart = Object.entries(categoryCounts).map(([category, count]) => ({
                    category,
                    count,
                    fill: `var(--color-${category})`,
                }));

                setChartData(dataForChart);
                setTotalItems(Object.values(categoryCounts).reduce((acc, curr) => acc + curr, 0));
            } catch (error) {
                console.error("Error fetching closet data:", error);
            }
        };

        fetchClosetData();
    }, [user]);

    if (chartData.length === 0) {
        return <p className="text-center">no items in your closet yet</p>;
    }

    return (
        <Card className="flex flex-col shadow-none rounded-md">
            <CardHeader className="text-left pb-0 space-y-0">
                <CardTitle className="text-sm">closet breakdown</CardTitle>
                <CardDescription className="text-sm">your item stats by category</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="category"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalItems.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    total items
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    trending up by 5.2% this month
                </div>
                <div className="leading-none text-muted-foreground">
                    showing stats for your entire closet
                </div>
            </CardFooter> */}
        </Card>
    )
}