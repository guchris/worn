"use client"

// Next and React Imports
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Firebase Imports
import { collection, addDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { cn } from "@/lib/utils"

// Form Imports
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// Shadcn Imports
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectContent, SelectItem } from "@/components/ui/select"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { CalendarIcon } from "@radix-ui/react-icons"

// Other Imports
import { format } from "date-fns"
import { v4 as uuidv4 } from "uuid"


// Validation Schema
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    brand: z.string().min(1, "Brand is required"),
    category: z.object({
        group: z.string().min(1, "Category group is required"),
        value: z.string().min(1, "Category value is required"),
    }),
    size: z.object({
        group: z.string().min(1, "Size group is required"),
        value: z.string().min(1, "Size value is required"),
    }),
    color: z.string().min(1, "Color is required"),
    condition: z.string().min(1, "Condition is required"),
    purchaseCost: z.coerce.number().min(0, "Cost must be positive"),
    purchaseDate: z.date(),
    images: z.array(z.instanceof(File)).min(1, "At least one image is required")
});

type FormValues = z.infer<typeof formSchema>;

// Define grouped categories
const categories = [
    { group: "Tops", items: ["Cardigans", "Coats", "Hoodies", "Jackets", "Overshirts", "Shirts", "Sweaters", "Sweatshirts", "Tank Tops", "Vests"] },
    { group: "Bottoms", items: ["Leggings", "Pants", "Shorts", "Swim"] },
    { group: "Accessories", items: ["Bags", "Hats", "Jewelry", "Scarfs", "Shoes", "Sunglasses"] },
    { group: "Other", items: ["Onesies", "Overalls"] },
];

const sizeGroups = [
    {
        group: "General Sizes",
        items: [
            { label: "XS", value: "general_xs" },
            { label: "S", value: "general_s" },
            { label: "M", value: "general_m" },
            { label: "L", value: "general_l" },
            { label: "XL", value: "general_xl" },
            { label: "OS (One Size)", value: "general_os" },
        ],
    },
    {
        group: "Numeric General Sizes",
        items: [
            { label: "0", value: "num_general_0" },
            { label: "2", value: "num_general_2" },
            { label: "4", value: "num_general_4" },
            { label: "6", value: "num_general_6" },
            { label: "8", value: "num_general_8" },
            { label: "10", value: "num_general_10" },
            { label: "12", value: "num_general_12" },
            { label: "14", value: "num_general_14" },
            { label: "16", value: "num_general_16" },
            { label: "18", value: "num_general_18" },
        ],
    },
    {
        group: "Pant Sizes (Waist x Inseam)",
        items: [
            { label: "28x30", value: "pant_28x30" },
            { label: "28x32", value: "pant_28x32" },
            { label: "30x30", value: "pant_30x30" },
            { label: "30x32", value: "pant_30x32" },
            { label: "32x30", value: "pant_32x30" },
            { label: "32x32", value: "pant_32x32" },
            { label: "34x30", value: "pant_34x30" },
            { label: "34x32", value: "pant_34x32" },
            { label: "36x30", value: "pant_36x30" },
            { label: "36x32", value: "pant_36x32" },
            { label: "38x30", value: "pant_38x30" },
            { label: "38x32", value: "pant_38x32" },
        ],
    },
    {
        group: "Men’s Shoe Sizes",
        items: [
            { label: "6", value: "mens_shoe_6" },
            { label: "7", value: "mens_shoe_7" },
            { label: "8", value: "mens_shoe_8" },
            { label: "9", value: "mens_shoe_9" },
            { label: "10", value: "mens_shoe_10" },
            { label: "11", value: "mens_shoe_11" },
            { label: "12", value: "mens_shoe_12" },
            { label: "13", value: "mens_shoe_13" },
        ],
    },
    {
        group: "Women’s Shoe Sizes",
        items: [
            { label: "5", value: "womens_shoe_5" },
            { label: "6", value: "womens_shoe_6" },
            { label: "7", value: "womens_shoe_7" },
            { label: "8", value: "womens_shoe_8" },
            { label: "9", value: "womens_shoe_9" },
            { label: "10", value: "womens_shoe_10" },
            { label: "11", value: "womens_shoe_11" },
        ],
    },
];



