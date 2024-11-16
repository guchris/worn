"use client"

// Next and React Imports
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

// Other Imports
import { useAuth } from "@/context/AuthContext"
import { ArrowUpIcon, ArrowDownIcon, SizeIcon } from "@radix-ui/react-icons"

interface DraggableItem {
    id: number;
    x: number;
    y: number;
    zIndex: number;
    type: "image" | "text";
    src?: string;
    content?: string;
    width: number;
    height: number;
}

export default function DemoPlayground() {
    const { user } = useAuth();
    const router = useRouter();

    // Redirect logged-in users to the home page
    useEffect(() => {
        if (user) {
            router.push("/home");
        }
    }, [user, router]);

    const DEFAULT_HEIGHT = 120;
    const DEFAULT_WIDTH = 90;
    const MIN_HEIGHT = 69;
    const MIN_WIDTH = 51.75;

    const [items, setItems] = useState<DraggableItem[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [touchOffset, setTouchOffset] = useState({ offsetX: 0, offsetY: 0 });

    // Reference to track resizing in mobile
    const initialSize = useRef({ width: 90, height: 120 });
    const lastTouchPosition = useRef({ x: 0, y: 0 });

    // Function to generate random positions ensuring items do not touch each other
    function generateRandomPosition(existingItems: DraggableItem[], itemWidth: number, itemHeight: number): { x: number; y: number } {
        const maxX = window.innerWidth - itemWidth;
        const maxY = window.innerHeight - itemHeight;
    
        let x: number, y: number, isTooClose: boolean;
    
        do {
            x = Math.floor(Math.random() * maxX);
            y = Math.floor(Math.random() * maxY);
    
            // Check if the new position is too close to existing items (both text and image)
            isTooClose = existingItems.some((item) => {
                const itemRight = item.x + (item.width || 0);
                const itemBottom = item.y + (item.height || 0);
                const newItemRight = x + itemWidth;
                const newItemBottom = y + itemHeight;
    
                // Check for overlap between the new item and the existing item
                const noHorizontalOverlap = newItemRight <= item.x || x >= itemRight;
                const noVerticalOverlap = newItemBottom <= item.y || y >= itemBottom;
    
                return !(noHorizontalOverlap || noVerticalOverlap);
            });
        } while (isTooClose);
    
        return { x, y };
    }

    // Set initial items after component mounts
    useEffect(() => {
        const initialItems: DraggableItem[] = [
            // Left-aligned text items positioned conditionally for mobile and desktop
            { id: 16, x: 30, y: window.innerWidth >= 768 ? 20 : window.innerHeight - 80, zIndex: 11, type: "text", content: "worn", width: 35, height: 20 },
            { id: 17, x: 30, y: window.innerWidth >= 768 ? 40 : window.innerHeight - 60, zIndex: 12, type: "text", content: "fashion for you", width: 100, height: 20 },
            
            // Right-aligned text items positioned conditionally for mobile and desktop
            { id: 18, x: window.innerWidth >= 768 ? window.innerWidth - 70 : window.innerWidth - 80, y: window.innerWidth >= 768 ? 20 : window.innerHeight - 80, zIndex: 13, type: "text", content: "login", width: 32, height: 20 },
            { id: 19, x: window.innerWidth >= 768 ? window.innerWidth - 62 : window.innerWidth - 72, y: window.innerWidth >= 768 ? 40 : window.innerHeight - 60, zIndex: 14, type: "text", content: "join", width: 24, height: 20 },
        ];

        // Shuffle and pick 10 random images from the 15 available
        const randomImageIds = Array.from({ length: 15 }, (_, i) => i + 1)
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);

        randomImageIds.forEach((id, index) => {
            const { x, y } = generateRandomPosition(initialItems, DEFAULT_WIDTH, DEFAULT_HEIGHT);
            initialItems.push({
                id,
                x,
                y,
                zIndex: index,
                type: "image",
                src: `/playground/item${id}.png`,
                width: DEFAULT_WIDTH,
                height: DEFAULT_HEIGHT,
            });
        });

        setItems(initialItems);
    }, []);

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

    const handleResizeMouseDown = (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedItemId(id);
        setIsResizing(true);

        const item = items.find((item) => item.id === id);
        if (item) {
            initialSize.current = { width: item.width, height: item.height };
        }
    };

    const handleResizeTouchStart = (id: number, event: React.TouchEvent) => {
        event.stopPropagation();
        setSelectedItemId(id);
        setIsResizing(true);
        
        const touch = event.touches[0];
        lastTouchPosition.current = { x: touch.clientX, y: touch.clientY };
    
        const item = items.find((item) => item.id === id);
        if (item && item.width && item.height) {
            initialSize.current = { width: item.width, height: item.height };
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

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
    
        if (isResizing && selectedItemId !== null) {
            const { movementX, movementY } = event;
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === selectedItemId && item.width && item.height
                        ? { ...item, width: item.width + movementX, height: item.height + movementY }
                        : item
                )
            );
        }
    };

    const handleTouchMove = (event: React.TouchEvent) => {
        const touch = event.touches[0];

        if (isDragging && selectedItemId !== null) {
            event.preventDefault();
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

        if (isResizing && selectedItemId !== null) {
            event.preventDefault();
            const dx = touch.clientX - lastTouchPosition.current.x;
            const dy = touch.clientY - lastTouchPosition.current.y;

            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === selectedItemId
                        ? {
                            ...item,
                            width: initialSize.current.width + dx,
                            height: initialSize.current.height + dy,
                        }
                        : item
                )
            );
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <div
                className="w-full h-full"
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
                            <div
                                style={{
                                    position: "relative",
                                    minWidth: `${MIN_WIDTH}px`,
                                    minHeight: `${MIN_HEIGHT}px`
                                }}
                            >
                                <Image
                                    src={item.src}
                                    alt={`Image ${item.id}`}
                                    width={item.width}
                                    height={item.height}
                                    className="object-cover rounded"
                                    draggable="false"
                                />
                                {selectedItemId === item.id && (
                                    <div
                                        className="absolute p-1 cursor-nwse-resize"
                                        style={{
                                            bottom: "0px",
                                            right: "0px",
                                            transform: "rotate(90deg)",
                                        }}
                                        onMouseDown={(e) => handleResizeMouseDown(item.id, e)}
                                        onTouchStart={(e) => handleResizeTouchStart(item.id, e)}
                                    >
                                        <SizeIcon />
                                    </div>
                                )}
                            </div>
                        )}
                        {item.type === "text" && item.content && (
                            <p 
                                className={`text-sm ${item.content === "worn" ? "font-semibold" : ""} 
                                    ${["login", "join"].includes(item.content) ? "underline hover:font-bold cursor-pointer text-right" : ""}`}
                                style={{ userSelect: "none" }}
                            >
                                {item.content}
                            </p>
                        )}
                        {selectedItemId === item.id && item.type === "image" && (
                            <div className="absolute top-0 right-0 flex flex-col">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        bringToFront(item.id);
                                    }}
                                    className="p-1 hover:bg-gray-200"
                                >
                                    <ArrowUpIcon />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        sendToBack(item.id);
                                    }}
                                    className="p-1 hover:bg-gray-200"
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