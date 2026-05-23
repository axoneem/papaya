import { Alert, NotificationsContext } from '@/model/contexts/NotificationsContext'
import { Close, Warning } from '@mui/icons-material'
import { AlertTitle, Grow, IconButton, Alert as MuiAlert, Stack } from '@mui/material'
import { useContext } from 'react'

const MAX_DISPLAY_ITEMS = 2

interface AlertBannerProps {
    alert: Alert
    onDismiss: (id: string) => void
}

const AlertBannerItem = (props: AlertBannerProps) => {
    const { alert, onDismiss } = props
    const handleDismiss = () => {
        if (alert.confirmationMessage) {
            if (confirm(alert.confirmationMessage)) {
                onDismiss(alert.id)
            }
        } else {
            onDismiss(alert.id)
        }
    }

    return (
        <MuiAlert
            severity={props.alert.severity}
            icon={<Warning />}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleDismiss}
                >
                    <Close fontSize="inherit" />
                </IconButton>
            }
            sx={{
                width: '100%',
                '& .MuiAlert-message': {
                    width: '100%',
                },
            }}
        >
            <AlertTitle>{alert.title}</AlertTitle>
            {alert.description}
        </MuiAlert>
    )
}

export default function AlertBanner() {
    const { activeAlerts, dismissAlert } = useContext(NotificationsContext)

    if (activeAlerts.length === 0) {
        return null
    }

    const displayedAlerts = activeAlerts.slice(0, MAX_DISPLAY_ITEMS)

    return (
        <Stack
            sx={{
                gap: 1,
                width: '100%'
            }}>
            {displayedAlerts.map((alert) => (
                <Grow key={alert.id} in={true}>
                    <div>
                        <AlertBannerItem
                            alert={alert}
                            onDismiss={dismissAlert}
                        />
                    </div>
                </Grow>
            ))}
        </Stack>
    );
}
