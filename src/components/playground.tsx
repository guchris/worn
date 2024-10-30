"use client"

// Next and React Imports
import { useState } from "react"
import Image from "next/image"

// Other Imports
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons"

interface ImageItem {
    id: number;
    x: number;
    y: number;
    zIndex: number;
    src: string;
}

export default function ImagePlayground() {

    // Generate images with random gray shades
    const initialImages = [
        { id: 1, x: 50, y: 50, zIndex: 1, src: "/playground/item1.png" },
        { id: 2, x: 50, y: 150, zIndex: 2, src: "/playground/item2.png" },
        { id: 3, x: 50, y: 250, zIndex: 3, src: "/playground/item3.png" },
        { id: 4, x: 50, y: 350, zIndex: 4, src: "/playground/item4.png" },
        { id: 5, x: 50, y: 450, zIndex: 5, src: "/playground/item5.png" },
    ];

    const [images, setImages] = useState<ImageItem[]>(initialImages);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const bringToFront = (id: number) => {
        setImages((prevImages) => {
            const targetImage = prevImages.find((img) => img.id === id);
            if (!targetImage) return prevImages;

            const nextZIndex = targetImage.zIndex + 1;
            const updatedImages = prevImages.map((img) =>
                img.id === id
                    ? { ...img, zIndex: nextZIndex }
                    : img.zIndex === nextZIndex
                    ? { ...img, zIndex: img.zIndex - 1 }
                    : img
            );

            return updatedImages;
        });
    };

    const sendToBack = (id: number) => {
        setImages((prevImages) => {
            const targetImage = prevImages.find((img) => img.id === id);
            if (!targetImage) return prevImages;

            const prevZIndex = targetImage.zIndex - 1;
            const updatedImages = prevImages.map((img) =>
                img.id === id
                    ? { ...img, zIndex: prevZIndex }
                    : img.zIndex === prevZIndex
                    ? { ...img, zIndex: img.zIndex + 1 }
                    : img
            );

            return updatedImages;
        });
    };

    const handleMouseDown = (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedImageId(id);
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (isDragging && selectedImageId !== null) {
            const { movementX, movementY } = event;
            setImages(prevImages =>
                prevImages.map(img =>
                    img.id === selectedImageId
                        ? { ...img, x: img.x + movementX, y: img.y + movementY }
                        : img
                )
            );
        }
    };

    return (
        <div className="p-4">
            <div
                className="relative w-full h-[800px] border rounded-lg overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseDown={() => setSelectedImageId(null)}
            >
                {images.map((image) => (
                    <div
                        key={image.id}
                        onMouseDown={(e) => handleMouseDown(image.id, e)}
                        style={{
                            position: "absolute",
                            top: image.y,
                            left: image.x,
                            zIndex: image.zIndex,
                            width: "90px",
                            height: "120px",
                            cursor: "move",
                            border: selectedImageId === image.id ? "1px solid lightgray" : "none",
                        }}
                        className="rounded"
                    >
                        <Image
                            src={image.src}
                            alt={`Image ${image.id}`}
                            width={90}
                            height={120}
                            className="object-cover rounded"
                            draggable="false"
                        />
                        {selectedImageId === image.id && (
                            <div className="absolute top-0 right-0 flex flex-col space-y-1 p-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        bringToFront(image.id);
                                    }}
                                    className="p-1 bg-white rounded-full shadow hover:bg-gray-200"
                                >
                                    <ArrowUpIcon />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        sendToBack(image.id);
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