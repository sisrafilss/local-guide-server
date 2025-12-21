export interface CreateBookingPayload {
  listingId: string;
  touristId: string;
  guideId: string;
  userId?: string;
  startAt: Date;
  endAt?: Date;
  totalPrice: number;
  pax?: number;
  notes?: string;
}

export interface GetAllBookingsParams {
  searchTerm?: string;
  status?: string;
  guideId?: string;
  touristId?: string;
  listingId?: string;
}

export type UpdateBookingPayload = {
  date?: Date;
  startTime?: string;
  endTime?: string;
  notes?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
};
