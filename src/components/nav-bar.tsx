"use client"

// Next Imports
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

// App Imports
import { User } from "@/lib/types"
import { fetchUserData } from "@/lib/firebaseFunctions"

// Shadcn Imports
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Menu } from "lucide-react"

export default function NavBar() {
    const currentPath = usePathname();

    // Function to add "font-bold" to the active link
    const getLinkClass = (path: string) => 
        `block hover:text-gray-500 ${currentPath === path ? "font-semibold" : ""}`;

    return (
        <>
            {/* Desktop Side Navigation */}
            <div className="hidden md:flex flex-col h-screen w-64 p-8 space-y-8">
                <div>
                    <h1 className="text-sm font-semibold">worn</h1>
                    <h2 className="text-sm">fashion for you</h2>
                </div>
                <nav className="text-sm">
                    <Link href="/home" className={getLinkClass("/home")}>home</Link>
                    <Link href="/closet" className={getLinkClass("/closet")}>closet</Link>
                    <Link href="/playground" className={getLinkClass("/playground")}>playground</Link>
                    <Link href="/generator" className={getLinkClass("/generator")}>generator</Link>
                    <Link href="/numbers" className={getLinkClass("/numbers")}>numbers</Link>
                </nav>
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden flex items-center justify-between p-4 w-full">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="flex flex-col space-y-8 w-full h-full p-4 pl-8">
                        <SheetTitle asChild>
                            <VisuallyHidden>worn navigation menu</VisuallyHidden>
                        </SheetTitle>
                        <div>
                            <h1 className="text-sm font-semibold">worn</h1>
                            <h2 className="text-sm">fashion for you</h2>
                        </div>
                        {/* {user && (
                            <div>
                                <p className="text-sm">{user.name}</p>
                                <p className="text-sm">{user.username}</p>
                            </div>
                        )} */}
                        <nav className="text-sm">
                            <Link href="/home" className={getLinkClass("/home")}>home</Link>
                            <Link href="/closet" className={getLinkClass("/closet")}>closet</Link>
                            <Link href="/playground" className={getLinkClass("/playground")}>playground</Link>
                            <Link href="/generator" className={getLinkClass("/generator")}>generator</Link>
                            <Link href="/numbers" className={getLinkClass("/numbers")}>numbers</Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}