import DodoPayments from "dodopayments";

export const dodopayments = new DodoPayments({
  environment: "test_mode",
  bearerToken: process.env.DODOPAYMENTS_API_KEY!,
});