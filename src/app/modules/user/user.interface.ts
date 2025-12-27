export interface CreateTouristInput {
  email: string;
  password: string;
  name: string;
  profilePicUrl?: string;
  bio?: string;
  languages?: string[];
  preferences?: string[];
  travelPreferences?: string;
  address: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
}
export interface CreateGuideInput {
  email: string;
  password: string;
  name: string;
  profilePicUrl?: string;
  expertise?: string[];
  dailyRate: number;
  languages?: string[];
  address: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
}

export interface CreateAdminInput {
  email: string;
  password: string;
  name: string;
  profilePicUrl?: string;
  address: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
}

export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string | undefined;
  sortOrder?: string | undefined;
};
