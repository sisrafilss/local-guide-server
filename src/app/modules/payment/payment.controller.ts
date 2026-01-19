import { Request, Response } from 'express';
import config from '../../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SSLService } from '../SSLCommerz/sslCommerz.service';
import { PaymentService } from './payment.service';

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const result = await PaymentService.initPayment(bookingId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'New payment URL generated',
    data: result,
  });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.successPayment(
    query as Record<string, string>
  );

  if (result.success) {
    res.redirect(
      `${config.ssl.success_frontend_url}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.failPayment(
    query as Record<string, string>
  );

  if (!result.success) {
    res.redirect(
      `${config.ssl.fail_frontend_url}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.cancelPayment(
    query as Record<string, string>
  );

  if (!result.success) {
    res.redirect(
      `${config.ssl.cancel_frontend_url}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  console.log('sslcommerz ipn url body', req.body);
  await SSLService.validatePayment(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Payment validated successfully',
    data: null,
  });
});

export const PaymentController = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  validatePayment,
};
