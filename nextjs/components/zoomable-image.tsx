"use client";

import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ComponentProps, useState, useEffect } from "react";

interface ZoomableImageProps extends ComponentProps<typeof Image> {
  containerClassName?: string;
  transformWrapperProps?: ComponentProps<typeof TransformWrapper>;
}

export function ZoomableImage({ 
  containerClassName = "", 
  transformWrapperProps = {},
  ...imageProps 
}: ZoomableImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Thumbnail - clickable to open modal */}
      <div className={`bg-gray-800/30 border border-gray-700 rounded-lg p-3 flex justify-center cursor-pointer hover:bg-gray-700/30 transition-colors ${containerClassName}`}>
        <Image
          {...imageProps}
          onClick={openModal}
          className={`w-full h-auto rounded-lg max-h-[400px] object-contain bg-black cursor-pointer hover:opacity-90 transition-opacity ${imageProps.className || ""}`}
        />
      </div>

      {/* Full-screen modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Zoomable image container */}
          <div 
            className="w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
          >
            <TransformWrapper
              initialScale={1}
            >
              <TransformComponent
                wrapperClass="!w-screen !h-screen !flex !justify-center !items-center"
                contentClass="!flex !justify-center !items-center !w-full !h-full"
              >
                <Image
                  {...imageProps}
                  className="cursor-grab active:cursor-grabbing"
                  style={{ 
                    width: 'auto', 
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </TransformComponent>
            </TransformWrapper>
          </div>

          {/* Instructions overlay */}
          <div className="absolute w-full text-center bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm bg-black/50 px-4 py-2 rounded">
            Scroll to zoom • Drag to pan • Double-click to reset • ESC or click outside to close
          </div>
        </div>
      )}
    </>
  );
}