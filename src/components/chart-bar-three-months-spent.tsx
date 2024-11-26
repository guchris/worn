"use client"

// React Imports
import { useEffect, useState } from "react"

// App Imports
import { useAuth } from "@/context/AuthContext"

// Firebase Imports
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Chart Imports
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

// Shadcn Imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
    spent: {
        label: "$ spent",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

// Helper function to get the past 3 months (including current month)
const getPastThreeMonths = () => {
    const today = new Date();
    const months = [];
    for (let i = 2; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.toLocaleString("en-US", { month: "long" }).toLowerCase();
        months.push({ year, month, items: 0, spent: 0 });
    }
    return months;
}

export function ClosetBarChartThreeMonthsSpent() {
    const { user } = useAuth();
    const [chartData, setChartData] = useState<any[]>(getPastThreeMonths());

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                const closetRef = collection(db, "users", user.uid, "closet");
                const snapshot = await getDocs(closetRef);

                const data = getPastThreeMonths();

                snapshot.forEach((doc) => {
                    const item = doc.data();
                    const purchaseDate = item.purchaseDate;
                    const purchaseCost = parseFloat(item.purchaseCost) || 0;
                
                    if (purchaseDate) {
                        const date = new Date(purchaseDate);
                        const month = date.toLocaleString("en-US", { month: "long" }).toLowerCase();
                        const year = date.getFullYear();
                        const monthData = data.find((d) => d.month === month && d.year === year);
                        if (monthData) {
                            monthData.spent = parseFloat((monthData.spent + purchaseCost).toFixed(2));
                        }
                    }
                });

                setChartData(data);
            } catch (error) {
                console.error("Error fetching closet data:", error);
            }
        };

        fetchData();
    }, [user]);

    return (
        <Card className="shadow-none rounded-md">
            <CardHeader>
                <CardTitle>amount spent</CardTitle>
                <CardDescription>last 3 months</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="spent" fill="var(--color-spent)" radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                                formatter={(value: number) => `$${value.toFixed(2)}`}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}