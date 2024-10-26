import React from "react"

interface ClosetGridProps {
    items?: number[] // Placeholder for actual item data; replace with the appropriate type
}

const ClosetGrid: React.FC<ClosetGridProps> = ({ items = Array.from({ length: 40 }) }) => {
    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-5">
            {items.map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted/50" />
            ))}
        </div>
    )
}

export default ClosetGrid