// Next and React Imports
import React from "react"
import Image from "next/image"

// App Imports
import { Item } from "@/lib/types"

// Shadcn Imports
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface ClosetGridProps {
    items: Item[];
}

const ClosetGrid = ({ items }: ClosetGridProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {items.map((item) => (
                <Card key={item.id} className="shadow-none rounded-md flex flex-col items-start">
                        
                    {/* Item Image */}
                    {item.images?.[0] && (
                        <div className="relative w-full p-2">
                            <Image
                                src={item.images[0]}
                                alt={item.name}
                                width={300}
                                height={400}
                                loading="lazy"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}

                    {/* Item Brand and Name */}
                    <CardContent className="p-4">
                        <div className="line-clamp-1 text-left text-sm font-semibold">{item.brand}</div>
                        <div className="line-clamp-1 text-left text-sm">{item.name}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default ClosetGrid