"use client"

// Next and React Imports
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// App Imports
import { Item } from "@/lib/types"
import NavBar from "@/components/nav-bar"
import { useAuth } from "@/context/AuthContext"
import ClosetGrid from "@/components/closet-grid"

// Firebase Imports
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function ClosetPage() {
	const { user, loading: authLoading } = useAuth();
    const router = useRouter();
	const [closetItems, setClosetItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

	 // Redirect to login only after authLoading is complete
	 useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
        }
    }, [authLoading, user, router]);

	// Fetch closet items for the current user
    useEffect(() => {
        const fetchClosetItems = async () => {
            if (!user) return;

            setLoading(true);

            try {
                const closetCollection = collection(db, `users/${user.uid}/closet`);
                const snapshot = await getDocs(closetCollection);
                const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Item[];
                setClosetItems(items);
            } catch (error) {
                console.error("Error fetching closet items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClosetItems();
    }, [user]);

	// Show nothing while redirecting
    if (!user) {
        return null;
    }

	return (
		<div className="relative flex flex-col md:flex-row min-h-screen overflow-hidden">
            <NavBar />
            <div className="w-full p-6 md:p-8 space-y-4">
				<div className="flex items-center justify-between">
					<p className="hidden md:block text-sm">closet</p>
					<Link href="/add-item" className="text-sm hover:text-green-500" passHref>
						+ add clothing item
					</Link>
				</div>
				<ClosetGrid items={closetItems} loading={loading} />
            </div>
		</div>
	)
}