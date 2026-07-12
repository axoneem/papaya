import { Delete, MoreVert } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  ClickAwayListener,
  Divider,
  Fade,
  IconButton,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

interface SelectionActionModalActions {
  onDelete: () => void
}

interface SelectionActionModalProps {
  anchorEl: Element | null
  open: boolean
  numSelected: number
  numTotalSelectable: number
  actions?: SelectionActionModalActions
  onSelectAll: () => void
  onDeselectAll: () => void
}

export default function SelectionActionModal(props: SelectionActionModalProps) {
  const [numSelectedDisplayed, setNumSelectedDisplayed] = useState<number>(props.numSelected)

  const handleSelectAllChange = () => {
    if (props.numSelected === props.numTotalSelectable) {
      props.onDeselectAll()
    } else {
      props.onSelectAll()
    }
  }

  const handleClickAway = useCallback(() => {
    //
  }, [props.open])

  useEffect(() => {
    if (props.numSelected > 0) {
      setNumSelectedDisplayed(props.numSelected)
    }
  }, [props.numSelected])

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Popper open={props.open} anchorEl={props.anchorEl} style={{ zIndex: 10000 }} transition placement="top-start">
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Stack
                direction="row"
                sx={{
                  alignItems: 'center',
                  'button:not(.MuiIconButton-root):not(:first-child)': {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  },
                  'button:not(.MuiIconButton-root):not(:last-child)': {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}>
                <Button
                  onClick={() => handleSelectAllChange()}
                  sx={{ gap: 1, px: 2, py: 0 }}
                  tabIndex={-1}
                  disableFocusRipple>
                  <Checkbox
                    indeterminate={numSelectedDisplayed > 0 && numSelectedDisplayed < props.numTotalSelectable}
                    checked={numSelectedDisplayed > 0 && numSelectedDisplayed === props.numTotalSelectable}
                    disabled={props.numTotalSelectable <= 0}
                    sx={{ mx: -1 }}
                    disableTouchRipple
                  />
                  <Typography sx={{
                    color: "inherit"
                  }}>{numSelectedDisplayed} selected</Typography>
                </Button>
                {props.actions?.onDelete && (
                  <>
                    <Divider orientation="vertical" flexItem />
                    <Tooltip title="Delete">
                      <IconButton onClick={() => props.actions?.onDelete()}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <Divider orientation="vertical" flexItem />
                <IconButton disabled>
                  <MoreVert />
                </IconButton>
              </Stack>
            </Paper>
          </Fade>
        )}
      </Popper>
    </ClickAwayListener>
  );
}
