// Next Imports
import Link from "next/link"

// Shadcn Imports
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthSignup() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl">sign up</CardTitle>
                    <CardDescription>
                        enter your details below to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action="/auth/signup" method="post" className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">name</Label>
                            <Input id="name" name="name" type="text" placeholder="John Doe" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">username</Label>
                            <Input id="username" name="username" type="text" placeholder="john_doe" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            sign up
                        </Button>
                        <Button variant="outline" className="w-full">
                            signup with google
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        already have an account?{" "}
                        <Link href="/auth/login" className="underline">
                            login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}