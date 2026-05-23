import { JournalEntry } from "@/model/schema/resource-schemas";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

interface JournalEntryTableProps {
  journalEntries: JournalEntry[];
}

export function JournalEntryTable(props: JournalEntryTableProps) {

  const columnHelper = createColumnHelper<JournalEntry>()

  const tableColumns = [
    // Display Column
    // columnHelper.display({
    //   id: 'actions',
    //   cell: props => <RowActions row={props.row} />,
    // }),

    // Accessor columns

    // Date

    // Memo
    {
      id: 'memo',
      header: 'Memo',
      accessorFn: (row: JournalEntry) => {
        if (row.memo) {
          return row.memo;
        }
        const transactionMemo = Object.values(row.transactions).find((transaction) => !!transaction.memo)?.memo

        return transactionMemo ?? 'Journal entry';
      },
      cell: props => <div>{props.getValue()}</div>,
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
              <th key={header.id}>{header.column.columnDef.header}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}