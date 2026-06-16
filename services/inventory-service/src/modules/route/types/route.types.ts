
export interface Route {
  id: string;
  source: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRouteInput {
  source: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
}

export interface UpdateRouteInput {
  source?: string;
  destination?: string;
  distanceKm?: number;
  durationMinutes?: number;
}