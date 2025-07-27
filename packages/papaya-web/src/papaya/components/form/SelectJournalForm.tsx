import { PLACEHOLDER_UNNAMED_JOURNAL_NAME } from '@/constants/journal'
import { JournalContext } from '@/contexts/JournalContext'
import { useJournals } from '@/hooks/queries/useJournals'
import { Journal } from '@/schema/documents/Journal'
import { Add, InfoOutlined } from '@mui/icons-material'
import {
  Avatar,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { useContext, useState } from 'react'
import AvatarIcon from '../icon/AvatarIcon'
import ManageJournalModal from '../journal/ManageJournalModal'

interface SelectJournalFormProps {
  value?: string | null
  onChange?: (journalId: string | null) => void
  onCreateNew?: () => void
  showCreateOption?: boolean
  previouslyActiveJournalId?: string | null
}

export default function SelectJournalForm(props: SelectJournalFormProps) {
  const journalContext = useContext(JournalContext)
  const [showManageJournalModal, setShowManageJournalModal] = useState(false)
  const [managedJournalId, setManagedJournalId] = useState<string | null>(null)

  const getJournalsQuery = useJournals()
  const journals = getJournalsQuery.data

  const handleManageJournal = (journal: Journal) => {
    setManagedJournalId(journal._id)
    setShowManageJournalModal(true)
  }

  const handleDeletedJournal = (journal: Journal) => {
    // If the deleted journal is the active journal, reset the active journal
    if (journal._id === journalContext.activeJournalId) {
      journalContext.setActiveJournalId(null)
    }
    // Also clear selection if this was the selected journal
    if (journal._id === props.value) {
      props.onChange?.(null)
    }
  }

  return (
    <>
      <List>
        {Object.values(journals).map((journal: Journal) => {
          const selected = props.value === journal._id
          return (
            <ListItem
              key={journal._id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleManageJournal(journal)}>
                  <InfoOutlined />
                </IconButton>
              }
              disablePadding>
              <ListItemButton
                role={undefined}
                onClick={() => props.onChange?.(journal._id)}
                selected={selected}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AvatarIcon avatar={journal.avatar} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography sx={{ fontStyle: !journal.journalName ? 'italic' : undefined }}>
                        {journal.journalName || PLACEHOLDER_UNNAMED_JOURNAL_NAME}
                      </Typography>
                      {journal._id === props.previouslyActiveJournalId && (
                        <Chip
                          size="small"
                          color="primary"
                          label={<Typography variant="overline">Active</Typography>}
                        />
                      )}
                    </Stack>
                  }
                />
              </ListItemButton>
            </ListItem>
          )
        })}
        {props.showCreateOption && Object.values(journals).length > 0 && <Divider component="li" />}
        {props.showCreateOption && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => props.onCreateNew?.()}>
              <ListItemAvatar>
                <Avatar>
                  <Add />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Add journal" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <ManageJournalModal
        open={showManageJournalModal}
        onClose={() => setShowManageJournalModal(false)}
        details={{
          journal: managedJournalId ? (journals[managedJournalId] ?? null) : null,
          activity: [],
          size: null,
          lastActivity: null,
        }}
        onDeletedJournal={handleDeletedJournal}
      />
    </>
  )
} 