export interface Location {
  id: number;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  description?: string;
}

