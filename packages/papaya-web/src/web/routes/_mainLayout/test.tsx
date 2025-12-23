import { Add, EventRepeat, ForkRight, Inbox, Loyalty, Notes } from '@mui/icons-material';
import { Box, Button, Card, Chip, IconButton, Stack, TextField, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { ReactNode } from 'react';

interface PapayaCardProps {
  variantTitle: string;
  actions: ReactNode;
  descendants?: ReactNode;
  children: ReactNode;
}

const PapyaCard = (props: PapayaCardProps) => {
  return (
    <Stack>
      <Typography variant='overline' color='secondary' ml={1} sx={{ fontFamily: 'monospace', textTransform: 'capitalize' }}>/ {props.variantTitle}</Typography>
      <Box position={'relative'}>
        <Card sx={{ p: 2 }}>
          <Stack gap={2}>
            {props.children}
            <Stack direction={'row'} gap={1}>
              {props.actions}
            </Stack>
          </Stack>
        </Card>
      </Box>
      {props.descendants && (
        <Stack gap={2} ml={4} mt={2}>
          {props.descendants}
        </Stack>
      )}
    </Stack>
  )
}

const BaseActions = () => {
  return (
    <>
      <Button
        variant='outlined'
        size='small'
        color='secondary'
        startIcon={<Notes />}
      >
        Note
      </Button>
      <Button
        variant='outlined'
        size='small'
        color='secondary'
        startIcon={<Loyalty />}
      >
        IOU
      </Button>
      <Button
        variant='outlined'
        size='small'
        color='secondary'
        startIcon={<Inbox />}
      >
        Topic
      </Button>
      <Button
        variant='outlined'
        size='small'
        color='secondary'
        startIcon={<EventRepeat />}
      >
        Recurs
      </Button>
      <Button
        variant='outlined'
        size='small'
        color='secondary'
        startIcon={<ForkRight />}
      >
        Fork
      </Button>
      <IconButton
        size='small'
        color='secondary'
      >
        <Add />
      </IconButton>
    </>
  )
}

const TestPage = () => {
  return (
    <Stack flex={1} justifyContent={'center'} alignItems={'center'}>
      <Box sx={{}}>
        {/* <Card>
          Hello
        </Card> */}

        <PapyaCard
          variantTitle='Entry'
          actions={<BaseActions />}
          descendants={<>

            <PapyaCard
              variantTitle='Fork'
              actions={<BaseActions />}
            >
              1/2 + 1/2
            </PapyaCard>
            <PapyaCard
              variantTitle='Gratuity'
              actions={<></>}
            >
              <Chip size='small' sx={{ width: 'min-content' }} label={
                <Typography variant='caption' sx={{ textTransform: 'lowercase' }}>
                  <Typography component='span' color='secondary'>#</Typography>gratuity
                </Typography>
              } />
              <TextField
                size='small'
                fullWidth
                sx={{ flex: 1 }}
                label='Amount'
              />
            </PapyaCard>
          </>}
        >
          <Stack direction={'row'} gap={1}>
            <TextField
              size='small'
              fullWidth
              sx={{ flex: 1 }}
              label='Amount'
            />

            <TextField
              size='small'
              fullWidth
              sx={{ flex: 2 }}
              label='Memo'
            />
          </Stack>
        </PapyaCard>
      </Box>
    </Stack>
  )
}

export const Route = createFileRoute('/_mainLayout/test')({
  component: TestPage,
})
