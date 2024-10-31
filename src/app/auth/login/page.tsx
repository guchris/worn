// Next Imports
import Link from "next/link"

// Shadcn Imports
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthLogin() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl">login</CardTitle>
                    <CardDescription>
                        enter your email and password below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">password</Label>
                                <Link
                                    href="#"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    forgot your password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            login
                        </Button>
                        <Button variant="outline" className="w-full">
                            login with google
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        don&apos;t have an account?{" "}
                        <Link href="/auth/sign-up" className="underline">
                            sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
