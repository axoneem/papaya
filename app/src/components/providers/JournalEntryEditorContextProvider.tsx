'use client';

import { JournalContext } from '@/model/contexts/JournalContext';
import { JournalEntryEditorContext } from '@/model/contexts/JournalEntryEditorContext';
import { journalEntryRepository } from '@/model/orm/repositories';
import { JournalEntryToFormCodec } from '@/model/schema/codec-schemas';
import { JournalEntryForm, JournalEntryFormSchema } from '@/model/schema/form-schemas';
import { JournalEntry } from '@/model/schema/resource-schemas';
import { OrmDocument } from '@/model/types/orm-types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useContext,
  useState,
  type PropsWithChildren
} from 'react';
import { useForm } from 'react-hook-form';

export function JournalEntryEditorContextProvider(props: PropsWithChildren) {
  const { activeJournal } = useContext(JournalContext);

  const [editingEntry, setEditingEntry] = useState<JournalEntry>(() => {
    const newEntry = journalEntryRepository.Model.make({
      journalRid: activeJournal.rid,
    });
    return newEntry;
  });

  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(true);
  const [initialFormValues, setInitialFormValues] = useState<JournalEntryForm>(() => {
    return JournalEntryToFormCodec.decode(editingEntry);
  });

  const form = useForm<JournalEntryForm>({
    resolver: zodResolver(JournalEntryFormSchema.loose()),
    defaultValues: initialFormValues,
  });

  const beginEditing = (entry: JournalEntry | OrmDocument<JournalEntry>, openEditor: boolean = true) => {
    console.log('begin editing: ', entry);
    setEditingEntry(entry);
    if (openEditor) {
      setIsEditorOpen(true);
    }
    const formValues: JournalEntryForm = JournalEntryToFormCodec.parse(entry);
    console.log('decoded form values: ', formValues);
    setInitialFormValues(formValues);
    form.reset(formValues);

    console.log('form values reset to:', form.getValues());
  }

  const beginCreating = () => {
    const newEntry = journalEntryRepository.Model.make({
      journalRid: activeJournal.rid,
    });
    beginEditing(newEntry);
  }

  const openEditor = () => {
    setIsEditorOpen(true);
  }

  const closeEditor = () => {
    setIsEditorOpen(false);
  }

  const value: JournalEntryEditorContext = {
    editingEntry,
    isEditorOpen,
    beginEditing,
    beginCreating,
    openEditor,
    closeEditor,
    form,
  };

  return (
    <JournalEntryEditorContext.Provider value={value}>
      {props.children}
    </JournalEntryEditorContext.Provider>
  );
}
