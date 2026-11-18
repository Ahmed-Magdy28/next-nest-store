"use client";

import { useState } from "react";
import Image from "next/image";

/** Props for {@link CategoryImage}. */
export interface CategoryImageProps {
  src?: string | null;
  alt: string;
  fallbackLabel: string;
  sizes: string;
  className?: string;
  fallbackClassName?: string;
}

/**
 * Renders a responsive `next/image` for a category or subcategory,
 * falling back to a styled initial badge if `src` is missing or fails to load.
 */
export function CategoryImage({
  src,
  alt,
  fallbackLabel,
  sizes,
  className = "object-cover",
  fallbackClassName = "flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 font-black text-white/90",
}: CategoryImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={fallbackClassName}>
        <span>{fallbackLabel.charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
