import { JournalEntryForm } from "@/model/schema/form-schemas";
import { TransactionRid } from "@/model/schema/namespace-schemas";
import { useFormContext } from "react-hook-form";

import AmountField from "@/components/shared/inputs/field/AmountField";
import DateField from "@/components/shared/inputs/field/DateField";
import TopicField from "@/components/shared/inputs/field/TopicField";
import { Card, Grid, Stack, TextField } from "@mui/material";
import dayjs from "dayjs";
import { Controller, type FieldPath } from "react-hook-form";

interface EditTransactionFormFields {
  memo: FieldPath<JournalEntryForm>;
  date: FieldPath<JournalEntryForm>;
  amountString: FieldPath<JournalEntryForm>;
  topics: FieldPath<JournalEntryForm>;
}

interface EditTransactionFormProps {
  fields: EditTransactionFormFields;
}

export function EditTransactionForm(props: EditTransactionFormProps) {
  const { fields } = props;
  const { control, register } = useFormContext<JournalEntryForm>()

  return (
    <Stack sx={{
      gap: 2
    }}>
      <Card sx={{ p: 2 }}>
        <Grid container columns={12} spacing={1} rowSpacing={1.5} sx={{ flex: '1' }}>
          <Grid size={8}>
            <TextField
              size="small"
              label="Memo"
              fullWidth
              {...register(fields.memo)}
            />
          </Grid>
          <Grid size={4}>
            <Controller<JournalEntryForm>
              control={control}
              name={fields.date}
              render={({ field }) => (
                <DateField
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                  label="Date"
                  {...field}
                  value={dayjs(field.value as string)}
                  onChange={(value) => {
                    field.onChange(value?.format('YYYY-MM-DD') ?? '')
                  }}

                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Controller
              control={control}
              name={fields.amountString}
              render={({ field }) => (
                <AmountField
                  size="small"
                  approximate={false}
                  {...field}
                  fullWidth
                  sx={{ flex: 1 }}
                  autoComplete="off"
                />
              )}
            />
          </Grid>
          <Grid size={'grow'}>
            <Controller<JournalEntryForm>
              control={control}
              name={fields.topics}
              render={({ field }) => (
                <TopicField
                  knownTopics={[]}
                  size="small"
                  label="Topics"
                  fullWidth
                  value={(field.value as string[] | undefined) ?? []}
                  onChange={(_event, newValue) => field.onChange(newValue)}
                  onBlur={field.onBlur}
                />
              )}
            />
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
}

export function EditJournalEntryForm() {
  const { watch } = useFormContext<JournalEntryForm>()

  const transactions = watch('transactions');
  const modality = Object.keys(transactions).length > 1 ? 'complex' : 'simple';

  if (modality === 'complex') {
    return "Not implemented"
  }

  const transactionRid = Object.keys(transactions)[0] as TransactionRid | undefined;

  if (!transactionRid) {
    return null;
  }

  return (
    <EditTransactionForm fields={{
      memo: `transactions.${transactionRid}.memo`,
      /*
       * When editing a "simple" journal entry, the transaction date is omitted
       * in favor of the journal entry date.
       */
      date: `date`,
      amountString: `transactions.${transactionRid}.amountString`,
      topics: `transactions.${transactionRid}.topics`,
    }} />
  )
}
