"use client"

// Next and React Imports
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

// App Imports
import { User } from "@/lib/types"

// Firebase Imports
import { db, auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"

// Shadcn Imports
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthSignup() {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null)
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false)

    async function checkUsernameAvailability(username: string) {
        setIsCheckingUsername(true)
        setIsUsernameAvailable(null)
    
        try {
            const usernameRef = doc(db, "usernames", username)
            const usernameSnap = await getDoc(usernameRef)
    
            if (usernameSnap.exists()) {
                setIsUsernameAvailable(false)
            } else {
                setIsUsernameAvailable(true)
            }
        } catch (error) {
            console.error("Error checking username")
            setIsUsernameAvailable(false)
        } finally {
            setIsCheckingUsername(false)
        }
    }

    useEffect(() => {
        if (username.trim().length > 0) {
            const delayDebounceFn = setTimeout(() => {
                checkUsernameAvailability(username)
            }, 500) // 500ms debounce
    
            return () => clearTimeout(delayDebounceFn)
        } else {
            setIsUsernameAvailable(null)
        }
    }, [username])

    async function handleGoogleSignIn() {
        setIsLoading(true)
        setError(null)
    
        const provider = new GoogleAuthProvider()
    
        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user
            const generatedUsername = user.email?.split("@")[0] || "user"

            const usernameRef = doc(db, "usernames", generatedUsername)
            const usernameSnap = await getDoc(usernameRef)
            if (usernameSnap.exists()) {
                setError("Username is already taken. Please choose another one.")
                setIsLoading(false)
                return
            }
    
            // Check if user already exists in Firestore
            const userRef = doc(db, "users", user.uid)
            const userSnap = await getDoc(userRef)
    
            if (!userSnap.exists()) {
                const newUser: User = {
                    uid: user.uid,
                    name: user.displayName || "Anonymous",
                    username: generatedUsername,
                    email: user.email || "",
                    createdAt: new Date()
                }
                
                await setDoc(userRef, newUser)
                await setDoc(usernameRef, { uid: user.uid })
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
            const usernameRef = doc(db, "usernames", username)
            const usernameSnap = await getDoc(usernameRef)
            if (usernameSnap.exists()) {
                setError("Username is already taken. Please choose another one.")
                setIsLoading(false)
                return
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            
            const newUser: User = {
                uid: user.uid,
                name: name,
                username: username,
                email: email,
                createdAt: new Date()
            }

            await setDoc(doc(db, "users", newUser.uid), newUser)
            await setDoc(usernameRef, { uid: user.uid })
            router.push("/home")
        } catch (error: any) {
            console.error("Error signing up:", error.message)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

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
                    <form onSubmit={onSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="john_doe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase())}                                
                                disabled={isLoading}
                                required
                            />
                            {isCheckingUsername && <p className="text-sm text-gray-500">checking username...</p>}
                            {isUsernameAvailable === true && <p className="text-sm text-green-500">username is available</p>}
                            {isUsernameAvailable === false && <p className="text-sm text-red-500">username is taken</p>}
                        </div>
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
                            <Label htmlFor="password">password</Label>
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
                            {isLoading ? "Loading..." : "sign up"}
                        </Button>
                        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isLoading}>
                            sign up with google
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