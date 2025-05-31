import { Box, FormHelperText, Stack, TextField } from '@mui/material'
import { Account, CreateAccount } from '@ui/schema/documents/Account'
import { Avatar } from '@ui/schema/models/Avatar'
import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import AvatarPicker from '../pickers/AvatarPicker'

export default function AccountForm() {
  const { register, setValue, watch } = useFormContext<CreateAccount | Account>()

  const currentIcon: Avatar | null = useMemo(() => {
    const { avatar } = watch()

    if (Object.values(avatar).some(Boolean)) {
      return avatar
    }
    return null
  }, [watch()])

  return (
    <Box>
      <Stack gap={2}>
        <Stack direction="row" alignItems="center" gap={2}>
          <TextField {...register('label')} label="Label" placeholder="Visa 4321" fullWidth multiline />
          <AvatarPicker value={currentIcon} onChange={(avatar) => setValue('avatar', avatar, { shouldDirty: true })} />
        </Stack>
        <TextField
          {...register('description')}
          label="Description"
          placeholder="Capital One Visa Infinite (4321)"
          fullWidth
          multiline
          rows={3}
        // helperText=''
        />
        <FormHelperText>
          The description may be used by a language model to categorize your transactions, so be descriptive.
        </FormHelperText>
      </Stack>
    </Box>
  )
}
