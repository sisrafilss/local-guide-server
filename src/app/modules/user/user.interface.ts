export interface CreateTouristInput {
  email: string;
  password: string;
  name: string;
  profilePicUrl?: string;
  bio?: string;
  languages?: string[];
  preferences?: string[];
  travelPreferences?: string;
}
export interface CreateGuideInput {
  email: string;
  password: string;
  name: string;
  profilePicUrl?: string;
  expertise?: string[];
  dailyRate: number;
  languages?: string[];
}

export interface CreateGuideInput {
  email: string;
  password: string;
  name: string;
  profilePicUrl?: string;
  expertise?: string[];
  dailyRate: number;
  languages?: string[];
}

export interface CreateAdminInput {
  email: string;
  password: string;
  name: string;
  profilePicUrl?: string;
}
