import RadioToggleButton from '@/components/input/RadioToggleButton'
import WelcomePage from '@/layouts/WelcomePage'
import { ArrowForward, ExpandLess, ExpandMore } from '@mui/icons-material'
import { Box, Button, Container, Grow, Stack, ToggleButtonGroup, Typography } from '@mui/material'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/_welcomeLayout/welcome/getting-started')({
  component: GettingStarted,
})

type WelcomeState = 'new' | 'import' | 'start' | 'demo'
type WelcomeAction = 'continue' | 'skip'

function GettingStarted() {
  const [value, setValue] = useState<WelcomeState>('new')
  const [showOtherOptions, setShowOtherOptions] = useState(false)

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: string) => {
    setValue(newValue as WelcomeState)
  }

  const isShowingOtherOptions = value === 'demo' || value === 'start' || showOtherOptions

  const welcomeAction: WelcomeAction = useMemo(() => {
    if (value === 'new' || value === 'import') {
      return 'continue'
    }

    return 'skip'
  }, [value])

  const handleFinish = (_state: WelcomeState) => {
    //
  }

  const actionButton = useMemo(() => {
    if (welcomeAction === 'continue') {
      return <Button variant='text' component={Link} to={'/welcome/journal'} endIcon={<ArrowForward />}>
        Continue
      </Button>
    }
    return <Button onClick={() => handleFinish(value)} variant='contained' endIcon={<ArrowForward />}>
      Finish
    </Button>
  }, [welcomeAction, value])

  return (
    <WelcomePage
      formSlot={
        <Container maxWidth='md' disableGutters>
          <Stack gap={4}>
            <Stack gap={2}>
              <Typography variant='h5'>Get started with Papaya</Typography>
              <Typography variant='body2'>
                Start by setting up a new journal, or importing your existing data from a Papaya Server.
              </Typography>
            </Stack>
            <Stack>
              <ToggleButtonGroup exclusive value={value} onChange={handleChange} orientation='vertical'>
                <RadioToggleButton value='new' heading='Set up a new journal' description='Create a new journal to get started' />
                <RadioToggleButton value='import' heading='Import existing data from my Papaya Server' description='Import your existing data from your Papaya Server' />
              </ToggleButtonGroup>
              <Box sx={{ py: 1 }}>
                <Button onClick={() => setShowOtherOptions(!showOtherOptions)}>
                  <Typography variant='body2' mr={0.5}>Other options</Typography>
                  {showOtherOptions ? <ExpandLess /> : <ExpandMore />}
                </Button>
              </Box>
              <Grow in={isShowingOtherOptions}>
                <ToggleButtonGroup exclusive value={value} onChange={handleChange} orientation='vertical'>
                  <RadioToggleButton value='start' heading='Start using Papaya from scratch' description='Start using Papaya from scratch' />
                  <RadioToggleButton value='demo' heading='Demo mode' description='Use Papaya in demo mode' />
                </ToggleButtonGroup>
              </Grow>
            </Stack>
          </Stack>
        </Container>
      }
      actionsSlot={
        <>
          {actionButton}
        </>
      }
    />
  )
}
