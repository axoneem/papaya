import { Box, Card, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

interface PapayaCardProps {
  variantTitle: string;
  actions?: ReactNode;
  descendants?: ReactNode;
  children?: ReactNode;
}

export default function PapyaCard(props: PapayaCardProps) {
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
