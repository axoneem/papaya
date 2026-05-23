import { KeyboardDoubleArrowLeft } from '@mui/icons-material'
import { Drawer, IconButton, Stack } from '@mui/material'
import { PropsWithChildren } from 'react'

interface DetailsDrawerProps extends PropsWithChildren {
  open: boolean
  actions?: React.ReactNode
  onClose: () => void
}

export default function DetailsDrawer(props: DetailsDrawerProps) {
  return (
    <Drawer
      disableEnforceFocus
      anchor="right"
      open={props.open}
      onClose={props.onClose}
      slotProps={{
        paper: {
          sx: (theme) => ({
            width: '50%',
            maxWidth: theme.breakpoints.values.lg,
          }),
        }
      }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          p: 2,
          alignItems: 'center'
        }}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <IconButton onClick={props.onClose}>
            <KeyboardDoubleArrowLeft />
          </IconButton>
        </Stack>
        {props.actions && (
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            {props.actions}
          </Stack>
        )}
      </Stack>
      {/* <Divider /> */}
      {props.children}
    </Drawer>
  );
}
