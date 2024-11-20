// Firebase Imports
import { doc, collection, getDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"
import { User, Item } from "./types"


/**
 * Fetches user data from Firestore based on the provided user ID.
 * @param userId - The ID of the user to fetch data for.
 * @returns A User object if data exists, otherwise null.
 */
export async function fetchUserData(userId: string): Promise<User | null> {
    try {
        const userDoc = doc(db, "users", userId);
        const docSnapshot = await getDoc(userDoc);

        if (docSnapshot.exists()) {
            return docSnapshot.data() as User;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}



/**
 * Fetches closet items for a specific user from the Firestore database.
 *
 * @param userId - The ID of the user whose closet items are to be fetched.
 * @param filters - An optional object containing key-value pairs to filter the items.
 * @returns A promise that resolves to an array of Item objects.
 */
export async function fetchClosetItems(userId: string, filters: Record<string, string[]> = {}): Promise<Item[]> {
    try {
        const closetRef = collection(db, `users/${userId}/closet`);
        let closetQuery = query(closetRef);

        // Apply category group filter if provided
        if (filters.Categories && filters.Categories.length > 0) {
            const lowercaseCategories = filters.Categories.map((category) => category.toLowerCase());
            closetQuery = query(closetQuery, where("categoryGroup", "in", lowercaseCategories));
        }

        // Apply brand filter if provided
        if (filters.Brand && filters.Brand.length > 0) {
            const lowercaseBrands = filters.Brand.map((brand) => brand.toLowerCase());
            closetQuery = query(closetQuery, where("brand", "in", lowercaseBrands));
        }

        const querySnapshot = await getDocs(closetQuery);
        const items = querySnapshot.docs.map((doc) => {
            const data = doc.data();

            return {
                id: doc.id,
                name: data.name || "",
                brand: data.brand || "",
                category: {
                    group: data.category.group || "",
                    value: data.category.value || "",
                },
                size: {
                    group: data.size.group || "",
                    value: data.size.value || "",
                },
                color: data.color || "",
                condition: data.condition || "",
                purchaseCost: data.purchaseCost || 0,
                purchaseDate: data.purchaseDate || "",
                images: data.images || [],
            } as Item;
        });
        
        return items;
    } catch (error) {
        console.error("Error fetching closet items:", error);
        return [];
    }
}



/**
 * Fetches the unique brand names from a user's closet items, sorted alphabetically.
 *
 * @param userId - The ID of the user whose closet brand names are to be fetched.
 * @returns A promise that resolves to an array of unique, sorted brand names.
 */
export async function fetchUniqueBrands(userId: string): Promise<string[]> {
    try {
        const closetItems = await fetchClosetItems(userId);

        // Extract unique brands and sort them alphabetically
        const uniqueBrands = Array.from(new Set(closetItems.map(item => item.brand))).sort((a, b) => a.localeCompare(b));

        return uniqueBrands;
    } catch (error) {
        console.error("Error fetching unique brands:", error);
        return [];
    }
}