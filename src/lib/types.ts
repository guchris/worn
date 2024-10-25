export interface User {
    name: string;
    username: string;
    email: string;
}

export interface Item {
    id: string;
    name: string;
    brand: string;
    category: string
    size: string;
    color: string;
    condition: string;
    purchaseCost: number;
    purchaseDate: string;
    images: string[];
}