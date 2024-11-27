"use client"

// Next and React Imports
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"

// App Imports
import { Item } from "@/lib/types"
import NavBar from "@/components/nav-bar"
import { useAuth } from "@/context/AuthContext"

// Firebase Imports
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export default function ItemPage() {
    const { id } = useParams();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [item, setItem] = useState<Item | null>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.push("/auth/login");
            return;
        }

        if (!id) {
            console.error("No item ID provided.");
            router.push("/closet");
            return;
        }

        const fetchItem = async () => {
            try {
                const itemDoc = doc(db, `users/${user.uid}/closet/${id}`);
                const itemSnapshot = await getDoc(itemDoc);

                if (itemSnapshot.exists()) {
                    console.log("Item data:", itemSnapshot.data());
                    setItem({ id: itemSnapshot.id, ...itemSnapshot.data() } as Item);
                } else {
                    console.error("Item not found");
                }
            } catch (error) {
                console.error("Error fetching item:", error);
            } finally {
                setFetching(false);
            }
        };

        fetchItem();
    }, [user, loading, id, router]);

    if (loading || fetching) {
        return
    }

    if (!item) {
        return
    }

    return (
        <div className="relative flex flex-col md:flex-row min-h-screen overflow-hidden">
            <NavBar />
            <main className="flex-1 px-6 pb-6 space-y-6 md:p-8">
                <div>
                    <h1 className="text-xs font-semibold">name: {item.name}</h1>
                    <p className="text-xs">brand: {item.brand}</p>
                    <p className="text-xs">main category: {item.category.group}</p>
                    <p className="text-xs">sub category: {item.category.value}</p>
                    <p className="text-xs">size: {item.size.value}</p>
                    <p className="text-xs">color: {item.color}</p>
                    <p className="text-xs">condition: {item.condition}</p>
                    <p className="text-xs">cost: {item.purchaseCost}</p>
                    <p className="text-xs">date: {item.purchaseDate}</p>
                </div>
                {item.images?.[0] && (
                    <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={300}
                        height={400}
                        className="object-cover rounded-md"
                    />
                )}
            </main>
		</div>
    )
}
