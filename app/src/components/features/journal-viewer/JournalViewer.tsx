import { JournalEntryTable } from "@/components/features/journal-editor/JournalEntryTable";
import { useDatabaseSeeder } from "@/hooks/useDatabaseSeeder";
import { journalEntryRepository } from "@/model/orm/repositories";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";


export function JournalViewer() {

  const journalEntriesQuery = useQuery({
    queryKey: ['journal', 'entries'],
    queryFn: async () => {
      return journalEntryRepository.getJournalEntriesByDate();
    },
  });

  useEffect(() => {
    if (!journalEntriesQuery.data) {
      return;
    }

    console.log('entries:', journalEntriesQuery.data);
  }, [journalEntriesQuery.data]);

  useDatabaseSeeder();

  return (
    <>
      {/* <pre>
        {JSON.stringify(journalEntriesQuery.data, null, 2)}
      </pre> */}
      <JournalEntryTable journalEntries={journalEntriesQuery.data ?? []} />
    </>
  );
}
