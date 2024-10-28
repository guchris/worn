// Next Imports
import Image from "next/image"

// App Imports
import { Item } from "@/lib/types"

// Shadcn Imports
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ClosetGridProps {
    items: Item[];
    loading: boolean;
}

const ClosetGrid = ({ items, loading }: ClosetGridProps) => {
    return (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
                Array.from({ length: 20 }).map((_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                        <Skeleton className="w-full h-[350px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ))
            ) : (
                items.map((item) => (
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
                            <div className="line-clamp-1 text-left text-xs font-semibold">{item.brand}</div>
                            <div className="line-clamp-2 text-left text-xs">{item.name}</div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    )
}

export default ClosetGrid