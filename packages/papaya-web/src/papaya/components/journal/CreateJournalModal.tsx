import { createJournal } from '@/database/actions'
import { useAddJournal } from '@/hooks/queries/useJournals'
import { CreateJournal, Journal } from '@/schema/documents/Journal'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import CreateJournalForm from '../form/CreateJournalForm'
import { DEFAULT_AVATAR } from '../pickers/AvatarPicker'

interface CreateJournalModalProps {
  open: boolean
  onClose: () => void
  onCreated: (newJournal: Journal) => void
}

const DEFAULT_JOURNAL_AVATAR = {
  ...DEFAULT_AVATAR,
}

export const JOURNAL_FORM_CREATE_VALUES: CreateJournal = {
  avatar: {
    ...DEFAULT_JOURNAL_AVATAR,
  },
  journalName: '',
}

export default function CreateJournalModal(props: CreateJournalModalProps) {
  const addJournal = useAddJournal()

  const createJournalForm = useForm<CreateJournal>({
    defaultValues: JOURNAL_FORM_CREATE_VALUES,
    resolver: zodResolver(CreateJournal),
  })

  const handleSubmit = async (formData: CreateJournal) => {
    // Create a new journal
    const newJournal: Journal = await createJournal({
      ...formData,
    })

    addJournal(newJournal)
    props.onClose()
    props.onCreated(newJournal)
  }

  useEffect(() => {
    if (!props.open) {
      createJournalForm.reset()
    }
  }, [props.open])

  return (
    <FormProvider {...createJournalForm}>
      <Dialog open={props.open} onClose={props.onClose}>
        <form onSubmit={createJournalForm.handleSubmit(handleSubmit)}>
          <DialogTitle>Create a Journal</DialogTitle>
          <DialogContent sx={{ overflow: 'initial' }}>
            <CreateJournalForm />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button variant="contained" type="submit">
              Create Journal
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </FormProvider>
  )
}
