import { JournalEntry } from "@/model/schema/resource-schemas";
import { formatJournalEntryDate } from "@/utils/date-utils";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";

interface JournalEntryTableProps {
  journalEntries: JournalEntry[];
}

interface DateRowSpanMeta {
  showDateCell: boolean;
  rowSpan?: number;
  label?: string;
}

function getDateRowSpanMeta(entries: JournalEntry[]): DateRowSpanMeta[] {
  return entries.map((entry, index) => {
    if (index > 0 && entry.date === entries[index - 1].date) {
      return { showDateCell: false };
    }

    let rowSpan = 1;
    for (let i = index + 1; i < entries.length && entries[i].date === entry.date; i++) {
      rowSpan++;
    }

    return {
      showDateCell: true,
      rowSpan,
      label: formatJournalEntryDate(entry.date),
    };
  });
}

export function JournalEntryTable(props: JournalEntryTableProps) {
  const dateRowSpans = useMemo(
    () => getDateRowSpanMeta(props.journalEntries),
    [props.journalEntries],
  );

  const tableColumns = [
    {
      id: "date",
      header: "Date",
      accessorFn: (row: JournalEntry) => row.date,
      cell: (props) => <div>{props.getValue()}</div>,
    },
    {
      id: "amount",
      header: "Amount",
      accessorFn: (row: JournalEntry) => {
        return Object.values(row.transactions).reduce((acc, transaction) => acc + transaction.amount, 0) ?? 0;
      },
      cell: (props) => <div>{props.getValue()}</div>,
    },
    {
      id: "memo",
      header: "Memo",
      accessorFn: (row: JournalEntry) => {
        if (row.memo) {
          return row.memo;
        }
        const transactionMemo = Object.values(row.transactions).find((transaction) => !!transaction.memo)?.memo;

        return transactionMemo ?? "Journal entry";
      },
      cell: (props) => <div>{props.getValue()}</div>,
    },
  ];

  const table = useReactTable({
    data: props.journalEntries,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, rowIndex) => {
          const dateMeta = dateRowSpans[rowIndex];
          const dataCells = row.getVisibleCells().filter((cell) => cell.column.id !== "date");

          return (
            <tr key={row.id}>
              {dateMeta.showDateCell && (
                <td rowSpan={dateMeta.rowSpan}>{dateMeta.label}</td>
              )}
              {dataCells.map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
