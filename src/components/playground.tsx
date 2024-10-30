"use client"

// React Imports
import { useState } from "react"

// Other Imports
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons"

interface ImageItem {
    id: number;
    x: number;
    y: number;
    zIndex: number;
    color: string;
}

export default function ImagePlayground() {

    // Generate images with random gray shades
    const initialImages = Array.from({ length: 6 }).map((_, index) => ({
        id: index + 1,
        x: 50 + index * 100,
        y: 50 + index * 50,
        zIndex: index + 1,
        color: `hsl(0, 0%, ${50 + index * 10}%)`,
    }));

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

    const handleMouseDown = (id: number) => {
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
            >
                {images.map((image) => (
                    <div
                        key={image.id}
                        onMouseDown={() => handleMouseDown(image.id)}
                        style={{
                            position: "absolute",
                            top: image.y,
                            left: image.x,
                            zIndex: image.zIndex,
                            width: "100px",
                            height: "150px",
                            backgroundColor: image.color,
                            cursor: "move",
                        }}
                        className="rounded shadow-md"
                    >
                        {selectedImageId === image.id && (
                            <div className="absolute top-0 right-0 flex space-x-1 p-1">
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