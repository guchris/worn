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
import ClosetFilters from "@/components/closet-filters"

// Firebase Imports
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function ClosetPage() {
	const { user, loading } = useAuth();
    const router = useRouter();
	const [closetItems, setClosetItems] = useState<Item[]>([]);
    const [closetLoading, setClosetLoading] = useState<boolean>(true);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
		Categories: [],
		Brand: [],
	});
    const [sortOption, setSortOption] = useState<string>("date");

	useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

	// Fetch closet items for the current user
    useEffect(() => {
        const fetchClosetItems = async () => {
            if (!user) return;

            setClosetLoading(true);

            try {
                const closetCollection = collection(db, `users/${user.uid}/closet`);
                const snapshot = await getDocs(closetCollection);
                const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Item[];
                console.log("Fetched closet items:", items);
                setClosetItems(items);
            } catch (error) {
                console.error("Error fetching closet items:", error);
            } finally {
                setClosetLoading(false);
            }
        };

        fetchClosetItems();
    }, [user]);

    const filteredItems = closetItems.filter((item) => {
        const noFiltersApplied =
            activeFilters.Categories.length === 0 && activeFilters.Brand.length === 0;
        if (noFiltersApplied) return true;
    
        const categoryMatch =
            activeFilters.Categories.length === 0 ||
            activeFilters.Categories.map((category) => category.toLowerCase()).includes(
                item.category.group.toLowerCase()
            );
    
        const brandMatch =
            activeFilters.Brand.length === 0 ||
            activeFilters.Brand.map((brand) => brand.toLowerCase()).includes(
                item.brand.toLowerCase()
            );
    
        return categoryMatch && brandMatch;
    });

	// Handle filter change
	const handleFilterChange = (filters: Record<string, string[]>) => {
        setActiveFilters(filters);
    };

    const sortedItems = filteredItems.sort((a, b) => {
        switch (sortOption) {
            case "date":
                if (a.purchaseDate === b.purchaseDate) {
                    return a.name.localeCompare(b.name);
                }
                return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
            case "reverseDate":
                if (a.purchaseDate === b.purchaseDate) {
                    return b.name.localeCompare(a.name);
                }
                return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
            case "mostExpensive":
                return b.purchaseCost - a.purchaseCost;
            case "leastExpensive":
                return a.purchaseCost - b.purchaseCost;
            default:
                return 0;
        }
    });

    const handleSortChange = (sort: string) => {
        setSortOption(sort);
    };

	// Show nothing while redirecting
    if (!user) {
        return null;
    }

	return (
		<div className="relative flex flex-col md:flex-row min-h-screen overflow-hidden">
            <NavBar />

            <main className="flex-1 px-6 pb-6 space-y-6 md:space-y-0 md:p-8 md:flex md:gap-8">
                {/* Closet Grid Section */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="hidden md:block text-sm font-semibold">closet</p>
                        <Link href="/add-item" className="text-sm hover:text-green-500">
                            + add clothing item
                        </Link>
                    </div>
                    <ClosetGrid items={filteredItems} loading={closetLoading} />
                </div>
                {/* Filters Column */}
                <aside className="space-y-4">
                    <p className="text-sm font-semibold hidden md:block">filters</p>
                    <ClosetFilters
                        userId={user.uid}
                        onFiltersChange={handleFilterChange}
                        sortOption={sortOption}
                        onSortChange={handleSortChange}
                    />
                </aside>
            </main>
		</div>
	)
}