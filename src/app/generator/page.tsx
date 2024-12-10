"use client"

// Next and React Imports
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// App Imports
import NavBar from "@/components/nav-bar"
import { useAuth } from "@/context/AuthContext"
import { Item } from "@/lib/types"

// Firebase Imports
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Shadcn Imports
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function GeneratorPage() {
    
    const { user, loading } = useAuth();
    const router = useRouter();

    const [closetItems, setClosetItems] = useState<{
        accessories: Item[];
        tops: Item[];
        bottoms: Item[];
    }>({
        accessories: [],
        tops: [],
        bottoms: [],
    });
    const [selectedOptions, setSelectedOptions] = useState<{
        accessories: string;
        tops: string;
        bottoms: string;
    }>({
        accessories: "",
        tops: "",
        bottoms: "",
    });
    const [loadingCloset, setLoadingCloset] = useState<boolean>(true);

	useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

    // Fetch closet items for the current user
    useEffect(() => {
        const fetchClosetItems = async () => {
            if (!user) return;

            setLoadingCloset(true);

            try {
                const closetCollection = collection(db, `users/${user.uid}/closet`);
                const snapshot = await getDocs(closetCollection);

                const accessories: Item[] = [];
                const tops: Item[] = [];
                const bottoms: Item[] = [];

                snapshot.forEach((doc) => {
                    const item = doc.data() as Item;
                    const categoryGroup = item.category.group.toLowerCase();
                    if (categoryGroup === "accessories") {
                        accessories.push(item);
                    } else if (categoryGroup === "tops") {
                        tops.push(item);
                    } else if (categoryGroup === "bottoms") {
                        bottoms.push(item);
                    }
                });

                setClosetItems({ accessories, tops, bottoms });

                // Generate initial random options
                setSelectedOptions({
                    accessories: accessories.length > 0 ? accessories[0].images[0] : "",
                    tops: tops.length > 0 ? tops[0].images[0] : "",
                    bottoms: bottoms.length > 0 ? bottoms[0].images[0] : "",
                });
            } catch (error) {
                console.error("Error fetching closet items:", error);
            } finally {
                setLoadingCloset(false);
            }
        };

        fetchClosetItems();
    }, [user]);

    // Generate a random item from a category and use its first image
    const generateRandomOption = (category: string) => {
        const items = closetItems[category as keyof typeof closetItems];
        if (items.length > 0) {
            const randomItem = items[Math.floor(Math.random() * items.length)];
            const firstImage = randomItem.images[0] || ""; // Use the first image, fallback to empty string
            setSelectedOptions((prev) => ({
                ...prev,
                [category]: firstImage,
            }));
        } else {
            setSelectedOptions((prev) => ({
                ...prev,
                [category]: "", // No image available
            }));
        }
    };
    

    if (loading) {
        return null;
    }

    if (!user) {
        return null;
    }

	return (
		<div className="relative flex flex-col md:flex-row min-h-screen overflow-hidden">
            <NavBar />
            <main className="flex-1 px-6 pb-6 space-y-6 md:p-8">
                <div className="space-y-2">
                    {["accessories", "tops", "bottoms"].map((category) => (
                        <Card
                            key={category}
                            className="shadow-none rounded-md cursor-pointer md:w-[300px]"
                            onClick={() => generateRandomOption(category)}
                        >
                            <CardContent className="p-0 flex justify-center items-center">
                                {selectedOptions[category as keyof typeof selectedOptions] && (
                                    <Image
                                    src={selectedOptions[category as keyof typeof selectedOptions]}
                                    alt={`${category} image`}
                                    width={300}
                                    height={400}
                                    className="object-cover"
                                    />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
		</div>
	)
}