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
        { name: "Categories", items: ["tops", "bottoms", "accessories"] },
        { name: "Brand", items: [] },
    ]);
    const [activeItems, setActiveItems] = useState<Record<string, boolean>>({});

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

    // Initialize active items state on load
    useEffect(() => {
        const defaultActiveItems = filterData.reduce((acc, filter) => {
            filter.items.forEach((item) => {
                acc[`${filter.name}-${item}`] = true; // Default to active for all
            });
            return acc;
        }, {} as Record<string, boolean>);

        setActiveItems(defaultActiveItems);
    }, [filterData]);

    // Apply filter updates after activeItems state changes
    useEffect(() => {
        const activeFilters: Record<string, string[]> = filterData.reduce((acc, filter) => {
            acc[filter.name] = filter.items.filter((item) => activeItems[`${filter.name}-${item}`]);
            return acc;
        }, {} as Record<string, string[]>);

        // Notify parent component
        onFiltersChange(activeFilters);
    }, [activeItems]);

    // Toggle item state
    const toggleItem = (filterName: string, item: string) => {
        setActiveItems((prev) => ({
            ...prev,
            [`${filterName}-${item}`]: !prev[`${filterName}-${item}`],
        }));
    };

    return (
		<div className="hidden lg:block w-36 flex-shrink-0 space-y-6">
            {filterData.map((filter) => (
                <div key={filter.name}>
                    <div className="text-sm font-semibold">
                        {filter.name.toLowerCase()}
                    </div>
                    <div className="mt-2 space-y-1">
                        {filter.items.map((item) => (
                            <label key={item} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={activeItems[`${filter.name}-${item}`] || false}
                                    onChange={() => toggleItem(filter.name, item)}
                                />
                                <span className="line-clamp-1 text-sm">{item}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
	);
}

export default ClosetFilters;