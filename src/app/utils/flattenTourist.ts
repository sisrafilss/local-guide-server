import { Tourist } from '@prisma/client';

/**
 * Flattens a tourist object to make user fields easily accessible
 * Keeps all original information
 */
export const flattenTourist = (tourist: Tourist & { user: any }) => {
  return {
    ...tourist, // keep all original fields
    userId: tourist.userId, // ensure userId is explicitly at root
    name: tourist.user.name,
    email: tourist.user.email,
    phone: tourist.user.phone,
    address: tourist.user.address,
    gender: tourist.user.gender,
    profilePicUrl: tourist.user.profilePicUrl,
    bio: tourist.user.bio,
    role: tourist.user.role,
    status: tourist.user.status,

    user: undefined, // optionally remove nested user to avoid duplication
  };
};

/**
 * Flatten multiple tourists
 */
export const flattenTourists = (tourists: (Tourist & { user: any })[]) => {
  return tourists.map(flattenTourist);
};
