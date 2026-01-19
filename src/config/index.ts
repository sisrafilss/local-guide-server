import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  cloudinary: {
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
  },
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_secret: process.env.RESET_PASS_TOKEN,
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  salt_round: process.env.SALT_ROUND,
  reset_pass_link: process.env.RESET_PASS_LINK,
  ssl: {
    store_id: process.env.SSL_STORE_ID,
    store_pass: process.env.SSL_STORE_PASS,
    payment_api: process.env.SSL_PAYMENT_API,
    validation_api: process.env.SSL_VALIDATION_API,

    success_backend_url: process.env.SSL_SUCCESS_BACKEND_URL,
    fail_backend_url: process.env.SSL_FAIL_BACKEND_URL,
    cancel_backend_url: process.env.SSL_CANCEL_BACKEND_URL,

    success_frontend_url: process.env.SSL_SUCCESS_FRONTEND_URL,
    fail_frontend_url: process.env.SSL_FAIL_FRONTEND_URL,
    cancel_frontend_url: process.env.SSL_CANCEL_FRONTEND_URL,
  },
};
