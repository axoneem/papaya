'use client';

import { JOURNAL_ENTRY_DEFAULT_MEMO } from "@/constants/journal-editor-constants";
import { JournalEntryToFormCodec } from "@/model/schema/codec-schemas";
import { JournalEntryForm } from "@/model/schema/form-schemas";
import { JournalEntry } from "@/model/schema/resource-schemas";
import { getPriceString } from "@/utils/string-utils";
import { Stack, Typography } from "@mui/material";
import { useDeferredValue } from "react";
import { useFormContext } from "react-hook-form";

export default function JournalEntryFormSummary() {
  const { getValues } = useFormContext<JournalEntryForm>();

  const formValues = useDeferredValue<JournalEntryForm>(getValues());

  const optimisticJournalEntry: JournalEntry = useDeferredValue(
    formValues ? JournalEntryToFormCodec.encode(formValues) : null
  );

  const netAmount: number = optimisticJournalEntry.amount;

  const uniqueTopics: Set<string> = new Set(optimisticJournalEntry.topics ?? []);

  const netAmountString = getPriceString(netAmount, {
    sign: 'whenPositive',
    symbol: 'none',
    fullyQualifyZero: false,
  });

  let memo: string | undefined = optimisticJournalEntry.memo?.trim()
  if (!memo) {
    memo = optimisticJournalEntry.memo?.trim();
  }

  return (
    <Stack>
      <Typography>{memo || JOURNAL_ENTRY_DEFAULT_MEMO}</Typography>
      <Stack direction="row" sx={{
        gap: 2
      }}>
        <Typography>{netAmountString}</Typography>
        <Typography>{Array.from(uniqueTopics).join(', ')}</Typography>
      </Stack>
    </Stack>
  );
}
