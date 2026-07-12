import KeyboardShortcut from '@/components/shared/display/KeyboardShortcut'
import { KeyboardActionName } from '@/constants/keyboard-constants'
import { JournalSliceContext } from '@/model/contexts/JournalSliceContext'
import { CalendarResolution, CalendarResolutionSchema } from '@/model/schema/aggregate-schemas'
import { getAbsoluteDatesFromCalendarRange } from '@/utils/date-utils'
import { ArrowBack, ArrowDropDown, ArrowForward, CalendarToday } from '@mui/icons-material'
import {
  Button,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useContext, useMemo, useRef, useState } from 'react'

const SELECTABLE_DATE_VIEWS = [
  CalendarResolutionSchema.enum.WEEK,
  CalendarResolutionSchema.enum.MONTH,
  CalendarResolutionSchema.enum.YEAR,
]

const dateViewMenuOptionLabels: Partial<Record<CalendarResolution, string>> = {
  [CalendarResolutionSchema.enum.WEEK]: 'Week',
  [CalendarResolutionSchema.enum.MONTH]: 'Month',
  [CalendarResolutionSchema.enum.YEAR]: 'Year',
  [CalendarResolutionSchema.enum.CUSTOM]: 'Date Range',
}

const DATE_RANGE_SEPERATOR = '\u00A0\u2013\u00A0'

