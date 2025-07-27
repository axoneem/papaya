import WelcomePage from '@/layouts/WelcomePage'
import { Button, Stack, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_welcomeLayout/welcome/start')({
  component: WelcomeStart,
})

function WelcomeStart() {
  return (
    <WelcomePage
      formSlot={
        <Stack gap={2}>
          <Typography variant="h2">You're all set!</Typography>
          <Typography variant="body1">
            You can start using Papaya to manage your money.
          </Typography>
        </Stack>
      }
      actionsSlot={
        <>
          <Button variant="contained" color="primary">
            Finish
          </Button>
        </>
      }
    />
  )
} 