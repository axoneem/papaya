
import { CalendarRange, CalendarResolutionSchema } from '@/model/schema/aggregate-schemas'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(utc)


export const formatJournalEntryDate = (date: string | undefined): string => {
  const day = dayjs(date)
  const now = dayjs()

  // show year if older than 11 months ago
  const showYear = now.diff(day, 'month') > 11
  return day.format(showYear ? 'ddd MMM D, YYYY' : 'ddd MMM D')
}

export const sortDatesChronologically = (...dates: string[]) => {
  return dates.sort((a, b) => (dayjs(a).isBefore(b) ? -1 : 1))
}

export const getAbsoluteDatesFromCalendarRange = (range: CalendarRange): [dayjs.Dayjs, dayjs.Dayjs] => {
  if (range.resolution === CalendarResolutionSchema.enum.WEEK) {
    const startOfWeek = dayjs(range.fromDate).startOf('week');
    const endOfWeek = dayjs(range.fromDate).endOf('week');
    return [startOfWeek, endOfWeek];
  }

  if (range.resolution === CalendarResolutionSchema.enum.MONTH) {
    const startOfMonth = dayjs(range.fromDate).startOf('month');
    const endOfMonth = dayjs(range.fromDate).endOf('month');
    return [startOfMonth, endOfMonth];
  }

  if (range.resolution === CalendarResolutionSchema.enum.YEAR) {
    const startOfYear = dayjs(range.fromDate).startOf('year');
    const endOfYear = dayjs(range.fromDate).endOf('year');
    return [startOfYear, endOfYear];
  }

  const now = dayjs();
  const fromDate = range.fromDate ? dayjs(range.fromDate) : now;
  const toDate = range.toDate ? dayjs(range.toDate) : now;

  return fromDate.isBefore(toDate) ? [fromDate, toDate] : [toDate, fromDate];
}

export const getToday = () => {
  return dayjs().format('YYYY-MM-DD');
}

export const timestamp = <T extends object>(resource: T): T => {
  const now = dayjs().toISOString();
  if ('createdAt' in resource && 'updatedAt' in resource) {
    if (!resource.createdAt && !resource.updatedAt) {
      resource.createdAt = now;
      return resource;
    } else {
      resource.updatedAt = now;
    }
  }

  return resource;
}
