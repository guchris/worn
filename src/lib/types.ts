export interface User {
    uid: string;
    name: string;
    username: string;
    email: string;
    createdAt: Date;
}

export interface Item {
    id: string;
    name: string;
    brand: string;
    category: {
        group: string;
        value: string;
    };
    size: {
        group: string;
        value: string;
    };
    color: string;
    condition: string;
    purchaseCost: number;
    purchaseDate: string;
    images: string[];
}