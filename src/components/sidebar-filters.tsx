"use client"

// React Imports
import * as React from "react"
import { useState } from "react"

// Shadcn Imports
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarSeparator } from "@/components/ui/sidebar"
import { Check, ChevronRight } from "lucide-react"


const filterData = [
    { name: "Categories", items: ["Tops", "Bottoms", "Accessories"] },
    { name: "Sort", items: ["Newest", "Oldest", "Most Expensive", "Least Expensive"] },
    { name: "Brand", items: ["Brand A", "Brand B", "Brand C"] },
];

export default function SidebarFilters() {

    const defaultActiveItems = filterData.reduce((acc, filter) => {
        filter.items.forEach((item) => {
            acc[`${filter.name}-${item}`] = true;
        });
        return acc;
    }, {} as Record<string, boolean>);

    const [activeItems, setActiveItems] = useState<Record<string, boolean>>(defaultActiveItems);

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
                        <Collapsible defaultOpen={index === 0} className="group/collapsible">
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