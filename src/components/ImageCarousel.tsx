import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

interface CarouselProps {
  imageIds: Id<"_storage">[];
}

const Carousel: React.FC<CarouselProps> = ({ imageIds }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageIds.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imageIds.length) % imageIds.length);
  };

  const currentImageId = imageIds[currentIndex];
  const imageUrl = useQuery(api.files.getImageUrl, { imageId: currentImageId });

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      )}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 dark:bg-white/50 text-white dark:text-black p-2 rounded-full hover:bg-black/75 dark:hover:bg-white/75 transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 dark:bg-white/50 text-white dark:text-black p-2 rounded-full hover:bg-black/75 dark:hover:bg-white/75 transition-colors"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {imageIds.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex
                ? 'bg-white dark:bg-black'
                : 'bg-white/50 dark:bg-black/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;