export default function AddItem() {
    const router = useRouter();
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            brand: "",
            category: { group: "", value: "" },
            size: { group: "", value: "" },
            color: "",
            condition: "",
            purchaseCost: 0,
            purchaseDate: new Date(),
            images: [],
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            // Generate a unique UUID for this item
            const itemId = uuidv4();

            // Upload images to Firebase Storage under `items/{itemId}` and get download URLs
            const imageUrls = await Promise.all(
                values.images.map(async (file) => {
                    // Generate a unique UUID for each image file
                    const imageId = uuidv4();
                    const storageRef = ref(storage, `items/${itemId}/${imageId}-${file.name}`);
                    await uploadBytes(storageRef, file);
                    return await getDownloadURL(storageRef);
                })
            );

            // Add item data with image URLs to Firestore
            const docRef = await addDoc(collection(db, "closet"), {
                id: itemId,
                ...values,
                category: values.category,
                size: values.size,
                purchaseDate: values.purchaseDate.toISOString(),
                images: imageUrls,
            });

            console.log("Document written with ID: ", docRef.id);
            router.push("/");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-semibold mb-6">Add Clothing Item</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Name Field */}
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Clothing Item Name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Brand Field */}
                    <FormField
                        name="brand"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Brand Name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category Field */}
                    <FormField
                        name="category"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => {
                                            // Find the group name for the selected value
                                            const selectedGroup = categories.find(group => group.items.includes(value))?.group;
                                            field.onChange({ group: selectedGroup, value }); // Store both group and value
                                        }}
                                        defaultValue={field.value?.value || ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(({ group, items }) => (
                                                <SelectGroup key={group}>
                                                    <SelectLabel>{group}</SelectLabel>
                                                    {items.map(item => (
                                                        <SelectItem key={item} value={item.toLowerCase()}>{item}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Size Field */}
                    <FormField
                        name="size"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => {
                                            const selectedGroup = sizeGroups.find(group =>
                                                group.items.some(item => item.value === value)
                                            )?.group;
                                            field.onChange({ group: selectedGroup || "", value }); // Store as an object with group and value
                                        }}
                                        defaultValue={field.value?.value || ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sizeGroups.map(({ group, items }) => (
                                                <SelectGroup key={group}>
                                                    <SelectLabel>{group}</SelectLabel>
                                                    {items.map(item => (
                                                        <SelectItem key={item.value} value={item.value}>
                                                            {item.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Color Field */}
                    <FormField
                        name="color"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter color" />
                                </FormControl>
                                <FormDescription>
                                    Specify the color (e.g., "Olive Green," "Coral").
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Condition Field */}
                    <FormField
                        name="condition"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Condition</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            {field.value || "Select Condition"}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="used">Used</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Purchase Cost Field */}
                    <FormField
                        name="purchaseCost"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Purchase Cost</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" placeholder="$0.00" min="0" step="0.01" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Purchase Date Field */}
                    <FormField
                        control={form.control}
                        name="purchaseDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Purchase Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP") // Format the selected date
                                                ) : (
                                                    <span>Select a purchase date</span> // Placeholder text
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange} // Update form state on date selection
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Images Upload Field */}
                    <FormField
                        name="images"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Clothing Images</FormLabel>
                                <FormControl>
                                    <div>
                                        <div className="flex flex-wrap gap-4 mb-4">
                                            {imagePreviews.map((src, index) => (
                                                <div key={index} className="relative w-32 h-32">
                                                    <Image
                                                        src={src}
                                                        alt={`Image Preview ${index + 1}`}
                                                        width={128}
                                                        height={128}
                                                        className="rounded-lg object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const files = Array.from(e.target.files || []);
                                                field.onChange(files);
                                                setImagePreviews(files.map((file) => URL.createObjectURL(file)));
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Upload images of the clothing item (JPG, PNG, etc.).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full mt-4">
                        Add Item
                    </Button>
                </form>
            </Form>
        </div>
    )
}