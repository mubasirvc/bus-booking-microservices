  export interface Bus {
    id: string;
    name: string;
    busNumber: string;
    type: string;
    totalSeats: number;
    createdAt: Date;
    updatedAt: Date;
  }

export type CreateBusInput = Omit<
  Bus,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateBusInput = Partial<
  Pick<
    Bus,
    'name' | 'busNumber' | 'type' | 'totalSeats'
  >
>;