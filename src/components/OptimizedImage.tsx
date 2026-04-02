import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
    containerClassName?: string;
}

export function OptimizedImage({
    src,
    alt,
    className,
    containerClassName,
    ...props
}: OptimizedImageProps) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!src) return;

        // Reset state if src changes
        setLoaded(false);
        setError(false);

        const img = new Image();
        img.src = src;
        img.onload = () => setLoaded(true);
        img.onerror = () => setError(true);
    }, [src]);

    return (
        <div className={cn("relative overflow-hidden", containerClassName)}>
            {!loaded && !error && (
                <Skeleton className="absolute inset-0 w-full h-full bg-muted animate-pulse" />
            )}

            {src && !error ? (
                <img
                    src={src}
                    alt={alt}
                    className={cn(
                        "transition-opacity duration-500",
                        loaded ? "opacity-100" : "opacity-0",
                        className
                    )}
                    {...props}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-xs p-2 text-center">
                    {error ? "Erreur de chargement" : "Aucune image"}
                </div>
            )}
        </div>
    );
}
