import { JournalEntryTable } from "@/components/features/journal-editor/JournalEntryTable";
import { JournalContext } from "@/model/contexts/JournalContext";
import { journalEntryRepository } from "@/model/orm/repositories";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";


export function JournalViewer() {

  const { activeJournal } = useContext(JournalContext);

  const journalEntriesQuery = useQuery({
    queryKey: ['journal', activeJournal?.rid, 'entries'],
    queryFn: async () => {
      console.log('querying journal entries for journal: ', activeJournal?.rid);
      return journalEntryRepository.getJournalEntriesByDate(activeJournal!.rid);
    },
    enabled: !!activeJournal,
  });

  return (
    <JournalEntryTable journalEntries={journalEntriesQuery.data ?? []} />
  );
}
