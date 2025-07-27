import CreateJournalForm from '@/components/form/CreateJournalForm'
import SelectJournalForm from '@/components/form/SelectJournalForm'
import { JOURNAL_FORM_CREATE_VALUES } from '@/components/journal/CreateJournalModal'
import { createJournal } from '@/database/actions'
import { useAddJournal } from '@/hooks/queries/useJournals'
import WelcomePage from '@/layouts/WelcomePage'
import { CreateJournal, Journal } from '@/schema/documents/Journal'
import { zodResolver } from '@hookform/resolvers/zod'
import { Add, ArrowBack, ArrowForward, List as ListIcon } from '@mui/icons-material'
import { Box, Button, Container, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export const Route = createFileRoute('/_welcomeLayout/welcome/journal')({
  component: CreateJournalPage,
})

type Mode = 'create' | 'select'

function CreateJournalPage() {
  const addJournal = useAddJournal()
  const [mode, setMode] = useState<Mode>('create')
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null)

  const createJournalForm = useForm<CreateJournal>({
    defaultValues: JOURNAL_FORM_CREATE_VALUES,
    resolver: zodResolver(CreateJournal),
  })

  const handleCreateSubmit = async (formData: CreateJournal) => {
    // Create a new journal
    const newJournal: Journal = await createJournal({
      ...formData,
    })

    addJournal(newJournal)
    // TODO: Navigate or handle success
  }

  const handleSelectSubmit = () => {
    if (selectedJournalId) {
      // TODO: Handle journal selection (set as active, navigate, etc.)
      console.log('Selected journal:', selectedJournalId)
    }
  }

  const isCreateMode = mode === 'create'
  const canContinue = isCreateMode
    ? createJournalForm.formState.isValid
    : Boolean(selectedJournalId)

  return (
    <FormProvider {...createJournalForm}>
      <WelcomePage
        formSlot={
          <Container maxWidth='md' disableGutters>
            <Stack gap={4}>
              <Stack gap={2}>
                <Typography variant='h5'>
                  {isCreateMode ? 'Create a new journal' : 'Select an existing journal'}
                </Typography>
                <Typography variant='body2'>
                  {isCreateMode
                    ? 'Create a new journal to get started.'
                    : 'Choose from your existing journals to continue.'}
                </Typography>
              </Stack>

              <Stack gap={2}>
                <ToggleButtonGroup
                  value={mode}
                  exclusive
                  fullWidth
                  onChange={(_, newMode) => newMode && setMode(newMode)}
                  aria-label="journal mode"
                >
                  <ToggleButton value="create" aria-label="create journal">
                    <Add sx={{ mr: 1 }} />
                    Create New
                  </ToggleButton>
                  <ToggleButton value="select" aria-label="select journal">
                    <ListIcon sx={{ mr: 1 }} />
                    Select Existing
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              <Box>
                {isCreateMode ? (
                  <form onSubmit={createJournalForm.handleSubmit(handleCreateSubmit)}>
                    <CreateJournalForm />
                  </form>
                ) : (
                  <SelectJournalForm
                    value={selectedJournalId}
                    onChange={setSelectedJournalId}
                    showCreateOption={false}
                  />
                )}
              </Box>
            </Stack>
          </Container>
        }
        actionsSlot={
          <Stack direction='row' gap={2}>
            <Button component={Link} to='/welcome/getting-started' variant='text' startIcon={<ArrowBack />}>
              Back
            </Button>
            <Button
              variant='text'
              endIcon={<ArrowForward />}
              disabled={!canContinue}
              onClick={isCreateMode ? createJournalForm.handleSubmit(handleCreateSubmit) : handleSelectSubmit}
            >
              Continue
            </Button>
          </Stack>
        }
      />
    </FormProvider>
  )
}
