// Next Imports
import type { Metadata } from "next"
import { Inter } from "next/font/google"

// App Imports
import "./globals.css"

// Vercel Imports
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "worn",
	description: "fashion for you",
};

export const dynamic = 'force-dynamic'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
