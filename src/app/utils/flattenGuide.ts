import { Prisma } from '@prisma/client';

export type GuideWithUser = Prisma.GuideGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        phone: true;
        address: true;
        gender: true;
        profilePicUrl: true;
        bio: true;
        role: true;
        status: true;
      };
    };
  };
}>;

export const flattenGuides = (guides: GuideWithUser[]) => {
  return guides.map(({ user, ...guide }) => ({
    // guide fields
    ...guide,

    // user fields
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    gender: user.gender,
    profilePicUrl: user.profilePicUrl,
    bio: user.bio,
    role: user.role,
    status: user.status,
  }));
};
