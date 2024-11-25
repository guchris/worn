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
    items: {
        label: "# of items",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

// Helper function to get the past 3 months (including current month)
const getPastThreeMonths = () => {
    const today = new Date();
    const months = [];
    for (let i = 2; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1); // Go back i months
        const year = date.getFullYear();
        const month = date.toLocaleString("en-US", { month: "long" }); // Full month name
        months.push({ year, month, items: 0, spent: 0 });
    }
    return months;
}

export function ClosetBarChartThreeMonthsItems() {
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

                    if (purchaseDate) {
                        const date = new Date(purchaseDate);
                        const month = date.toLocaleString("en-US", { month: "long" });
                        const monthData = data.find((d) => d.month === month);
                        if (monthData) {
                            monthData.items += 1;
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
                <CardTitle>items purchased</CardTitle>
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
                        <Bar dataKey="items" fill="var(--color-items)" radius={8}>
                        <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                        />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}