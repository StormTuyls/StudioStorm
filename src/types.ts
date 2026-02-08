// Photo metadata types
export interface Photo {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  dateTaken: string;
  location: string;
  camera: CameraSettings;
  lens?: string;
  iso?: number;
  aperture?: string;
  shutterSpeed?: string;
  focalLength?: string;
  albumId: number;
  width: number;
  height: number;
  isFeatured: boolean; // Foto's die je als beste werk markeert
  likes: number; // Aantal likes van bezoekers
}

export interface CameraSettings {
  model: string;
  make?: string;
  iso: number;
  aperture: string;
  shutterSpeed: string;
  focalLength: string;
}

export interface Album {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverPhotoId: number;
  photoCount: number;
  parentId?: number; // Voor subalbums
}

export interface Organization {
  id: number;
  name: string;
  logo?: string;
  website?: string;
  description: string;
}
