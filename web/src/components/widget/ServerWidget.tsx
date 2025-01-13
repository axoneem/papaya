import { PLACEHOLDER_UNNAMED_ZISK_SERVER } from "@/constants/server";
import { prettyPrintServerUrl } from "@/utils/server";
import { Grow, Box, Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { ReactNode } from "react";

export interface ServerData {
    serverName?: string
    status?: string
    version?: string
}

interface ServerWidgetProps extends ServerData {
    serverUrl: string
    serverNickname?: string
    userName?: string
    actions?: ReactNode
}

export default function ServerWidget(props: ServerWidgetProps) {
    const printedServerName: string = props.serverNickname || (props.serverName || PLACEHOLDER_UNNAMED_ZISK_SERVER)

    return (
        <Box sx={{ py: 2, px: 2.5 }}>
            <Stack direction='row' gap={1} sx={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                <Typography variant='h5' sx={{ lineHeight: 1 }}>
                    {printedServerName}
                </Typography>
                <Grow in={Boolean(props.userName)}>
                    <Typography sx={{ lineHeight: 1, m: 0 }}>
                        <Typography variant="inherit" component='span' color='textDisabled' mr={0.25}>@</Typography>
                        {props.userName}
                    </Typography>
                </Grow>
            </Stack>
            <Typography>{prettyPrintServerUrl(props.serverUrl)}</Typography>
            
            {(props.version || props.status) && (
                <Table size='small' sx={{ width: 150, mt: 1 }}>
                    <TableBody sx={{ '& pre': { m: 0 }, '& td': { border: 0 }}}>
                        {props.version && (
                            <TableRow sx={{ height: 24 }}>
                                <TableCell align="left" padding={'none'}>Version</TableCell>
                                <TableCell align="right" padding={'none'}><pre>{props.version}</pre></TableCell>
                            </TableRow>
                        )}
                        {props.status && (
                            <TableRow sx={{ height: 24 }}>
                                <TableCell align="left" padding={'none'}>Status</TableCell>
                                <TableCell align="right" padding={'none'}><pre>{props.status}</pre></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
            {props.actions && (
                <Stack direction='row' gap={1} mt={1} mx={-1}>
                    {props.actions}
                </Stack>
            )}
        </Box>
    )
}