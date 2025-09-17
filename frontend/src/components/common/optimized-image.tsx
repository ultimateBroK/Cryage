"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

/**
 * Component ảnh được tối ưu với lazy loading và placeholder thông minh
 * Sử dụng Next.js Image với các optimization tự động
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  placeholder = "blur",
  blurDataURL,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Tạo blur placeholder tự động nếu không có
  const defaultBlurDataURL = 
    blurDataURL || 
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABsRAAEFAQEAAAAAAAAAAAAAAAABAhEDEiExQf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejxFAzx/lM8LiHQTfoBNAbbCBKk+lx8y2JCp4pqHp8PUU7HMkq7AoiKCYFJh2FMDsYFj9Hp6eHjDktJx3pP46aDJ8qkF5ERDdPXb58zrF6PHNR4Cxlip3f5qgG5YjWZKKqvTGLFh+J";

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-muted/20 border-2 border-dashed border-muted-foreground/20 ${className}`}>
        <div className="text-center p-4">
          <div className="w-8 h-8 mx-auto mb-2 text-muted-foreground">
            ❌
          </div>
          <p className="text-xs text-muted-foreground">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        onLoadStart={handleLoadStart}
        onLoad={handleLoadComplete}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'} ${className}`}
        // Optimize loading
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={85} // Good balance between quality and file size
      />
    </div>
  );
};

export default OptimizedImage;
