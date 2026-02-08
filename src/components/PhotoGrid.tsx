import type { Photo } from '../types';
import PhotoCard from './PhotoCard';

interface PhotoGridProps {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {photos.map((photo) => (
        <div key={photo.id} className="break-inside-avoid">
          <PhotoCard photo={photo} />
        </div>
      ))}
    </div>
  );
}
