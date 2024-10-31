"use client"

// Next and React Imports
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Other Imports
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons"

interface DraggableItem {
    id: number;
    x: number;
    y: number;
    zIndex: number;
    type: "image" | "text";
    src?: string;
    content?: string;
}

export default function DemoPlayground() {
    const router = useRouter();
    const MIN_DISTANCE = 100;

    // Function to generate random positions ensuring minimum distance
    function generateRandomPosition(existingItems: DraggableItem[]): { x: number; y: number } {
        const maxX = window.innerWidth - 100;
        const maxY = window.innerHeight - 120;
    
        let x: number, y: number, isTooClose: boolean;
    
        do {
            x = Math.floor(Math.random() * maxX);
            y = Math.floor(Math.random() * maxY);
    
            // Check if the new position is too close to existing items
            isTooClose = existingItems.some(
                (item) =>
                    Math.abs(item.x - x) < MIN_DISTANCE && Math.abs(item.y - y) < MIN_DISTANCE
            );
        } while (isTooClose);
    
        return { x, y };
    }

    const [items, setItems] = useState<DraggableItem[]>([]);

    // Set initial items after component mounts
    useEffect(() => {
        const initialItems: DraggableItem[] = [
            // Left-aligned text items positioned conditionally for mobile and desktop
            { id: 11, x: 30, y: window.innerWidth >= 768 ? 20 : window.innerHeight - 80, zIndex: 11, type: "text", content: "worn" },
            { id: 12, x: 30, y: window.innerWidth >= 768 ? 40 : window.innerHeight - 60, zIndex: 12, type: "text", content: "fashion for you" },
            
            // Right-aligned text items positioned conditionally for mobile and desktop
            { id: 13, x: window.innerWidth >= 768 ? window.innerWidth - 70 : window.innerWidth - 80, y: window.innerWidth >= 768 ? 20 : window.innerHeight - 80, zIndex: 13, type: "text", content: "login" },
            { id: 14, x: window.innerWidth >= 768 ? window.innerWidth - 62 : window.innerWidth - 72, y: window.innerWidth >= 768 ? 40 : window.innerHeight - 60, zIndex: 14, type: "text", content: "join" },
        ];

        // Generate random positions for image items without overlap
        for (let i = 1; i <= 10; i++) {
            const { x, y } = generateRandomPosition(initialItems);
            initialItems.push({ id: i, x, y, zIndex: i, type: "image", src: `/playground/item${i}.png` });
        }

        setItems(initialItems);
    }, []);

    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [touchOffset, setTouchOffset] = useState({ offsetX: 0, offsetY: 0 });

    // Bringing an item to the front
    const bringToFront = (id: number) => {
        setItems((prevItems) => {
            const targetItem = prevItems.find((item) => item.id === id);
            if (!targetItem) return prevItems;

            const nextZIndex = targetItem.zIndex + 1;
            return prevItems.map((item) =>
                item.id === id
                    ? { ...item, zIndex: nextZIndex }
                    : item.zIndex === nextZIndex
                    ? { ...item, zIndex: item.zIndex - 1 }
                    : item
            );
        });
    };

    // Sending an item to the back
    const sendToBack = (id: number) => {
        setItems((prevItems) => {
            const targetItem = prevItems.find((item) => item.id === id);
            if (!targetItem) return prevItems;

            const prevZIndex = targetItem.zIndex - 1;
            return prevItems.map((item) =>
                item.id === id
                    ? { ...item, zIndex: prevZIndex }
                    : item.zIndex === prevZIndex
                    ? { ...item, zIndex: item.zIndex + 1 }
                    : item
            );
        });
    };

    // Mouse down event to start dragging
    const handleMouseDown = (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedItemId(id);
        setIsDragging(true);
    };

    // Touch start event to start dragging (for mobile)
    const handleTouchStart = (id: number, event: React.TouchEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setSelectedItemId(id);
        setIsDragging(true);

        const touch = event.touches[0];
        const item = items.find((item) => item.id === id);
        if (item) {
            setTouchOffset({
                offsetX: touch.clientX - item.x,
                offsetY: touch.clientY - item.y,
            });
        }
    };

    // Stops dragging on mouse release
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Stops dragging on touch release (for mobile)
    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Updates position based on mouse movement while dragging
    const handleMouseMove = (event: React.MouseEvent) => {
        if (isDragging && selectedItemId !== null) {
            const { movementX, movementY } = event;
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === selectedItemId
                        ? { ...item, x: item.x + movementX, y: item.y + movementY }
                        : item
                )
            );
        }
    };

    // Updates position based on touch movement while dragging (for mobile)
    const handleTouchMove = (event: React.TouchEvent) => {
        if (isDragging && selectedItemId !== null) {
            event.preventDefault();
            const touch = event.touches[0];
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === selectedItemId
                        ? {
                            ...item,
                            x: touch.clientX - touchOffset.offsetX,
                            y: touch.clientY - touchOffset.offsetY,
                        }
                        : item
                )
            );
        }
    };

    return (
        <div className="w-full h-screen overflow-hidden">
            <div
                className="relative w-full h-full"
                style={{ touchAction: "none" }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={() => setSelectedItemId(null)}
                onTouchStart={() => setSelectedItemId(null)}
            >
                {items.map((item) => (
                    <div
                        key={item.id}
                        onMouseDown={(e) => handleMouseDown(item.id, e)}
                        onTouchStart={(e) => handleTouchStart(item.id, e)}
                        style={{
                            position: "absolute",
                            top: item.y,
                            left: item.x,
                            zIndex: item.zIndex,
                            cursor: "move",
                            border: selectedItemId === item.id ? "1px solid lightgray" : "none",
                        }}
                        onClick={() => {
                            if (item.content === "login") router.push("/auth/login");
                            else if (item.content === "join") router.push("/auth/sign-up");
                        }}
                    >
                        {item.type === "image" && item.src && (
                            <Image
                                src={item.src}
                                alt={`Image ${item.id}`}
                                width={window.innerWidth >= 768 ? 135 : 90}
                                height={window.innerWidth >= 768 ? 180 : 120}
                                className="object-cover rounded"
                                draggable="false"
                            />
                        )}
                        {item.type === "text" && item.content && (
                            <p className={`text-sm ${item.content === "worn" ? "font-semibold" : ""} 
                                ${["login", "join"].includes(item.content) ? "hover:underline" : ""} ${["login", "sign up"].includes(item.content) ? "text-right" : ""}`}>
                                {item.content}
                            </p>
                        )}
                        {selectedItemId === item.id && item.type === "image" && (
                            <div className="absolute top-0 right-0 flex flex-col space-y-1 p-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        bringToFront(item.id);
                                    }}
                                    className="p-1 bg-white rounded-full shadow hover:bg-gray-200"
                                >
                                    <ArrowUpIcon />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        sendToBack(item.id);
                                    }}
                                    className="p-1 bg-white rounded-full shadow hover:bg-gray-200"
                                >
                                    <ArrowDownIcon />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}