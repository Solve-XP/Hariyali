// src/components/ImageCarousel.jsx

import { useState } from "react";

import "./ImageCarousel.css";

export default function ImageCarousel({

  images = [],

  height = 220,

  showThumbnails = false,

  onImageClick,
}) {

  const [activeIndex, setActiveIndex] =
    useState(0);

  const safeImages =
    images?.length
      ? images
      : [
          "https://placehold.co/600x400?text=No+Image",
        ];

  const currentImage =
    safeImages[activeIndex];

  const goPrev = (e) => {

    e.stopPropagation();

    setActiveIndex((prev) =>
      prev === 0
        ? safeImages.length - 1
        : prev - 1
    );
  };

  const goNext = (e) => {

    e.stopPropagation();

    setActiveIndex((prev) =>
      prev === safeImages.length - 1
        ? 0
        : prev + 1
    );
  };

  const handleThumbnailClick = (
    e,
    index
  ) => {

    e.stopPropagation();

    setActiveIndex(index);
  };

  return (

    <div
      className="image-carousel"
      style={{
        height: `${height}px`,
      }}
    >

      <img
        src={currentImage}
        alt="carousel"
        className="image-carousel__image"
        onClick={() =>
          onImageClick?.(currentImage)
        }
      />

      {safeImages.length > 1 && (

        <>

          <button
            className="
              image-carousel__arrow
              image-carousel__arrow--left
            "
            onClick={goPrev}
          >
            ‹
          </button>

          <button
            className="
              image-carousel__arrow
              image-carousel__arrow--right
            "
            onClick={goNext}
          >
            ›
          </button>

          <div className="image-carousel__counter">

            {activeIndex + 1}
            /
            {safeImages.length}

          </div>

        </>
      )}

      {showThumbnails &&
        safeImages.length > 1 && (

        <div className="image-carousel__thumbnails">

          {safeImages.map(
            (image, index) => (

            <img
              key={index}
              src={image}
              alt={`thumb-${index}`}
              className={`
                image-carousel__thumbnail
                ${
                  activeIndex === index
                    ? "image-carousel__thumbnail--active"
                    : ""
                }
              `}
              onClick={(e) =>
                handleThumbnailClick(
                  e,
                  index
                )
              }
            />

          ))}

        </div>
      )}

    </div>
  );
}