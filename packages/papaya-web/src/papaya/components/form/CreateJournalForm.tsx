import { CreateJournal } from '@/schema/documents/Journal'
import { Box, Stack, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import AvatarPicker from '../pickers/AvatarPicker'
import ImportJournalForm from './ImportJournalForm'

export default function CreateJournalForm() {
  const { register, control } = useFormContext<CreateJournal>()

  return (
    <Box>
      <Stack gap={2}>
        <Stack direction="row" spacing={1}>
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => <AvatarPicker value={field.value} onChange={field.onChange} />}
          />
          <TextField {...register('journalName')} fullWidth label="Journal name" />
        </Stack>
        <ImportJournalForm />
      </Stack>
    </Box>
  )
} 