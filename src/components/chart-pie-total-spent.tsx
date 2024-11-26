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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
    amount: {
        label: "amount spent",
    },
    tops: {
        color: "hsl(var(--chart-1))",
    },
    bottoms: {
        color: "hsl(var(--chart-2))",
    },
    accessories: {
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

export function ClosetPieChartTotalSpent() {
    const { user } = useAuth();
    const [chartData, setChartData] = useState<any[]>([]);
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
        const fetchClosetData = async () => {
            if (!user) return;
            try {
                const closetRef = collection(db, "users", user.uid, "closet");
                const snapshot = await getDocs(closetRef);
    
                const categorySpending = { tops: 0, bottoms: 0, accessories: 0 };
    
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    console.log("Firestore Data:", data); // Log Firestore data
                    const categoryGroup = data.category?.group as keyof typeof categorySpending;
                    const price = data.purchaseCost || 0; // Ensure you're using the correct field
                    if (categorySpending[categoryGroup] !== undefined) {
                        categorySpending[categoryGroup] += price;
                    }
                });
    
                console.log("Category Spending:", categorySpending); // Log processed data
    
                const dataForChart = Object.entries(categorySpending).map(([category, amount]) => ({
                    category,
                    amount,
                    fill: `var(--color-${category})`,
                }));
    
                console.log("Chart Data for Pie:", dataForChart); // Log chart data
    
                setChartData(dataForChart);
                setTotalSpent(Object.values(categorySpending).reduce((acc, curr) => acc + curr, 0));
            } catch (error) {
                console.error("Error fetching closet data:", error);
            }
        };
    
        fetchClosetData();
    }, [user]);

    // Ensure chart always shows all categories with 0 spending if there's no data
    const chartDataWithDefaults = chartData.length > 0 ? chartData : [
        { category: "tops", amount: 0, fill: "hsl(var(--chart-1))" },
        { category: "bottoms", amount: 0, fill: "hsl(var(--chart-2))" },
        { category: "accessories", amount: 0, fill: "hsl(var(--chart-3))" },
    ];

    const formatTotalSpent = (total: number): string => {
        if (total < 1000) {
            return `$${Math.round(total)}`;
        }
        return `$${(total / 1000).toFixed(1)}k`;
    };

    return (
        <Card className="shadow-none rounded-md">
            <CardHeader className="text-left pb-0">
                <CardTitle>closet spending</CardTitle>
                <CardDescription>your spending stats by category</CardDescription>
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
                            data={chartDataWithDefaults}
                            dataKey="amount"
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
                                                    {formatTotalSpent(totalSpent)}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    total spent
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
        </Card>
    )
}