import Autocomplete, { type AutocompleteProps } from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { useMemo, type ReactNode } from 'react'

export type TopicFieldProps = {
  /** Topic strings offered as autocomplete suggestions (known / previously used). */
  knownTopics?: readonly string[]
  label?: ReactNode
  placeholder?: string
} & Omit<AutocompleteProps<string, true, false, true>, 'options' | 'renderInput' | 'multiple' | 'freeSolo'>

function normalizeTopicList(topics: readonly string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const t of topics) {
    const s = t.trim()
    if (s && !seen.has(s)) {
      seen.add(s)
      out.push(s)
    }
  }
  return out
}

export default function TopicField({
  knownTopics = [],
  label = 'Topics',
  placeholder = 'Topic',
  fullWidth = true,
  size,
  value,
  defaultValue,
  onChange,
  filterSelectedOptions = true,
  ...rest
}: TopicFieldProps) {
  const options = useMemo(() => {
    const unique = new Set<string>()
    for (const t of knownTopics) {
      const s = t.trim()
      if (s) unique.add(s)
    }
    return [...unique].sort((a, b) => a.localeCompare(b))
  }, [knownTopics])

  return (
    <Autocomplete<string, true, false, true>
      {...rest}
      multiple
      freeSolo
      options={options}
      value={value}
      defaultValue={defaultValue}
      onChange={(event, newValue, reason, details) => {
        onChange?.(event, normalizeTopicList(newValue), reason, details)
      }}
      filterSelectedOptions={filterSelectedOptions}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      fullWidth={fullWidth}
      size={size}
      renderValue={(selected, getItemProps) =>
        selected.map((option, index) => {
          const { key, ...itemProps } = getItemProps({ index })
          return (
            <Chip
              key={key}
              variant="outlined"
              label={option}
              size={size === 'small' ? 'small' : 'medium'}
              {...itemProps}
            />
          )
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          fullWidth={fullWidth}
          size={size}
          slotProps={{
            htmlInput: {
              ...params.slotProps.htmlInput,
              autoComplete: 'new-password',
            },
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <>
                  <InputAdornment position="start">#</InputAdornment>
                  {params.slotProps.input.startAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  )
}
