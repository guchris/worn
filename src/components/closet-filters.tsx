"use client"

// React Imports
import React, { useEffect, useState } from "react"

// App Imports
import { fetchUniqueBrands } from "@/lib/firebaseFunctions"

interface ClosetFiltersProps {
    userId: string;
    onFiltersChange: (filters: Record<string, string[]>) => void;
}

interface FilterItem {
    name: string;
    items: string[];
}

const ClosetFilters: React.FC<ClosetFiltersProps> = ({ userId, onFiltersChange }) => {
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
		<div className="hidden lg:block w-36 flex-shrink-0 space-y-6 pl-4">
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
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
	);
}

export default ClosetFilters;