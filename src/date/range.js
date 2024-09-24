import {
  endOfMonth,
  endOfToday,
  endOfYesterday,
  isWithinInterval,
  startOfMonth,
  startOfToday,
  startOfYesterday,
  subMonths,
  subWeeks,
  format
} from "date-fns"
import { isValidDate } from "./isValidDate"
import { toDate } from "./toDate"

export const yesterday = () => {
  return {
    start: startOfYesterday(),
    end: endOfYesterday()
  }
}

export const today = () => {
  return {
    start: startOfToday(),
    end: endOfToday()
  }
}

export const pastWeek = () => {
  let end = new Date()
  let start = subWeeks(end, 1)

  return {
    start,
    end
  }
}

export const toGMT4 = (dateTime) => {
  return format(dateTime, "MM/dd/yyyy HH:mm:ss -04:00")
}

export const lastMonth = () => {
  let lastMonth = subMonths(new Date(), 1)
  let start = startOfMonth(lastMonth)
  let end = endOfMonth(lastMonth)

  return {
    start,
    end
  }
}

export const thisMonth = () => {
  let thisMonth = subMonths(new Date(), 0)
  let start = startOfMonth(thisMonth)
  let end = endOfMonth(thisMonth)

  return {
    start,
    end
  }
}

export const isWithinRange = (date, interval) => {
  date = toDate(date)
  let start = toDate(interval?.start)
  let end = toDate(interval?.end)

  if (isValidDate(date) && isValidDate(start) && isValidDate(end)) {
    return isWithinInterval(date, { start, end })
  }
  return false
}
