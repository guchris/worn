// Next Imports
import Link from "next/link"

// Shadcn Imports
import { Button } from "@/components/ui/button"

export default function TopBar() {
    return (
        <header className="w-full flex items-center justify-between space-x-4 p-4 h-16">
            <div className="text-xl font-semibold">
                <Link href="/">worn</Link>
            </div>
            <div className="space-x-2">
                <Link href="/auth/login">
                    <Button>login</Button>
                </Link>
                <Link href="/auth/sign-up">
                    <Button variant="outline">sign up</Button>
                </Link>
            </div>
        </header>
    );
}