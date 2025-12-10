export interface CreateTouristInput {
  email: string;
  password: string;
  name: string;
  profilePicUrl?: string;
  bio?: string;
  languages?: string[];
  travelPreferences?: string;
}
