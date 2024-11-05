"use client"

// Next Imports
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

// App Imports
import { User } from "@/lib/types"

// Firebase Imports
import { db, auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"

// Shadcn Imports
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthLogin() {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    async function handleGoogleSignIn() {
        setIsLoading(true)
        setError(null)
    
        const provider = new GoogleAuthProvider()
    
        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user
    
            // Check if user already exists in Firestore
            const userRef = doc(db, "users", user.uid)
            const userSnap = await getDoc(userRef)
    
            if (!userSnap.exists()) {

                const newUser: User = {
                    uid: user.uid,
                    name: user.displayName || "Anonymous",
                    username: user.email?.split("@")[0] || "anon",
                    email: user.email || "",
                    createdAt: new Date()
                }

                await setDoc(userRef, newUser)
                await setDoc(doc(db, "usernames", newUser.username), { uid: user.uid })
            }

            router.push("/home")
        } catch (error: any) {
            console.error("Error signing in with Google:", error.message)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push("/home")
        } catch (error: any) {
            console.error("Error signing in:", error.message)
            setError("Invalid credentials. Have you signed up yet?");
        } finally {
            setIsLoading(false)
        }
    }
    
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
                    <form onSubmit={onSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
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
                                placeholder="your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoCapitalize="none"
                                autoComplete="current-password"
                                autoCorrect="off"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Loading..." : "login"}
                        </Button>
                        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isLoading}>
                            login with google
                        </Button>
                    </form>
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
