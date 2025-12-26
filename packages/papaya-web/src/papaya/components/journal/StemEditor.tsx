import { EntrySchema } from '@/schema/new/document/EntrySchema';
import { PapayaGenericResourceIdentifierSchema } from '@/schema/new/other/PapayaGenericResourceIdentifierSchema';
import { AttachmentStemSchema } from '@/schema/new/stem/AttachmentStemSchema';
import { FlagStemSchema } from '@/schema/new/stem/FlagStemSchema';
import { ForkStemSchema } from '@/schema/new/stem/ForkStemSchema';
import { GratuityStemSchema } from '@/schema/new/stem/GratuityStemSchema';
import { MentionStemSchema } from '@/schema/new/stem/MentionStemSchema';
import { NoteStemSchema } from '@/schema/new/stem/NoteStemSchema';
import { ObligationStemSchema } from '@/schema/new/stem/ObligationStemSchema';
import { RecurrenceStemSchema } from '@/schema/new/stem/RecurrenceStemSchema';
import { RelationStemSchema } from '@/schema/new/stem/RelationStemSchema';
import { TaskListStemSchema } from '@/schema/new/stem/TaskListStemSchema';
import { TopicStemSchema } from '@/schema/new/stem/TopicStemSchema';
import { TransferDestinationStemSchema } from '@/schema/new/stem/TransferDestinationStemSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import EntryEditableCard from './EntryEditableCard';


const EntryFormSchema = EntrySchema.extend({
  entry: EntrySchema,
  stems: z.record(PapayaGenericResourceIdentifierSchema, z.union([
    AttachmentStemSchema,
    FlagStemSchema,
    ForkStemSchema,
    GratuityStemSchema,
    MentionStemSchema,
    NoteStemSchema,
    ObligationStemSchema,
    RecurrenceStemSchema,
    RelationStemSchema,
    TaskListStemSchema,
    TopicStemSchema,
    TransferDestinationStemSchema,
  ])),
});
export type EntryForm = z.infer<typeof EntryFormSchema>;

export default function StemEditor() {
  const form = useForm<EntryForm>({
    resolver: zodResolver(EntryFormSchema),
    defaultValues: {
      entry: {
        _id: 'papaya:entry:1234',
        date: new Date().toISOString(),
        time: new Date().toISOString(),
        journalId: 'papaya:journal:1234',
        sourceAccount: '&rbc-checking',
        memo: '',
        amount: {
          currency: 'CAD',
          '@ephemeral': {
            rawValue: '100',
          },
        },
      },
      stems: {
        'papaya:stem:attachment': {
        },
      },
    }
  })

  const stems = form.watch('stems');
  const entry = form.watch('entry');

  return (
    <Box>
      <FormProvider {...form}>
        <form>
          <EntryEditableCard entryId={entry._id} />
        </form>
      </FormProvider>
    </Box >
  )
}
