// import { Request, Response } from 'express';

// import catchAsync from '../../shared/catchAsync';
// import sendResponse from '../../shared/sendResponse';
// import { UserService } from './user.service';

// const createUser = catchAsync(async (req: Request, res: Response) => {
//   const result = await UserService.createPatient(req);

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: 'User created successfully!',
//     data: result,
//   });
// });

// export const UserController = {
//   createUser,
// };

import { Request, Response } from 'express';
import { UserService } from './user.service';

const createTourist = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await UserService.createTourist(data);

    return res.status(201).json({
      success: true,
      message: 'Tourist created successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const UserController = {
  createTourist,
};
