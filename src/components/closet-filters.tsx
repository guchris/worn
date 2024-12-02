"use client"

// React Imports
import React, { useEffect, useState } from "react"

// App Imports
import { fetchUniqueBrands } from "@/lib/firebaseFunctions"

// Shadcn Imports
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ClosetFiltersProps {
    userId: string;
    onFiltersChange: (filters: Record<string, string[]>) => void;
    sortOption: string;
    onSortChange: (sort: string) => void;
}

interface FilterItem {
    name: string;
    items: string[];
}

const ClosetFilters: React.FC<ClosetFiltersProps> = ({ userId, onFiltersChange, sortOption, onSortChange }) => {
    const [filterData, setFilterData] = useState<FilterItem[]>([
        { name: "Categories", items: ["Tops", "Bottoms", "Accessories"] },
        { name: "Brand", items: [] },
    ]);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
        Categories: [],
        Brand: [],
    });

    // Fetch unique brands and update the "Brand" filter section
    useEffect(() => {
        const loadBrands = async () => {
            const brands = await fetchUniqueBrands(userId);
            setFilterData((prev) =>
                prev.map((filter) =>
                    filter.name === "Brand" ? { ...filter, items: brands } : filter
                )
            );
        };

        loadBrands();
    }, [userId]);

    // Notify parent component when activeFilters change
    useEffect(() => {
        onFiltersChange(activeFilters);
    }, [activeFilters, onFiltersChange]);

    // Toggle filter state
    const toggleFilter = (filterName: string, item: string) => {
        setActiveFilters((prev) => {
            const currentItems = prev[filterName] || [];
            const isActive = currentItems.includes(item);

            return {
                ...prev,
                [filterName]: isActive
                    ? currentItems.filter((filterItem) => filterItem !== item) // Remove filter
                    : [...currentItems, item], // Add filter
            };
        });
    };

    return (
        <>
            <div className="block md:hidden space-x-2">

                {/* Sort Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="px-4 py-2 text-sm border rounded-md">
                        sort
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {["date", "reverseDate", "mostExpensive", "leastExpensive"].map((sort) => (
                            <DropdownMenuItem
                                key={sort}
                                onClick={() => onSortChange(sort)}
                                className={sortOption === sort ? "font-bold text-green-500" : ""}
                            >
                                {sort === "date"
                                    ? "newest"
                                    : sort === "reverseDate"
                                    ? "oldest"
                                    : sort === "mostExpensive"
                                    ? "$$$ - $"
                                    : "$ - $$$"}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Category Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="px-4 py-2 text-sm border rounded-md">
                        categories
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {filterData[0].items.map((category) => (
                            <DropdownMenuItem
                                key={category}
                                onClick={(e) => {
                                    e.preventDefault(); // Ensure the click event doesn't bubble
                                    console.log("Category selected:", category);
                                    toggleFilter("Categories", category);
                                }}
                                className={activeFilters.Categories.includes(category) ? "font-bold text-green-500" : ""}
                            >
                                {category}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Brand Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="px-4 py-2 text-sm border rounded-md">
                        brands
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {filterData[1].items.map((brand) => (
                            <DropdownMenuItem
                                key={brand}
                                onClick={() => toggleFilter("Brand", brand)}
                                className={activeFilters.Brand.includes(brand) ? "font-bold text-green-500" : ""}
                            >
                                {brand}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear All Button */}
                <Button
                    onClick={() => {
                        setActiveFilters({ Categories: [], Brand: [] });
                        onSortChange("date");
                    }}
                    variant="outline"
                    className="text-red-500"
                >
                    clear
                </Button>
            </div>
            <div className="hidden md:block w-36 flex-shrink-0 space-y-6">
                <div>
                    <div className="text-sm">sort</div>
                    <div className="mt-2">
                        {["date", "reverseDate", "mostExpensive", "leastExpensive"].map((sort) => (
                            <button
                                key={sort}
                                onClick={() => onSortChange(sort)}
                                className={`text-sm text-left block ${
                                    sortOption === sort
                                        ? "font-bold text-green-500"
                                        : "text-gray-500"
                                }`}
                            >
                                {sort === "date"
                                    ? "newest"
                                    : sort === "reverseDate"
                                    ? "oldest"
                                    : sort === "mostExpensive"
                                    ? "$$$ - $"
                                    : "$ - $$$"}
                            </button>
                        ))}
                    </div>
                </div>
                {filterData.map((filter) => (
                    <div key={filter.name}>
                        <div className="text-sm">{filter.name.toLowerCase()}</div>
                        <div className="mt-2">
                            {filter.items.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => toggleFilter(filter.name, item)}
                                    className={`text-sm text-left line-clamp-1 ${
                                        activeFilters[filter.name]?.includes(item)
                                            ? "font-bold text-green-500"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {item.toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
	)
}

export default ClosetFilters;