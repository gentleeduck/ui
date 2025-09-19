"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"
import { enUS, es } from "react-day-picker/locale"

import { Calendar } from "@/registry/default/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select"

const localizedStrings = {
  en: {
    description: "Select the dates for your appointment",
    title: "Book an appointment",
  },
  es: {
    description: "Selecciona las fechas para tu cita",
    title: "Reserva una cita",
  },
} as const

export default function Calendar12() {
  const [locale, setLocale] =
    React.useState<keyof typeof localizedStrings>("es")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 8, 9),
    to: new Date(2025, 8, 17),
  })

  return (
    <Card>
      <CardHeader className="relative border-b">
        <CardTitle>{localizedStrings[locale].title}</CardTitle>
        <CardDescription>
          {localizedStrings[locale].description}
        </CardDescription>
        <Select
          onValueChange={(value) =>
            setLocale(value as keyof typeof localizedStrings)
          }
          value={locale}
        >
          <SelectTrigger className="absolute right-4 top-4 w-[100px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4">
        <Calendar
          buttonVariant="outline"
          className="bg-transparent p-0"
          defaultMonth={dateRange?.from}
          locale={locale === "es" ? es : enUS}
          mode="range"
          numberOfMonths={2}
          onSelect={setDateRange}
          selected={dateRange}
        />
      </CardContent>
    </Card>
  )
}
