import { Close } from '@mui/icons-material'
import { Container, Grid, IconButton, Paper, Stack, Tooltip } from '@mui/material'
import { ReactNode } from 'react'

interface WelcomeLayoutProps {
  previewSlot?: ReactNode
  formSlot: ReactNode
  actionsSlot: ReactNode
}

export default function WelcomePage(props: WelcomeLayoutProps) {
  return (
    <Stack component={Paper} alignItems='center' sx={(theme) => ({ borderRadius: theme.spacing(3), overflow: 'hidden' })}>
      <Grid container columns={12} sx={{ flex: 1, width: '100%' }}>
        <Grid size={5} sx={{ position: 'relative', py: 8 }} display='flex' alignItems='center'>
          <Container maxWidth='lg' disableGutters sx={{ px: 6 }}>
            {props.previewSlot}
          </Container>
        </Grid>
        <Grid size={7} sx={{ position: 'relative', py: 8 }} display='flex' alignItems='center'>
          <Stack position='absolute' top={0} right={0} sx={(theme) => ({ zIndex: 2, width: theme.spacing(8), height: theme.spacing(8), alignItems: 'center', justifyContent: 'center' })}>
            <Tooltip title='Close'>
              <IconButton size='large'>
                <Close />
              </IconButton>
            </Tooltip>
          </Stack>
          <Container maxWidth='lg' sx={{ px: 6 }} disableGutters>
            {props.formSlot}
            <Stack direction='row' justifyContent='flex-end' sx={{ width: '100%', mt: 4 }}>
              {props.actionsSlot}
            </Stack>
          </Container>
        </Grid>
      </Grid>
    </Stack>
  )
}
