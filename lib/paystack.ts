import { Paystack } from "paystack"

if (!process.env.PAYSTACK_SECRET_KEY) {
  throw new Error("PAYSTACK_SECRET_KEY is not set")
}

export const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY)

export const formatAmountForPaystack = (amount: number): number => {
  return Math.round(amount * 100) // Convert to kobo (smallest unit)
}

export const formatAmountFromPaystack = (amount: number): number => {
  return amount / 100 // Convert from kobo
}

export const SUPPORTED_CURRENCIES = {
  NGN: "NGN",
  USD: "USD",
  GHS: "GHS",
  ZAR: "ZAR",
  KES: "KES",
}
