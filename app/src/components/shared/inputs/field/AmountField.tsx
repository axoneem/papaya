import { SwapHoriz } from '@mui/icons-material'
import { IconButton, InputAdornment, Stack, TextField, TextFieldProps } from '@mui/material'
// import { ToggleButtonGroup, ToggleButton } from "@mui/material"

type AmountFieldProps = TextFieldProps & {
  disableSignChange?: boolean
  approximate?: boolean
}

export default function AmountField(props: AmountFieldProps) {
  const value = String(props.value ?? '')
  const isIncome = value.startsWith('+')

  const valueWithSanitizedSymbols = value.replace(/[+-]/g, '')

  const toggleSign = () => {
    if (props.disableSignChange) {
      return
    }
    const event = new Event('change', { bubbles: true })
    const syntheticEvent = {
      ...event,
      target: {
        ...event.target,
        value: isIncome ? valueWithSanitizedSymbols : `+${valueWithSanitizedSymbols}`,
      },
    }

    props.onChange?.(syntheticEvent as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    const trailingCharacter = value[value.length - 1]
    if (isIncome && trailingCharacter === '-') {
      toggleSign()
      return
    } else if (!isIncome && trailingCharacter === '+') {
      toggleSign()
      return
    }

    const newValue = value
      .replace(/[^0-9.,+]/g, '') // Remove non-numeric characters except for dot, comma, or plus sign
      .replace(/(\..*?)\..*/g, '$1') // Allow only one dot
      .replace(/(\.\d{2})\d+/g, '$1') // Limit to two decimal places
      .replace(/[-+](?!.)/g, '') // Remove any pluses or minuses that are not at the beginning of the string
      .replace(/^([+-])\1+/, '$1') // Removes pluses or minuses that are duplicated at the start

    props.onChange?.({ ...event, target: { ...event.target, value: newValue } })
  }

  const { disableSignChange, slotProps, sx, approximate, ...rest } = props

  return (
    <Stack direction="row" sx={{
      gap: 1
    }}>
      <TextField
        label="Amount"
        placeholder="00.00"
        fullWidth={props.fullWidth !== false}
        slotProps={{
          htmlInput: {
            inputMode: 'decimal',
          },
          input: {
            startAdornment: (
              <InputAdornment
                position="start"
                sx={(theme) => ({ color: approximate ? theme.palette.warning.main : undefined })}>
                {approximate ? '~' : ''}$
              </InputAdornment>
            ),
            endAdornment: disableSignChange ? undefined : (
              <IconButton onClick={() => toggleSign()}>
                <SwapHoriz />
              </IconButton>
            ),
            sx: (theme) => ({
              color: isIncome ? theme.palette.success.main : undefined,
            }),
          },
          ...slotProps,
        }}
        sx={{ flex: 1 }}
        autoComplete="off"
        {...rest}
        onChange={handleChange}
        value={value}
      />
      {/* <ToggleButtonGroup
                color='primary'
                value={isIncome ? 'income' : 'expense'}
                exclusive
                onChange={() => toggleSign()}
            >
                <ToggleButton value='income' tabIndex={isIncome ? -1 : undefined}>Income</ToggleButton>
                <ToggleButton value='expense' tabIndex={isIncome ? undefined : -1}>Expense</ToggleButton>
            </ToggleButtonGroup> */}
    </Stack>
  );
}
