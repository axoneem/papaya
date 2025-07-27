import { JournalContext } from '@/contexts/JournalContext'
import { useJournalSelectorStatus, useSetJournalSelectorStatus } from '@/store/app/useJournalSelectorState'
import { East } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import SelectJournalForm from '../form/SelectJournalForm'
import CreateJournalModal from './CreateJournalModal'

export default function SelectJournalModal() {
  const journalContext = useContext(JournalContext)
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(journalContext.activeJournalId)
  const [previouslyActiveJournalId, setPreviouslyActiveJournalId] = useState<string | null>(null)

  const [journalSelectorState, setJournalSelectorStatus] = [useJournalSelectorStatus(), useSetJournalSelectorStatus()]
  const showSelectJournalModal = ['SELECTING', 'CREATING'].includes(journalSelectorState)

  useEffect(() => {
    if (showSelectJournalModal) {
      setSelectedJournalId(journalContext.activeJournalId)
    }
  }, [journalContext.activeJournalId, showSelectJournalModal])

  useEffect(() => {
    if (showSelectJournalModal) {
      setPreviouslyActiveJournalId(journalContext.activeJournalId)
    }
  }, [showSelectJournalModal])

  const handleContinue = () => {
    if (!selectedJournalId) {
      return
    }
    journalContext.setActiveJournalId(selectedJournalId)
    onCloseSelectJournalModal()
  }

  const onCloseCreateModal = () => {
    setJournalSelectorStatus('SELECTING')
  }

  const onCloseSelectJournalModal = () => {
    setJournalSelectorStatus('CLOSED')
  }

  const hasActiveJournal = Boolean(journalContext.activeJournalId)

  return (
    <>
      <CreateJournalModal
        open={journalSelectorState === 'CREATING'}
        onClose={onCloseCreateModal}
        onCreated={(newJournal) => setSelectedJournalId(newJournal._id)}
      />
      <Dialog open={showSelectJournalModal}>
        <DialogTitle>Your Journals</DialogTitle>
        {!hasActiveJournal && (
          <DialogContent>
            <DialogContentText>Please select a journal.</DialogContentText>
          </DialogContent>
        )}
        <SelectJournalForm
          value={selectedJournalId}
          onChange={setSelectedJournalId}
          onCreateNew={() => setJournalSelectorStatus('CREATING')}
          showCreateOption
          previouslyActiveJournalId={previouslyActiveJournalId}
        />
        <DialogActions>
          {journalContext.activeJournalId && <Button onClick={() => setJournalSelectorStatus('CLOSED')}>Cancel</Button>}
          <Button
            variant="contained"
            disabled={!selectedJournalId || journalContext.activeJournalId === selectedJournalId}
            onClick={() => handleContinue()}
            startIcon={<East />}>
            {hasActiveJournal ? 'Switch Journal' : 'Select Journal'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
