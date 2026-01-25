import axios from 'axios';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../errors/ApiError';
import { prisma } from '../../shared/prisma';
import { ISSLCommerz } from './sslCommerz.interface';

const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: config.ssl.store_id,
      store_passwd: config.ssl.store_pass,
      total_amount: payload.amount,
      currency: 'BDT',
      tran_id: payload.transactionId,

      success_url: `${config.ssl.success_backend_url}?transactionId=${payload.transactionId}`,
      fail_url: `${config.ssl.fail_backend_url}?transactionId=${payload.transactionId}`,
      cancel_url: `${config.ssl.cancel_backend_url}?transactionId=${payload.transactionId}`,
      // ipn_url: config.ssl.ipn_backend_url,

      shipping_method: 'NO',

      product_name: 'Tour',
      product_category: 'Service',
      product_profile: 'general',

      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: payload.phoneNumber,
    };

    // const body = new URLSearchParams(data as any).toString();

    const response = await axios.post(config.ssl.payment_api as string, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('RESPONSE ', response);

    return response.data;
  } catch (err: any) {
    console.log(err);
    throw new ApiError(httpStatus.BAD_REQUEST, err.message);
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${config.ssl.validation_api}?val_id=${payload.val_id}&store_id=${config.ssl.store_id}&store_password=${config.ssl.store_pass}`,
    });

    console.log('sslcomeerz validate api response', response.data);

    await prisma.payment.update({
      where: {
        transactionId: payload.tran_id,
      },
      data: {
        paymentGatewayData: response.data,
      },
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(401, 'Payment validation Error: ' + error);
  }
};

export const SSLService = {
  sslPaymentInit,
  validatePayment,
};
