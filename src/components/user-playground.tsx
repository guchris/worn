"use client"

// Next and React Imports
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

// Firebase Imports
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

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
        
                snapshot.docs.forEach((doc) => {
                    console.log("Document Data:", doc.data());
                });
        
                const fetchedItems = snapshot.docs.flatMap((doc, index) => {
                    const data = doc.data();
                    console.log("Images Field:", data.images);
                    return data.images?.map((src: string, imageIndex: number) => ({
                        id: index * 100 + imageIndex,
                        x: Math.random() * (window.innerWidth - DEFAULT_WIDTH),
                        y: Math.random() * (window.innerHeight - DEFAULT_HEIGHT),
                        zIndex: index * 10 + imageIndex,
                        src,
                        width: DEFAULT_WIDTH,
                        height: DEFAULT_HEIGHT,
                    }));
                });
        
                console.log("Fetched Items:", fetchedItems);
                setItems(fetchedItems);
            } catch (error) {
                console.error("Error fetching closet images:", error);
            }
        };

        fetchClosetImages();
    }, [userId]);

    // Dragging logic
    const handleMouseDown = (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedItemId(id);
        setIsDragging(true);
    };

    const handleTouchStart = (id: number, event: React.TouchEvent) => {
        event.stopPropagation();
        setSelectedItemId(id);
        setIsDragging(true);

        const touch = event.touches[0];
        const item = items.find((item) => item.id === id);
        if (item) {
            lastTouchPosition.current = { x: touch.clientX, y: touch.clientY };
        }
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
                    item.id === selectedItemId
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

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setIsResizing(false);
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
                    </div>
                </div>
            ))}
        </div>
    )
}