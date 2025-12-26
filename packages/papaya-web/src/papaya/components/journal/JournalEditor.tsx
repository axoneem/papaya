import { NotificationsContext } from '@/contexts/NotificationsContext'
import { deleteJournalEntry } from '@/database/actions'
import { getDatabaseClient } from '@/database/client'
import { Box, Collapse, Divider, Grid, Paper, Stack } from '@mui/material'
import { MouseEvent, useContext, useEffect, useMemo, useState } from 'react'
import JournalEntryCard from './JournalEntryCard'
import JournalEntryList from './JournalEntryList'
import JournalHeader from './ribbon/JournalHeader'
// import SpendChart from '../chart/SpendChart'
// import CategorySpreadChart from '../chart/CategorySpreadChart'
import { useFilteredJournalEntries } from '@/hooks/queries/useFilteredJournalEntries'
import { JournalEntry } from '@/schema/documents/JournalEntry'
import { useBeginEditingJournalEntry } from '@/store/app/useJournalEntryEditModalState'
import { useSearch } from '@tanstack/react-router'
import StemEditor from './StemEditor'

export interface JournalEntrySelection {
  entry: JournalEntry | null
  anchorEl: HTMLElement | null
}

export default function JournalEditor() {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntrySelection>({
    entry: null,
    anchorEl: null,
  })

  const { snackbar } = useContext(NotificationsContext)
  const journalEntriesQuery = useFilteredJournalEntries()

  const beginEditingJournalEntry = useBeginEditingJournalEntry()

  const { tab } = useSearch({ from: '/_mainLayout/journal/$view/$' })

  const journalGroups: Record<string, JournalEntry[]> = useMemo(() => {
    const entries: Record<string, JournalEntry> = {
      ...journalEntriesQuery.data,
      // ...journalSliceContext.getTentativeJournalEntryRecurrencesQuery.data,
    }
    const groups = Object.values(entries).reduce(
      (acc: Record<JournalEntry['_id'], JournalEntry[]>, entry: JournalEntry) => {
        const { date } = entry
        if (!date) {
          return acc
        }
        if (acc[date]) {
          acc[date].push(entry)
        } else {
          acc[date] = [entry]
        }

        return acc
      },
      {},
    )

    return groups
  }, [
    journalEntriesQuery.data,
    // journalSliceContext.getTentativeJournalEntryRecurrencesQuery.data,
  ])

  const handleClickListItem = (event: MouseEvent<any>, entry: JournalEntry) => {
    setSelectedEntry({
      anchorEl: event.currentTarget,
      entry: entry,
    })
  }

  const handleDoubleClickListItem = (_event: MouseEvent<any>, entry: JournalEntry) => {
    beginEditingJournalEntry(entry)
  }

  const handleDeselectListItem = () => {
    setSelectedEntry((prev) => {
      const next = {
        ...prev,
        anchorEl: null,
      }
      return next
    })
  }

  const handleDeleteEntry = async (entry: JournalEntry | null) => {
    if (!entry) {
      return
    }

    try {
      await deleteJournalEntry(entry._id)
      journalEntriesQuery.refetch()
      handleDeselectListItem()
      snackbar({
        message: 'Deleted 1 entry',
        action: {
          label: 'Undo',
          onClick: async () => {
            // undeleteJournalEntry(record)
            // 	.then(() => {
            // 		journalContext.getCategoriesQuery.refetch()
            // 		snackbar({ message: 'Category restored' })
            // 	})
            // 	.catch((error) => {
            // 		console.error(error)
            // 		snackbar({ message: 'Failed to restore category: ' + error.message })
            // 	})
          },
        },
      })
    } catch {
      snackbar({ message: 'Failed to delete entry' })
    }
  }

  // show all docs
  useEffect(() => {
    const db = getDatabaseClient()
    db.allDocs({ include_docs: true }).then((result) => {
      console.log('all docs', result)
    })
  }, [])

  return (
    <>
      {selectedEntry.entry && (
        <JournalEntryCard
          entry={selectedEntry.entry}
          anchorEl={selectedEntry.anchorEl}
          onClose={() => handleDeselectListItem()}
          onDelete={() => handleDeleteEntry(selectedEntry.entry)}
        />
      )}
      <Stack
        direction="row"
        sx={{
          gap: 2,
          height: '100%',
          width: '100%',
          pb: { sm: 0, md: 2 },
        }}
      >
        <Stack
          sx={{
            flex: 1,
            gap: 0,
            height: '100%',
            width: '100%',
          }}>
          <Collapse in={false}>
            <Stack direction="row" gap={2} mb={2}>
              {/* <SpendChart />
							<CategorySpreadChart /> */}
            </Stack>
          </Collapse>

          <Grid container spacing={4}>
            <Grid size={6}>
              <Stack
                component={Paper}
                sx={(theme) => ({
                  flex: 1,
                  borderTopLeftRadius: theme.spacing(2),
                  borderTopRightRadius: theme.spacing(2),
                  borderBottomLeftRadius: { sm: 0, md: theme.spacing(2) },
                  borderBottomRightRadius: { sm: 0, md: theme.spacing(2) },
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0, // Allow flex item to shrink
                })}>
                <JournalHeader />
                <Divider />
                <Box
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    minHeight: 0, // Allow flex item to shrink
                  }}>
                  <JournalEntryList
                    journalRecordGroups={tab === 'journal' ? journalGroups : {}}
                    onClickListItem={handleClickListItem}
                    onDoubleClickListItem={handleDoubleClickListItem}
                  />
                  <Stack component="footer"></Stack>
                </Box>
              </Stack>
            </Grid>
            <Grid size={6}>
              <StemEditor />
            </Grid>
          </Grid>

        </Stack>
      </Stack>
    </>
  )
}
