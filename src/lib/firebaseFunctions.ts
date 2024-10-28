// Firebase Imports
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"
import { Item } from "./types"

export async function fetchClosetItems(userId: string, filters: Record<string, any> = {}): Promise<Item[]> {
    try {
        const closetRef = collection(db, `users/${userId}/closet`);
        let closetQuery = query(closetRef);

        // Apply filters dynamically if any are provided
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                closetQuery = query(closetQuery, where(key, "==", filters[key]));
            }
        });

        const querySnapshot = await getDocs(closetQuery);
        const items = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            
            return {
                id: doc.id,
                name: data.name || "",
                brand: data.brand || "",
                category: data.category || "",
                size: data.size || "",
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