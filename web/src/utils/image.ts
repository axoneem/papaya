import { Vibrant } from "node-vibrant/browser";

import { Avatar } from "@/types/schema";

export async function createImageAvatar(file: File): Promise<Avatar> {
    const image = await loadImage(file);
    
    // Resize image to 64x64
    const resizedBase64 = resizeImage(image, 64, 64);
    
    // Resize image for color extraction
    const colorPaletteBase64 = resizeImage(image, 512, 512);
    
    // Extract color palette
    const palette = await Vibrant.from(colorPaletteBase64).getPalette();
    const paletteColor = palette.Vibrant?.hex ?? ''

    return {
        content: resizedBase64, // `data:image/png;base64,${resizedBase64}`,
        variant: 'IMAGE',
        primaryColor: paletteColor,
    };
}

async function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = reader.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Resize and get Base64 data URL
function resizeImage(image: HTMLImageElement, width: number, height: number): string {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas context is not available");

    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/png")
}
