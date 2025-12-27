export type GetAllTouristsParams = {
  searchTerm?: string;
  status?: string;
};

export type UpdateTouristPayload = {
  preferences?: string;
  name?: string;
  profilePicUrl?: string;
  bio?: string;
};
