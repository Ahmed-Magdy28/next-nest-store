"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  mainImage: string;
  imageGallery: string[];
  alt: string;
}

export function ProductGallery({
  mainImage,
  imageGallery,
  alt,
}: ProductGalleryProps) {
  const allImages = [mainImage, ...imageGallery].filter(Boolean);
  const [active, setActive] = useState<string>(allImages[0] ?? mainImage);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
        <Image
          src={active || mainImage}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {allImages.map((img) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(img)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                active === img
                  ? "border-blue-600"
                  : "border-transparent hover:border-gray-300 dark:hover:border-gray-700"
              }`}
            >
              <Image
                src={img}
                alt={alt}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
