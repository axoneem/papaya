import { JournalEntryTable } from "@/components/features/journal-editor/JournalEntryTable";
import { journalEntryRepository } from "@/model/orm/repositories";
import { useQuery } from "@tanstack/react-query";


export function JournalViewer() {

  const journalEntriesQuery = useQuery({
    queryKey: ['journal', 'entries'],
    queryFn: async () => {
      return journalEntryRepository.getJournalEntriesByDate();
    },
  });

  return (
    <>
      {/* <pre>
        {JSON.stringify(journalEntriesQuery.data, null, 2)}
      </pre> */}
      <JournalEntryTable journalEntries={journalEntriesQuery.data ?? []} />
    </>
  );
}
