'use client';

import { JournalEntryEditorContextProvider } from "@/components/providers/JournalEntryEditorContextProvider";
import { PropsWithChildren } from "react";

export default function JournalRouteGroupLayout(props: PropsWithChildren) {
  return (
    <JournalEntryEditorContextProvider>
      {props.children}
    </JournalEntryEditorContextProvider>
  )
}
