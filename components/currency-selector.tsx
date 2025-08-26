"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Globe } from "lucide-react"
import { useCurrency, type Currency } from "@/contexts/currency-context"

interface CurrencySelectorProps {
  variant?: "header" | "compact" | "full"
  className?: string
}

export function CurrencySelector({ variant = "header", className = "" }: CurrencySelectorProps) {
  const { selectedCurrency, currencies, setCurrency } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)

  const handleCurrencyChange = (currency: Currency) => {
    setCurrency(currency)
    setIsOpen(false)
  }

  if (variant === "compact") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={`text-gray-300 hover:text-white ${className}`}>
            <span className="mr-1">{selectedCurrency.flag}</span>
            <span className="font-medium">{selectedCurrency.code}</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
          {currencies.map((currency) => (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => handleCurrencyChange(currency)}
              className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
            >
              <span className="mr-2">{currency.flag}</span>
              <span className="font-medium mr-2">{currency.code}</span>
              <span className="text-sm text-gray-400">{currency.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === "full") {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="text-sm font-medium text-gray-300">Currency</label>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <div className="flex items-center">
                <span className="mr-2">{selectedCurrency.flag}</span>
                <span className="font-medium mr-2">{selectedCurrency.code}</span>
                <span className="text-sm text-gray-400">- {selectedCurrency.name}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full bg-gray-900 border-gray-700">
            {currencies.map((currency) => (
              <DropdownMenuItem
                key={currency.code}
                onClick={() => handleCurrencyChange(currency)}
                className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <span className="mr-2">{currency.flag}</span>
                    <span className="font-medium mr-2">{currency.code}</span>
                    <span className="text-sm text-gray-400">{currency.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{currency.symbol}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Default header variant
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`text-gray-300 hover:text-white ${className}`}>
          <Globe className="h-4 w-4 mr-2" />
          <span className="mr-1">{selectedCurrency.flag}</span>
          <span className="font-medium">{selectedCurrency.code}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleCurrencyChange(currency)}
            className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
          >
            <span className="mr-2">{currency.flag}</span>
            <span className="font-medium mr-2">{currency.code}</span>
            <span className="text-sm text-gray-400">{currency.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
