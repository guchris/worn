// Next Imports
import Link from "next/link"

export default function Home() {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden">
			<div className="flex space-x-4">
				<div className="flex flex-col items-start text-xl font-bold">
					{Array.from({ length: 24 }).map((_, index) => (
						<span key={index} className="leading-none">
							W O R N
						</span>
					))}
				</div>

				<div className="flex flex-col items-start justify-center text-xl font-bold">
					<Link href="/auth/login" className="leading-none hover:underline">
						L O G I N
					</Link>
					<Link href="/demo" className="leading-none hover:underline">
						D E M O
					</Link>
				</div>

			</div>
		</div>
	)
}