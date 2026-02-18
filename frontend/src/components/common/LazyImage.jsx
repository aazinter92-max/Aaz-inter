import { useState, useEffect } from 'react';
import './LazyImage.css';

const LazyImage = ({ src, alt, className = '', placeholder, ...props }) => {
  const [imageSrc, setImageSrc] = useState(placeholder || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      // Keep placeholder or set error image
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className={`lazy-image-container ${className}`}>
      {isLoading && <div className="lazy-image-skeleton"></div>}
      <img
        src={imageSrc}
        alt={alt}
        className={`lazy-image ${isLoading ? 'loading' : 'loaded'}`}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default LazyImage;
