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

const getPastThreeMonths = () => {
    const today = new Date();
    const months = [];
    for (let i = 2; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.toLocaleString("en-US", { month: "long" });
        months.push({ year, month, items: 0, spent: 0, itemNames: [] as string[] });
    }
    return months;
};

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
                    const itemName = item.name || "Unnamed Item";
                
                    if (purchaseDate) {
                        const date = new Date(purchaseDate);
                        const month = date.toLocaleString("en-US", { month: "long" });
                        const year = date.getFullYear();
                        const monthData = data.find((d) => d.month === month && d.year === year);
                        if (monthData) {
                            monthData.items += 1;
                            monthData.itemNames.push(itemName);
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
                            content={({ payload, label }) => {
                                if (!payload || payload.length === 0) return null;
                                const monthData = payload[0].payload;

                                return (
                                    <div className="bg-white p-2 rounded shadow">
                                        <p className="font-semibold">{label}</p>
                                        <p>items: {monthData.items}</p>
                                        <div>
                                            <p>names:</p>
                                            {monthData.itemNames.length > 0 ? (
                                                monthData.itemNames.map((itemName: string, index: number) => (
                                                    <p key={index} className="ml-2">• {itemName}</p>
                                                ))
                                            ) : (
                                                <p className="ml-2">No items</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
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