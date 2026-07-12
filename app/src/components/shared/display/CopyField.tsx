import { FileCopy } from "@mui/icons-material";
import { IconButton, Stack, Typography, TypographyProps } from "@mui/material";


interface CopyFieldProps extends TypographyProps {
  copyText: string;
  label?: string;
}

export default function CopyField(props: CopyFieldProps) {
  const { sx, copyText, label, ...rest } = props;

  return (
    <Stack
      direction="row"
      sx={{
        gap: 1,
        alignItems: 'center'
      }}>
      <Typography {...rest} sx={{ ...sx, fontFamily: 'monospace' }}>
        {label && (
          <Typography variant="body2" component="span" sx={{
            color: "text.secondary"
          }}>
            {label}:&nbsp;
          </Typography>
        )}
        {copyText}
      </Typography>
      <IconButton size="small" onClick={() => {
        if (typeof window === 'undefined') {
          return
        }
        window?.navigator?.clipboard.writeText(copyText)
      }}>
        <FileCopy />
      </IconButton>
    </Stack>
  );
}