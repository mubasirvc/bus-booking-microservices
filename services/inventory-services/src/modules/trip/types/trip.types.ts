export interface Trip {
  id: string;
  busId: string;
  routeId: string;
  travelDate: string;
  availableSeats: number;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTripInput = Omit<
  Trip,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export type UpdateTripInput = Partial<
  Pick<
    Trip,
    | 'busId'
    | 'routeId'
    | 'travelDate'
    | 'departureTime'
    | 'arrivalTime'
    | 'fare'
    | 'status'
    | 'availableSeats'
  >
>;