export default function LedgerDateNavigation() {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [showDateViewPicker, setShowDateViewPicker] = useState<boolean>(false)

  const { slice, setCalendar } = useContext(JournalSliceContext)
  const { calendar } = slice;
  const { resolution, fromDate, toDate } = calendar;

  const datePickerButtonRef = useRef<HTMLButtonElement | null>(null)
  const dateViewPickerButtonRef = useRef<HTMLButtonElement | null>(null)
  const hideTodayButton = !resolution || resolution === CalendarResolutionSchema.enum.CUSTOM

  // const getJournalEntriesQuery = useFilteredJournalEntries()

  const theme = useTheme()

  const hideDateViewPicker = useMediaQuery(theme.breakpoints.down('md'))
  const hideNextPrevButtons = hideTodayButton || hideDateViewPicker
  const headingSize = useMediaQuery(theme.breakpoints.down('sm')) ? 'h6' : 'h5'

  const now = useMemo(() => dayjs(), [])

  const [prevButtonTooltip, nextButtonTooltip] = useMemo(() => {
    if (resolution === CalendarResolutionSchema.enum.MONTH) {
      return ['Previous month', 'Next month']
    } else if (resolution === CalendarResolutionSchema.enum.YEAR) {
      return ['Previous year', 'Next year']
    } else if (resolution === CalendarResolutionSchema.enum.WEEK) {
      return ['Previous week', 'Next week']
    } else {
      return [undefined, undefined]
    }
  }, [resolution])

  /**
   * Supported formats include:
   *
   * @example "2024" // Year view
   * @example "September" // Monthly view, in current year
   * @example "Dec 2024" // Monthly view, in past/future year
   * @example "Jan 1 - 7" // Weekly view in current year
   * @example "Sep 1 - 7, 2022" // Weekly view in past year
   * @example "Dec 31, 2023 - Jan 6, 2024" // Weekly view spanning multiple past/future years
   * @example "Jan 30 - Sep 2" // Date range in current year
   * @example "Jan 5 - Feb 3, 2021" // Date range in past/future year
   * @example "Nov 2020 - Feb 2021" // Date range spanning multiple years
   */
  const formattedDateString = useMemo(() => {
    if (resolution === CalendarResolutionSchema.enum.YEAR) {
      return String(dayjs(fromDate).year())
    }

    const [startDate, endDate] = getAbsoluteDatesFromCalendarRange({ resolution, fromDate, toDate })
    const spansCurrentYear = startDate.isSame(now, 'year') && endDate.isSame(now, 'year')
    const spansSingleYear = startDate.isSame(endDate, 'year')
    const spansSingleMonth = startDate.isSame(endDate, 'month')

    if (resolution === CalendarResolutionSchema.enum.MONTH) {
      if (spansCurrentYear) {
        return startDate.format('MMMM')
      }
      return startDate.format('MMM YYYY')
    }

    if (spansSingleYear) {
      const endFormat = spansCurrentYear ? 'D' : 'D, YYYY'

      if (spansSingleMonth) {
        return [startDate.format('MMM D'), endDate.format(endFormat)].join(DATE_RANGE_SEPERATOR)
      }

      return [startDate.format('MMM D'), endDate.format(`MMM ${endFormat}`)].join(DATE_RANGE_SEPERATOR)
    }

    const format = (!resolution || resolution === CalendarResolutionSchema.enum.WEEK)
      ? 'MMM D, YYYY'
      : 'MMM YYYY'

    return [startDate.format(format), endDate.format(format)].join(DATE_RANGE_SEPERATOR)
  }, [resolution, fromDate, toDate, now])

  const formattedCurrentDay = useMemo(() => {
    return now.format('dddd, MMMM D')
  }, [now])

  const handlePrevPage = () => {
    if (!resolution || resolution === CalendarResolutionSchema.enum.CUSTOM) {
      return
    }

    if (resolution === CalendarResolutionSchema.enum.MONTH) {
      setCalendar({
        ...calendar,
        fromDate: dayjs(fromDate).subtract(1, 'month').toISOString(),
        toDate: undefined,
      })
    } else if (resolution === CalendarResolutionSchema.enum.WEEK) {
      setCalendar({
        ...calendar,
        fromDate: dayjs(fromDate).subtract(1, 'week').toISOString(),
        toDate: undefined,
      })
    } else if (resolution === CalendarResolutionSchema.enum.YEAR) {
      setCalendar({
        ...calendar,
        fromDate: dayjs(fromDate).subtract(1, 'year').toISOString(),
        toDate: undefined,
      })
    }
  }

  const handleNextPage = () => {
    if (!resolution || resolution === CalendarResolutionSchema.enum.CUSTOM) {
      return
    }

    if (resolution === CalendarResolutionSchema.enum.MONTH) {
      setCalendar({
        ...calendar,
        fromDate: dayjs(fromDate).add(1, 'month').toISOString(),
        toDate: undefined,
      })
    } else if (resolution === CalendarResolutionSchema.enum.WEEK) {
      setCalendar({
        ...calendar,
        fromDate: dayjs(fromDate).add(1, 'week').toISOString(),
        toDate: undefined,
      })
    } else if (resolution === CalendarResolutionSchema.enum.YEAR) {
      setCalendar({
        ...calendar,
        fromDate: dayjs(fromDate).add(1, 'year').toISOString(),
        toDate: undefined,
      })
    }
  }

  const handleChangeResolution = (resolution: CalendarResolution) => {
    setShowDateViewPicker(false)
    setCalendar({
      ...calendar,
      resolution,
    })
  }

  const jumpToToday = () => {
    if (!resolution || resolution === CalendarResolutionSchema.enum.CUSTOM) {
      return
    }

    setCalendar({
      ...calendar,
      fromDate: now.toISOString(),
      toDate: undefined,
    })
  }

  return (
    <>
      <Menu
        open={showDateViewPicker}
        anchorEl={dateViewPickerButtonRef.current}
        onClose={() => setShowDateViewPicker(false)}>
        {SELECTABLE_DATE_VIEWS.map((selectableResolution) => {
          const label = dateViewMenuOptionLabels[selectableResolution];

          return (
            <MenuItem
              key={selectableResolution}
              onClick={() => handleChangeResolution(selectableResolution)}
              aria-label={`View by ${label}`}
              selected={selectableResolution === resolution}>
              <ListItemText>{label}</ListItemText>

              <KeyboardShortcut
                name={KeyboardActionName.DATE_VIEW_WEEKLY}
                sx={{ ml: 2 }}
              />
            </MenuItem>
          )
        })}
      </Menu>
      <Popover open={showDatePicker} onClose={() => setShowDatePicker(false)} anchorEl={datePickerButtonRef.current}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
          // views={calendarAvailableViews}
          // onChange={(value) => {
          //     // handleChangeDatePickerDate(value)
          // }}
          />
        </LocalizationProvider>
      </Popover>
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: 'center'
        }}>
        {!hideDateViewPicker && (
          <Button
            variant="text"
            sx={(theme) => ({
              py: 0.75,
              backgroundColor: theme.palette.action.hover,
              '&:hover': {
                backgroundColor: theme.palette.action.selected,
              },
            })}
            ref={dateViewPickerButtonRef}
            onClick={() => setShowDateViewPicker((showing) => !showing)}
            color="inherit"
            endIcon={<ArrowDropDown />}>
            <Typography>{dateViewMenuOptionLabels[resolution ?? CalendarResolutionSchema.enum.CUSTOM]}</Typography>
          </Button>
        )}
        {!hideTodayButton && (
          <Tooltip title={formattedCurrentDay}>
            <IconButton color="inherit" onClick={() => jumpToToday()}>
              <CalendarToday />
            </IconButton>
          </Tooltip>
        )}
        <Button
          color="inherit"
          endIcon={<ArrowDropDown />}
          ref={datePickerButtonRef}
          onClick={() => setShowDatePicker((showing) => !showing)}>
          <Typography variant={headingSize} sx={{ fontWeight: 500 }}>
            {formattedDateString}
          </Typography>
        </Button>
        {!hideNextPrevButtons && (
          <Stack direction="row">
            <Tooltip title={prevButtonTooltip}>
              <IconButton onClick={() => handlePrevPage()}>
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Tooltip title={nextButtonTooltip}>
              <IconButton onClick={() => handleNextPage()}>
                <ArrowForward />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>
    </>
  );
}
