"use client"

// Next Imports
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

// App Imports
import { useAuth } from "@/context/AuthContext"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

// Shadcn Imports
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Menu } from "lucide-react"


const NavLinks = () => {
    const currentPath = usePathname();

    const linkStyles: { [key: string]: string } = {
        "/home": "hover:text-amber-500 text-amber-500",
        "/closet": "hover:text-green-500 text-green-500",
        "/playground": "hover:text-blue-500 text-blue-500",
        "/generator": "hover:text-purple-500 text-purple-500",
        "/numbers": "hover:text-pink-500 text-pink-500",
    };

    const getLinkClass = (path: string) => {
        const baseClass = "block";
        const activeClass = currentPath === path ? `${linkStyles[path]} font-semibold` : linkStyles[path].split(" ")[0]; // Keep hover color even if not active
        return `${baseClass} ${activeClass}`;
    };

    return (
        <>
            <Link href="/home" className={getLinkClass("/home")}>home</Link>
            <Link
                href="/closet"
                className={`text-sm ${
                    currentPath.startsWith("/closet") ? "font-bold text-green-500" : "text-gray-500"
                }`}
            >
                closet
            </Link>
            <Link href="/playground" className={getLinkClass("/playground")}>playground</Link>
            <Link href="/generator" className={getLinkClass("/generator")}>generator</Link>
            <Link href="/numbers" className={getLinkClass("/numbers")}>numbers</Link>
        </>
    );
};

export default function NavBar() {
    const currentPath = usePathname();
    const { userData } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
            console.log("User signed out successfully");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    
    return (
        <>
            {/* Desktop Side Navigation */}
            <div className="hidden md:flex flex-col h-screen w-48 flex-shrink-0 p-8 space-y-8">
                <div>
                    <h1 className="text-sm font-semibold">worn</h1>
                    <h2 className="text-sm">fashion for you</h2>
                </div>
                <nav className="text-sm">
                    <NavLinks />
                </nav>
                {userData && (
                    <div className="text-sm">
                        <p className="line-clamp-1 text-gray-500">{userData.username}</p>
                        <p className="line-clamp-1 text-gray-500">{userData.email}</p>
                    </div>
                )}
                <Button variant="link" onClick={handleLogout} className="block text-left hover:no-underline hover:text-red-500 px-0">
                    logout
                </Button>
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden flex items-center justify-between p-4 w-full">
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="flex flex-col space-y-4 w-full h-full p-4 pl-8 z-[9999]">
                            <SheetTitle asChild>
                                <VisuallyHidden>worn navigation menu</VisuallyHidden>
                            </SheetTitle>
                            <div>
                                <h1 className="font-semibold">worn</h1>
                                <h2 className="">fashion for you</h2>
                            </div>
                            <nav className="">
                                <NavLinks />
                            </nav>
                            {userData && (
                                <div className="">
                                    <p className="line-clamp-1 text-gray-500">{userData.username}</p>
                                    <p className="line-clamp-1 text-gray-500">{userData.email}</p>
                                </div>
                            )}
                            <Button variant="link" onClick={handleLogout} className="block text-left text-base hover:no-underline hover:text-red-500 px-0">
                                logout
                            </Button>
                        </SheetContent>
                    </Sheet>
                    <header className="">{currentPath.split("/")[1] || "home"}</header>
                </div>
            </div>
        </>
    )
}