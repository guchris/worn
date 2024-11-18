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


const NavLinks = ({ getLinkClass }: { getLinkClass: (path: string) => string }) => (
    <>
        <Link href="/home" className={getLinkClass("/home")}>home</Link>
        <Link href="/closet" className={getLinkClass("/closet")}>closet</Link>
        <Link href="/playground" className={getLinkClass("/playground")}>playground</Link>
        <Link href="/generator" className={getLinkClass("/generator")}>generator</Link>
        <Link href="/numbers" className={getLinkClass("/numbers")}>numbers</Link>
    </>
);

export default function NavBar() {
    const currentPath = usePathname();
    const { userData } = useAuth();
    const router = useRouter();

    // Function to add "font-bold" to the active link
    const getLinkClass = (path: string) =>
        `block hover:text-gray-500 ${currentPath === path ? "font-semibold" : ""} ${currentPath === path ? "aria-current='page'" : ""}`;

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
            <div className="hidden md:flex flex-col h-screen w-64 p-8 space-y-8">
                <div>
                    <h1 className="text-sm font-semibold">worn</h1>
                    <h2 className="text-sm">fashion for you</h2>
                </div>
                <nav className="text-sm">
                    <NavLinks getLinkClass={getLinkClass} />
                </nav>
                {userData && (
                    <div className="text-sm">
                        <p className="line-clamp-1 text-gray-500">{userData.username}</p>
                        <p className="line-clamp-1 text-gray-500">{userData.email}</p>
                    </div>
                )}
                <Button variant="link" onClick={handleLogout} className="block text-left hover:no-underline hover:text-gray-500 px-0">
                    logout
                </Button>
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden flex items-center justify-between p-4 w-full">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="flex flex-col space-y-4 w-full h-full p-4 pl-8">
                        <SheetTitle asChild>
                            <VisuallyHidden>worn navigation menu</VisuallyHidden>
                        </SheetTitle>
                        <div>
                            <h1 className="text-sm font-semibold">worn</h1>
                            <h2 className="text-sm">fashion for you</h2>
                        </div>
                        <nav className="text-sm">
                            <NavLinks getLinkClass={getLinkClass} />
                        </nav>
                        {userData && (
                            <div className="text-sm">
                                <p className="line-clamp-1 text-gray-500">{userData.username}</p>
                                <p className="line-clamp-1 text-gray-500">{userData.email}</p>
                            </div>
                        )}
                        <Button variant="link" onClick={handleLogout} className="block text-left hover:no-underline hover:text-gray-500 px-0">
                            logout
                        </Button>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}