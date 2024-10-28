"use client"

// React Imports
import * as React from "react"
import { useEffect, useState } from "react"

// App Imports
import { fetchUniqueBrands } from "@/lib/firebaseFunctions"

// Shadcn Imports
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarSeparator } from "@/components/ui/sidebar"
import { Check, ChevronRight } from "lucide-react"

interface SidebarFiltersProps {
    userId: string;
}

interface FilterItem {
    name: string;
    items: string[];
}

export default function SidebarFilters({ userId }: SidebarFiltersProps) {
    
    const [filterData, setFilterData] = useState<FilterItem[]>([
        { name: "Categories", items: ["Tops", "Bottoms", "Accessories"] },
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
                acc[`${filter.name}-${item}`] = true;
            });
            return acc;
        }, {} as Record<string, boolean>);

        setActiveItems(defaultActiveItems);
    }, [filterData]);

    const toggleItem = (filterName: string, item: string) => {
        setActiveItems((prev) => ({
            ...prev,
            [`${filterName}-${item}`]: !prev[`${filterName}-${item}`],
        }));
    };

    return (
        <>
            {filterData.map((filter, index) => (
                <React.Fragment key={filter.name}>
                    <SidebarGroup key={filter.name} className="py-0">
                        <Collapsible defaultOpen={true} className="group/collapsible">
                            <SidebarGroupLabel asChild className="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                <CollapsibleTrigger>
                                    {filter.name}
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]:rotate-90" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {filter.items.map((item) => (
                                            <SidebarMenuItem key={item}>
                                                <SidebarMenuButton onClick={() => toggleItem(filter.name, item)}>
                                                    <div
                                                        data-active={activeItems[`${filter.name}-${item}`]}
                                                        className="group/calendar-item flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary"
                                                    >
                                                        <Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
                                                    </div>
                                                    {item}
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </SidebarGroup>
                    <SidebarSeparator className="mx-0" />
                </React.Fragment>
            ))}
        </>
    )
}