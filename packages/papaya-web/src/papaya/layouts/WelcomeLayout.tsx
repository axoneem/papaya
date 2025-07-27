import AppLogo from '@/components/nav/header/AppLogo'
import { Stack } from '@mui/material'
import { PropsWithChildren } from 'react'

export default function WelcomeLayout({ children }: PropsWithChildren) {
  return (
    <Stack
      component="main"
      sx={{
        height: '100dvh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: '1fr',
        p: 4,
        gap: 4,
      }}
    >
      <Stack gap={4} direction="row" alignItems="center">
        <AppLogo />
        {/* <Button variant='outlined'>Close</Button> */}
      </Stack>
      {children}
    </Stack>
  )
}
