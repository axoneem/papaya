import { Badge, Button, Stack, Typography } from '@mui/material';

import LedgerDateNavigation from '@/components/features/journal-editor/LedgerDateNavigation';
import { JournalEntryEditorContext } from '@/model/contexts/JournalEntryEditorContext';
import { Add } from '@mui/icons-material';
import { useContext, useRef, useState } from 'react';

export default function JournalToolbar() {
  const [showFiltersMenu, setShowFiltersMenu] = useState<boolean>(false)
  const filtersMenuButtonRef = useRef<HTMLButtonElement | null>(null)
  const { beginCreating } = useContext(JournalEntryEditorContext)

  const activeFilterSlots: Set<unknown> = new Set()

  const numFilters = activeFilterSlots.size

  const hideFilterButton = false


  return (

    <header>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ flex: 0, py: 1, px: 2, pb: 0 }}
        alignItems="center"
        gap={1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }} gap={2}>
          <Stack direction="row" alignItems="center" gap={1}>
            {/* <JournalEntrySelectionActions /> */}
            {!hideFilterButton && (
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Badge
                  color="primary"
                  badgeContent={numFilters}
                  variant="standard"
                  slotProps={{ badge: { style: { top: '10%', right: '5%' } } }}>
                  <Button
                    variant="contained"
                    sx={(theme) => ({
                      borderRadius: theme.spacing(8),
                      py: 0.75,
                      px: 1.5,
                    })}
                    ref={filtersMenuButtonRef}
                    onClick={() => setShowFiltersMenu((showing) => !showing)}
                    color="inherit"
                    startIcon={<Add fontSize="small" />}>
                    <Typography>Filter</Typography>
                  </Button>
                </Badge>
                <Button variant="contained" onClick={() => beginCreating()}>
                  <Add />
                  New Entry
                </Button>
              </Stack>
            )}
          </Stack>
          <LedgerDateNavigation />
        </Stack>
      </Stack>

    </header>
  )
}
