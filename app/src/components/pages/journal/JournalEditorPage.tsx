import JournalEntryEditor from "@/components/features/journal-editor/JournalEntryEditor";
import { JournalViewer } from "@/components/features/journal-viewer/JournalViewer";


export default function JournalEditorPage() {

  return (
    <div id='journal-editor-page'>
      <JournalViewer />
      <JournalEntryEditor />
    </div>
  )
}
