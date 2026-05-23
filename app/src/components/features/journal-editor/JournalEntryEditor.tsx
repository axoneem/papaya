'use client';

import JournalEntryFormSummary from '@/components/features/journal-editor/JournalEntryFormSummary';
import { EditJournalEntryForm } from '@/components/features/journal-entry-form/EditJournalEntryForm';
import DetailsDrawer from '@/components/shared/navigation/DetailsDrawer';
import { JournalEntryEditorContext } from '@/model/contexts/JournalEntryEditorContext';
import { journalEntryRepository } from '@/model/orm/repositories';
import { JournalEntryToFormCodec } from '@/model/schema/codec-schemas';
import { JournalEntryForm } from '@/model/schema/form-schemas';
import { JournalEntry } from '@/model/schema/resource-schemas';
import { OrmDocument } from '@/model/types/orm-types';
import { Button, Stack } from "@mui/material";
import { useContext, useState } from 'react';
import { FormProvider } from "react-hook-form";


export default function JournalEntryEditor() {
  const { form, beginEditing, isEditorOpen, closeEditor } = useContext(JournalEntryEditorContext);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: JournalEntryForm) => {
    if (saving) {
      return;
    }

    setSaving(true);
    try {
      // Encode the form data for persistence
      const journalEntry = JournalEntryToFormCodec.encode(data);

      // Save the journal entry resource
      const response: OrmDocument<JournalEntry> = await journalEntryRepository.Model.save(journalEntry);

      /*
       * Update the editor context with the saved entry (its document ID and
       * revision have changed).
       */
      beginEditing(response);
    } finally {
      setSaving(false);
    }
  }

  return (
    <DetailsDrawer open={isEditorOpen} onClose={closeEditor}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Stack sx={{ flex: 1, gap: 1 }}>
            <Button loading={saving} type="submit" variant="contained">Save</Button>
            <JournalEntryFormSummary />
            <EditJournalEntryForm />
          </Stack>
        </form>
      </FormProvider>
    </DetailsDrawer>
  );
}
