import JournalEntryEditor from "@/components/features/journal-editor/JournalEntryEditor";
import { JournalViewer } from "@/components/features/journal-viewer/JournalViewer";


export default function JournalEditorPage() {

  // useEffect(() => {
  //   getDatabaseClient().then((db) => {
  //     db.query('papaya/journal_entries_by_rid', { include_docs: true }).then((result) => {
  //       console.log(result);
  //     })
  //   })

  // }, []);


  return (
    <main>
      <JournalViewer />
      <JournalEntryEditor />
    </main>
  )
}
