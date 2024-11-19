"use client"

// Next and React Imports
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

// Firebase Imports
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Other Imports
import { ArrowUpIcon, ArrowDownIcon, SizeIcon } from "@radix-ui/react-icons"

interface DraggableItem {
    id: number;
    x: number;
    y: number;
    zIndex: number;
    src: string;
    width: number;
    height: number;
}

interface UserPlaygroundProps {
    userId: string;
}

export default function UserPlayground({ userId }: UserPlaygroundProps) {
    const DEFAULT_HEIGHT = 120;
    const DEFAULT_WIDTH = 90;
    const MIN_HEIGHT = 69;
    const MIN_WIDTH = 51.75;

    const [items, setItems] = useState<DraggableItem[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const initialSize = useRef({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
    const lastTouchPosition = useRef({ x: 0, y: 0 });

    // Fetch images from Firestore
    useEffect(() => {
        const fetchClosetImages = async () => {
            try {
                const closetCollection = collection(db, `users/${userId}/closet`);
                const snapshot = await getDocs(closetCollection);

                const fetchedItems = snapshot.docs.flatMap((doc, index) => {
                    const data = doc.data();
                    if (!data.images || data.images.length === 0) return []; // Skip documents with no images

                    return data.images.map((src: string, imageIndex: number) => ({
                        id: index * 100 + imageIndex, // Unique IDs for each image
                        x: Math.random() * (window.innerWidth - DEFAULT_WIDTH),
                        y: Math.random() * (window.innerHeight - DEFAULT_HEIGHT),
                        zIndex: index * 10 + imageIndex,
                        src,
                        width: DEFAULT_WIDTH,
                        height: DEFAULT_HEIGHT,
                    }));
                });

                setItems(fetchedItems);
            } catch (error) {
                console.error("Error fetching closet images:", error);
            }
        };

        fetchClosetImages();
    }, [userId]);

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
            lastTouchPosition.current = { x: touch.clientX, y: touch.clientY };
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
                        ? {
                              ...item,
                              width: Math.max(MIN_WIDTH, item.width + movementX),
                              height: Math.max(MIN_HEIGHT, item.height + movementY),
                          }
                        : item
                )
            );
        }
    };

    const handleTouchMove = (event: React.TouchEvent) => {
        const touch = event.touches[0];
        if (isDragging && selectedItemId !== null) {
            event.preventDefault();
            const dx = touch.clientX - lastTouchPosition.current.x;
            const dy = touch.clientY - lastTouchPosition.current.y;

            lastTouchPosition.current = { x: touch.clientX, y: touch.clientY };

            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === selectedItemId
                        ? { ...item, x: item.x + dx, y: item.y + dy }
                        : item
                )
            );
        }
    };

    return (
        <div
            className="relative w-full h-screen overflow-hidden"
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
                >
                    <div
                        style={{
                            position: "relative",
                            minWidth: `${MIN_WIDTH}px`,
                            minHeight: `${MIN_HEIGHT}px`,
                        }}
                    >
                        <Image
                            src={item.src}
                            alt={`Item ${item.id}`}
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
                    {selectedItemId === item.id && (
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
    )
}