import { EntryIdentifier } from "@/schema/new/document/EntrySchema";
import { Category } from "@mui/icons-material";
import { Stack, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import PapyaCard from "../stems/PapayaCard";
import { EntryForm } from "./StemEditor";

interface EntryEditableCardProps {
  entryId: EntryIdentifier
}

const ENTRY_STEMS = [
  {
    label: 'Topic',
    icon: <Category />,
  }
]

export default function EntryEditableCard(props: EntryEditableCardProps) {

  const form = useFormContext<EntryForm>();

  const hasTopicStem = true; // TODO

  return (
    <PapyaCard
      variantTitle='Entry'
    // actions={<BaseActions />}
    >
      <Stack direction={'row'} gap={1}>
        <TextField
          {...form.register('entry.amount.@ephemeral.rawValue')}
          size='small'
          fullWidth
          sx={{ flex: 1 }}
          label='Amount'
        />

        <TextField
          {...form.register('entry.memo')}
          size='small'
          fullWidth
          sx={{ flex: 2 }}
          label='Memo'
        />

      </Stack>
      {hasTopicStem && (
        <TextField
          {...form.register('TODO')}
          size='small'
          placeholder="#groceries"
          fullWidth
          sx={{ flex: 1 }}
          label='Topic'
        />
      )}
      {/* {renderEntryStems(stems, entry, form)} */}
    </PapyaCard>
  );
}
