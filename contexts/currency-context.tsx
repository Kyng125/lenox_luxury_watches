"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
]

// Exchange rates (in production, these would come from a real-time API)
const EXCHANGE_RATES: Record<string, number> = {
  NGN: 1, // Base currency
  USD: 0.0012, // 1 NGN = 0.0012 USD (approximately 830 NGN = 1 USD)
  EUR: 0.0011, // 1 NGN = 0.0011 EUR
  GBP: 0.00095, // 1 NGN = 0.00095 GBP
  CAD: 0.0016, // 1 NGN = 0.0016 CAD
  AUD: 0.0018, // 1 NGN = 0.0018 AUD
}

interface CurrencyContextType {
  selectedCurrency: Currency
  currencies: Currency[]
  setCurrency: (currency: Currency) => void
  convertPrice: (priceInUSD: number) => number
  formatPrice: (price: number, currencyCode?: string) => string
  getExchangeRate: (fromCurrency: string, toCurrency: string) => number
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0]) // Default to NGN
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const savedCurrency = localStorage.getItem("preferred-currency")
      if (savedCurrency) {
        const currency = SUPPORTED_CURRENCIES.find((c) => c.code === savedCurrency)
        if (currency) {
          setSelectedCurrency(currency)
        }
      }
    }
  }, [])

  const setCurrency = (currency: Currency) => {
    setSelectedCurrency(currency)
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-currency", currency.code)
    }
  }

  const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return 1

    const fromRate = EXCHANGE_RATES[fromCurrency] || 1
    const toRate = EXCHANGE_RATES[toCurrency] || 1

    if (fromCurrency === "USD") {
      return (1 / EXCHANGE_RATES.USD) * toRate
    }

    if (toCurrency === "USD") {
      return fromRate
    }

    return (fromRate / EXCHANGE_RATES.USD) * (1 / EXCHANGE_RATES.USD) * toRate
  }

  const convertPrice = (priceInUSD: number): number => {
    if (selectedCurrency.code === "USD") return priceInUSD

    const priceInNGN = priceInUSD / EXCHANGE_RATES.USD

    const rate = EXCHANGE_RATES[selectedCurrency.code] || 1
    return priceInNGN * rate
  }

  const formatPrice = (price: number, currencyCode?: string): string => {
    const currency = currencyCode
      ? SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || selectedCurrency
      : selectedCurrency

    if (currency.code === "NGN") {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: currency.code === "USD" ? 0 : 2,
      maximumFractionDigits: currency.code === "USD" ? 0 : 2,
    }).format(price)
  }

  if (!mounted) {
    return (
      <CurrencyContext.Provider
        value={{
          selectedCurrency: SUPPORTED_CURRENCIES[0], // Always use NGN during SSR
          currencies: SUPPORTED_CURRENCIES,
          setCurrency,
          convertPrice,
          formatPrice,
          getExchangeRate,
        }}
      >
        {children}
      </CurrencyContext.Provider>
    )
  }

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        currencies: SUPPORTED_CURRENCIES,
        setCurrency,
        convertPrice,
        formatPrice,
        getExchangeRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
