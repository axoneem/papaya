import { NotificationsContext } from "@/contexts/NotificationsContext";
import { ZiskContext } from "@/contexts/ZiskContext";
import { useDebounce } from "@/hooks/useDebounce";
import { ZiskServer } from "@/schema/models/ZiskServer";
import { ServerSyncStrategy } from "@/schema/support/syncing";
import { usernameToDbName } from "@/utils/database";
import { parseServerUrl } from "@/utils/server";
import { LeakAdd } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import ServerWidget from "../widget/ServerWidget";

interface JoinServerModalProps {
  open: boolean
  onClose: () => void
}

const INITIAL_SERVER_URL = ''

export default function JoinServerModal(props: JoinServerModalProps) {
  const [serverUrl, setServerUrl] = useState<string>(INITIAL_SERVER_URL)
  const [parsedServerUrl, setParsedServerUrl] = useState<string | null>(null)
  const [serverCheckLookup, setServerCheckLookup] = useState<Record<string, ZiskServer | null>>({})
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const [loginFailed, setLoginFailed] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const { snackbar } = useContext(NotificationsContext)
  const ziskContext = useContext(ZiskContext)

  const handleCheckLogin = async () => {
    setLoggingIn(true)
    setLoginFailed(false)
    const payload = { username, password }
    const loginEndpoint = `${parsedServerUrl}api/login`
    let loginSuccess = false;

    try {
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        loginSuccess = true
      }
    } catch {
      loginSuccess = false
    } finally {
      setLoggingIn(false)
    }
    if (!loginSuccess) {
      setLoginFailed(true)
      return
    }

    // Login success, update the user's settings to sync w the new server
    const healthCheckUrl = `${parsedServerUrl}api`
    let jsonData: Record<string, unknown> | null = null;

    try {
      const response = await fetch(healthCheckUrl)
      jsonData = await response.json()
    } catch {
      console.error('Failed to healthcheck server during login.')
    }

    if (!jsonData || !parsedServerUrl) {
      return
    }

    const server: ZiskServer = {
      kind: 'zisk:server',
      displayName: jsonData.serverName as string,
      managedBy: null,
      url: parsedServerUrl
    }

    const syncStrategy: ServerSyncStrategy = {
      syncType: 'SERVER',
      server,
      connection: {
        databaseUrl: `${parsedServerUrl}proxy/${usernameToDbName(username)}`,
        username,
      }
    }

    await ziskContext.updateSettings({
      syncStrategy,
    })
    props.onClose()
  }

  const checkParsedServerUrl = async (url: string | null): Promise<boolean> => {
    if (!url) {
      return false
    }
    const healthCheckUrl = `${url}api`

    let healthCheckOk: boolean = false
    let jsonData: Record<string, unknown>

    try {
      const response = await fetch(healthCheckUrl)
      jsonData = await response.json()
      healthCheckOk = Object.entries(jsonData).some(([key, value]) => key === 'zisk' && Boolean(value))
    } catch {
      healthCheckOk = false
    }

    setServerCheckLookup((prev) => {
      const next = { ...prev }
      next[url] = healthCheckOk
        ? {
          kind: 'zisk:server',
          url,
          displayName: jsonData?.serverName as string,
          managedBy: null,
        }
        : null
      return next
    })

    return healthCheckOk
  }

  const [debouncedCheckServer] = useDebounce(async (url: string) => {
    return checkParsedServerUrl(url)
  }, 500)

  useEffect(() => {
    const url = parseServerUrl(serverUrl)
    setParsedServerUrl(url)
    debouncedCheckServer(url)
  }, [serverUrl])

  useEffect(() => {
    setLoginFailed(false)
  }, [username, password, serverUrl])

  const handleChangeServerUrl = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const url = event.target.value
    setServerUrl(url)
    debouncedCheckServer(url)
  }

  const server: ZiskServer | null | undefined = parsedServerUrl ? serverCheckLookup[parsedServerUrl] : undefined

  const healthCheck: 'PENDING' | 'OK' | 'FAIL' = useMemo(() => {
    if (!parsedServerUrl) {
      return 'PENDING'
    }

    if (server === undefined) {
      return 'PENDING'
    }
    return server === null ? 'FAIL' : 'OK'
  }, [serverCheckLookup, parsedServerUrl])

  const disableSignIn = useMemo(() => {
    return !username || !password || healthCheck !== 'OK'
  }, [username, password, healthCheck])

  return (
    <Dialog {...props} fullWidth maxWidth={'sm'}>
      <DialogTitle>Join Server</DialogTitle>
      <DialogContent>
        <Stack mt={2} gap={1}>
          <TextField
            value={serverUrl}
            onChange={handleChangeServerUrl}
            label='Server URL'
            placeholder='your.server.com'
            fullWidth
            disabled={loggingIn}
            required
            color={healthCheck === 'OK' ? 'success' : undefined}
            error={healthCheck === 'FAIL'}
          />
          {healthCheck !== 'PENDING' && (
            <Typography variant='caption' color={healthCheck === 'OK' ? 'success' : undefined}>
              {healthCheck === 'OK' ? 'Server OK!' : 'Failed to connect to server'}
            </Typography>
          )}
          <Collapse in={healthCheck === 'OK'}>
            <Paper variant='outlined' sx={(theme) => ({ mb: 2, background: 'none', borderRadius: theme.shape.borderRadius, alignSelf: 'flex-start' })}>
              <ServerWidget
                serverName={server?.displayName}
                serverUrl={server?.url ?? ''}
                userName={username}
              />
            </Paper>
          </Collapse>
          <TextField
            label='Username'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            error={loginFailed}
            disabled={loggingIn}
            fullWidth
            required
          />
          <TextField
            label='Password'
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={loginFailed}
            disabled={loggingIn}
            fullWidth
            required
          />
          {loginFailed && (
            <FormHelperText error>Failed to authenticate with the server.</FormHelperText>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant='contained'
          startIcon={<LeakAdd />}
          onClick={() => handleCheckLogin()}
          disabled={disableSignIn}
          loading={loggingIn}
        >
          Join Server
        </LoadingButton>
        <Button onClick={() => props.onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
