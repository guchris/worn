"use client"

// Next and React Imports
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

// App Imports
import { categoryOptions, sizeOptions, conditionOptions } from "@/lib/selectOptions"

// Firebase Imports
import { collection, addDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { cn } from "@/lib/utils"

// Form Imports
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// Shadcn Imports
import { useToast } from "@/hooks/use-toast"
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
    category: z.string().min(1, "Category is required"),
    size: z.string().min(1, "Size is required"),
    color: z.string().min(1, "Color is required"),
    condition: z.string().min(1, "Condition is required"),
    purchaseCost: z.coerce.number().min(0, "Cost must be positive"),
    purchaseDate: z.date(),
    images: z.array(z.instanceof(File)).min(1, "At least one image is required")
});

type FormValues = z.infer<typeof formSchema>;

export default function AddItem() {
    const router = useRouter();
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            brand: "",
            category: "",
            size: "",
            color: "",
            condition: "",
            purchaseCost: 0,
            purchaseDate: new Date(),
            images: [],
        },
    });

    const onSubmit = async (values: FormValues) => {

        try {

            const userId = "vhDFojFLrNIjkqo0vCmI";

            // Parse the category and size values into objects with group and value
            const [categoryGroup, categoryValue] = values.category.split('_');
            const [sizeGroup, sizeValue] = values.size.split('_');

            // Upload images to Firebase Storage under `items/{itemId}` and get image URLs
            const imageUrls = await Promise.all(
                values.images.map(async (file) => {
                    const imageId = uuidv4();
                    const storageRef = ref(storage, `items/${imageId}`);
                    await uploadBytes(storageRef, file);
                    return await getDownloadURL(storageRef);
                })
            );

            // Add item data with parsed values to Firestore
            const docRef = await addDoc(collection(db, `users/${userId}/closet`), {
                name: values.name,
                brand: values.brand,
                color: values.color,
                condition: values.condition,
                category: { group: categoryGroup, value: categoryValue },
                size: { group: sizeGroup, value: sizeValue },
                purchaseCost: values.purchaseCost,
                purchaseDate: values.purchaseDate.toISOString().split("T")[0],
                images: imageUrls,
            });

            // Update the document to set its ID field with Firestore's auto-generated ID
            await updateDoc(docRef, { id: docRef.id });

            toast({
                title: "Item added successfully!",
                description: "Your clothing item has been added to your closet.",
            });
            router.push("/");
        } catch (e) {
            console.error("Error adding item:", e);
            toast({
                title: "Error adding item",
                description: "There was an error adding your item. Please try again.",
            });
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
                                        onValueChange={(value) => field.onChange(value)}
                                        defaultValue={field.value || ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoryOptions.map(({ group, items }) => (
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

                    {/* Size Field */}
                    <FormField
                        name="size"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => field.onChange(value)}
                                        defaultValue={field.value || ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sizeOptions.map(({ group, items }) => (
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
                                    <Select
                                        onValueChange={(value) => field.onChange(value)}
                                        defaultValue={field.value || ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {conditionOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
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
                                                        width={90}
                                                        height={120}
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

                    <Button type="submit">Add Item</Button>
                </form>
            </Form>
        </div>
    )
}