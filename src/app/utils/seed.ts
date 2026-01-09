import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import config from '../../config';
import { prisma } from '../shared/prisma';

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
      },
    });

    if (isExistSuperAdmin) {
      console.log('Super admin already exists!');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      '123456',
      Number(config.salt_round)
    );

    const superAdminData = await prisma.$transaction(async (tx) => {
      // Create User
      const user = await tx.user.create({
        data: {
          email: 'admin@gmail.com',
          password: hashedPassword,
          name: 'Admin',
          phone: '0123456789',
          address: 'Dhaka, BD',
          role: UserRole.ADMIN,

          gender: 'MALE',
        },
      });

      const admin = await tx.admin.create({
        data: {
          userId: user.id,
        },
      });

      return {
        email: user.email,
        name: user.name,
        role: user.role,
        profilePicUrl: user.profilePicUrl,
        id: user.id,
        adminId: admin.id,
        address: user.address,
        phone: user.phone,
        gender: user.gender,
      };
    });

    console.log('Super Admin Created Successfully!', superAdminData);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedSuperAdmin;
