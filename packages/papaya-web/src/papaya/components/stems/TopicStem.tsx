import { TextField, TextFieldProps } from "@mui/material";

type TopicStemProps = TextFieldProps;

export default function TopicStem(props: TopicStemProps) {
  return (
    <TextField
      label="Topic"
      placeholder="#topic"
      fullWidth
      {...props}
    />
  )
}
