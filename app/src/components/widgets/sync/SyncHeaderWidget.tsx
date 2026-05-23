import SyncIcon from '@/components/display/SyncIcon'
import SyncWidget from '@/components/widget/SyncWidget'
import { RemoteContext } from '@/model/contexts/RemoteContext'
import { SyncIndicatorEnum } from '@/utils/syncing'
import { Grow, IconButton, Popover, Stack, SvgIconOwnProps, Tooltip, Typography } from '@mui/material'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'

type IconColor = SvgIconOwnProps['color']

export default function SyncHeaderWidget() {
  const [verbose, setVerbose] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const buttonAnchorRef = useRef<HTMLDivElement>(null)

  const remoteContext = useContext(RemoteContext)
  // const { syncIndication, } = remoteContext
  const syncIndication = {
    indicator: SyncIndicatorEnum.WORKING_LOCALLY_NO_SYNC as SyncIndicatorEnum,
    title: '',
    description: '',
  }
  const isIdle = syncIndication.indicator === SyncIndicatorEnum.WORKING_LOCALLY_NO_SYNC

  const syncIconVerboseColor: IconColor = useMemo(() => {
    switch (syncIndication.indicator) {
      case SyncIndicatorEnum.DONE_SUCCESS:
        return 'success'
      case SyncIndicatorEnum.LOST_CONNECTION:
      case SyncIndicatorEnum.ERROR_ACTION_REQUIRED:
        return 'warning'
      case SyncIndicatorEnum.SYNC_ERROR:
        return 'error'
      default:
        return undefined
    }
  }, [syncIndication.indicator])

  useEffect(() => {
    // Whenever sync status changes, set verbose to true, then 3s later set it to false
    setVerbose(true)
    const timeout = setTimeout(() => {
      setVerbose(false)
    }, 3_000)
    return () => {
      clearTimeout(timeout)
    }
  }, [syncIndication.indicator, modalOpen])

  const handleOpen = () => {
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
  }

  const showButton = true
  const showCaption = verbose || modalOpen
  const displayVerbose = verbose || modalOpen

  return (
    <>
      <Popover
        anchorEl={buttonAnchorRef.current}
        open={modalOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <SyncWidget />
      </Popover>
      <Stack
        direction="row"
        ref={buttonAnchorRef}
        sx={{
          gap: 0,
          alignItems: 'center'
        }}>
        <Grow in={showButton}>
          <Tooltip title={syncIndication.title}>
            <IconButton
              onClick={handleOpen}
              sx={(theme) => ({
                color: theme.palette.text.secondary,
              })}>
              <SyncIcon
                indicator={syncIndication.indicator}
                fontSize="small"
                color={displayVerbose ? syncIconVerboseColor : 'inherit'}
                sx={{ transition: 'all 0.3s' }}
              />
            </IconButton>
          </Tooltip>
        </Grow>
        {showCaption && (
          <Grow in>
            <Typography
              component="a"
              onClick={handleOpen}
              variant="caption"
              sx={{ mr: 1, userSelect: 'none', cursor: 'pointer' }}
            >
              {syncIndication.title}
            </Typography>
          </Grow>
        )}
      </Stack>
    </>
  );
}
