export interface GetAllToursParams {
  searchTerm?: string;
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  active?: boolean;
  page?: number;
  limit?: number;
}
