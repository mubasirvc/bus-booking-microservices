export interface Trip {
  id: string;
  busId: string;
  routeId: string;
  travelDate: Date;
  departureTime: Date;
  arrivalTime: Date;
  fare: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}