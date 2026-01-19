import { BookingStatus, PaymentStatus } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { prisma } from '../../shared/prisma';
import { ISSLCommerz } from '../SSLCommerz/sslCommerz.interface';
import { SSLService } from '../SSLCommerz/sslCommerz.service';

const initPayment = async (bookingId: string) => {
  const payment = await prisma.payment.findFirstOrThrow({
    where: {
      bookingId: bookingId,
    },
  });

  if (!payment) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Payment Not Found. You have not booked this tour'
    );
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    select: {
      totalPrice: true,
      payment: {
        select: {
          transactionId: true,
        },
      },
      tourist: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
      },
    },
  });

  const sslPayload: ISSLCommerz = {
    name: booking?.tourist.user.name as string,
    email: booking?.tourist.user.email as string,
    phoneNumber: booking?.tourist.user.phone as string,
    address: booking?.tourist.user.address as string,
    amount: Number(booking?.totalPrice),
    transactionId: booking?.payment?.transactionId as string,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return { paymentUrl: sslPayment.GatewayPageURL };
};

const successPayment = async (query: Record<string, string>) => {
  const updatedData = await prisma.$transaction(async (tnx) => {
    const updatedPayment = await tnx.payment.update({
      where: {
        transactionId: query.transactionId,
      },
      data: {
        status: PaymentStatus.PAID,
      },
    });

    if (!updatedPayment) {
      throw new ApiError(401, 'Payment not found!');
    }

    const updatedBooking = await tnx.booking.update({
      where: {
        id: updatedPayment.bookingId,
      },
      data: {
        status: BookingStatus.CONFIRMED,
      },
    });

    // const updatedBooking = await tnx.booking.update({
    //     where: {

    //     }
    // })
    return updatedPayment;
  });

  return {
    success: true,
    message: 'Payment Completed Successfully!',
  };
};

const failPayment = async (query: Record<string, string>) => {
  prisma.$transaction(async (tnx) => {
    const updatedPayment = await tnx.payment.update({
      where: {
        transactionId: query.transactionId,
      },
      data: {
        status: PaymentStatus.FAILED,
      },
    });

    if (!updatedPayment) {
      throw new ApiError(401, 'Payment not found!');
    }

    await tnx.booking.update({
      where: {
        id: updatedPayment.bookingId,
      },
      data: {
        status: BookingStatus.PENDING,
      },
    });
    return updatedPayment;
  });

  return {
    success: false,
    message: 'Payment Failed',
  };
};

const cancelPayment = async (query: Record<string, string>) => {
  prisma.$transaction(async (tnx) => {
    const updatedPayment = await tnx.payment.update({
      where: {
        transactionId: query.transactionId,
      },
      data: {
        status: PaymentStatus.CALCELLED,
      },
    });

    if (!updatedPayment) {
      throw new ApiError(401, 'Payment not found!');
    }

    await tnx.booking.update({
      where: {
        id: updatedPayment.bookingId,
      },
      data: {
        status: BookingStatus.PENDING,
      },
    });
    return updatedPayment;
  });

  return {
    success: false,
    message: 'Payment Cancelled',
  };
};

export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
