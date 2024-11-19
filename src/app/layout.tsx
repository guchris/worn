// Next Imports
import type { Metadata } from "next"
import { Inter } from "next/font/google"

// App Imports
import "./globals.css"

// Vercel Imports
import { Analytics } from "@vercel/analytics/react"

// Context Imports
import { AuthProvider } from "@/context/AuthContext"

// Shadcn Imports
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "worn",
	description: "fashion for you",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthProvider>
			<html lang="en">
				<body className={inter.className}>
					{children}
					<Analytics />
					<Toaster />
				</body>
			</html>
		</AuthProvider>
	);
}
