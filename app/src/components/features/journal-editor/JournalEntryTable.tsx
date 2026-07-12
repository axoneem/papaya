import { useGetPriceStyle } from "@/hooks/useGetPriceStyle";
import { JournalEntry, Transaction } from "@/model/schema/resource-schemas";
import { formatJournalEntryDate } from "@/utils/date-utils";
import { getPriceString } from "@/utils/string-utils";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type ColumnDef,
  type ExpandedState,
} from "@tanstack/react-table";
import { Fragment, useMemo, useState } from "react";

interface JournalEntryTableProps {
  journalEntries: JournalEntry[];
}

interface DateRowSpanMeta {
  showDateCell: boolean;
  rowSpan?: number;
  label?: string;
}

const getEntryTotalAmount = (entry: JournalEntry): number =>
  entry.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

const getEntryMemo = (entry: JournalEntry): string => {
  if (entry.memo?.trim()) {
    return entry.memo.trim();
  }

  const transactionMemo = entry.transactions.find((transaction) => transaction.memo?.trim())?.memo?.trim();
  return transactionMemo ?? "Journal entry";
};

const formatAccountSlug = (slug: string | null | undefined): string | undefined => {
  if (!slug) {
    return undefined;
  }

  return slug.replace("papaya:account:", "");
};

const formatTransactionAccounts = (transaction: Transaction): string | undefined => {
  const source = formatAccountSlug(transaction.sourceAccount);
  const destination = formatAccountSlug(transaction.destinationAccount);

  if (source && destination) {
    return `${source} → ${destination}`;
  }

  return source ?? destination;
};

function getDateRowSpanMeta(
  entries: JournalEntry[],
  expandedRowIds: Set<string>,
): DateRowSpanMeta[] {
  return entries.map((entry, index) => {
    if (index > 0 && entry.date === entries[index - 1].date) {
      return { showDateCell: false };
    }

    let rowSpan = 0;
    for (let i = index; i < entries.length && entries[i].date === entry.date; i++) {
      rowSpan += 1;
      if (expandedRowIds.has(entries[i].rid)) {
        rowSpan += entries[i].transactions.length;
      }
    }

    return {
      showDateCell: true,
      rowSpan,
      label: formatJournalEntryDate(entry.date),
    };
  });
}

interface TransactionTableRowProps {
  transaction: Transaction;
}

function TransactionTableRow({ transaction }: TransactionTableRowProps) {
  const getPriceStyle = useGetPriceStyle();
  const accounts = formatTransactionAccounts(transaction);

  return (
    <tr>
      <td>
        <Typography component="span" sx={getPriceStyle(transaction.amount)}>
          {getPriceString(transaction.amount, {
            sign: "whenPositive",
            symbol: "simplified",
          })}
        </Typography>
      </td>
      <td>
        <Box sx={{ pl: 4 }}>
          <Typography variant="body2">{transaction.memo}</Typography>
          {accounts && (
            <Typography variant="caption" color="text.secondary">
              {accounts}
            </Typography>
          )}
        </Box>
      </td>
    </tr>
  );
}

export function JournalEntryTable(props: JournalEntryTableProps) {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const getPriceStyle = useGetPriceStyle();

  const expandedRowIds = useMemo(() => {
    const ids = new Set<string>();

    for (const [rowId, isExpanded] of Object.entries(expanded)) {
      if (isExpanded) {
        ids.add(rowId);
      }
    }

    return ids;
  }, [expanded]);

  const dateRowSpans = useMemo(
    () => getDateRowSpanMeta(props.journalEntries, expandedRowIds),
    [props.journalEntries, expandedRowIds],
  );

  const columns = useMemo<ColumnDef<JournalEntry>[]>(
    () => [
      {
        id: "date",
        header: "Date",
        accessorFn: (row) => row.date,
        cell: ({ getValue }) => <div>{getValue<string>()}</div>,
      },
      {
        id: "amount",
        header: "Amount",
        accessorFn: (row) => getEntryTotalAmount(row),
        cell: ({ row }) => {
          const total = getEntryTotalAmount(row.original);

          return (
            <Typography component="span" sx={getPriceStyle(total)}>
              {getPriceString(total, {
                sign: "whenPositive",
                symbol: "simplified",
              })}
            </Typography>
          );
        },
      },
      {
        id: "memo",
        header: "Memo",
        accessorFn: (row) => getEntryMemo(row),
        cell: ({ row, getValue }) => {
          const canExpand = row.original.transactions.length > 1;

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {canExpand && (
                <IconButton
                  aria-label={row.getIsExpanded() ? "Collapse transactions" : "Expand transactions"}
                  size="small"
                  onClick={row.getToggleExpandedHandler()}
                  sx={{ ml: -1 }}
                >
                  {row.getIsExpanded() ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </IconButton>
              )}
              <span>{getValue<string>()}</span>
            </Box>
          );
        },
      },
    ],
    [getPriceStyle],
  );

  const table = useReactTable({
    data: props.journalEntries,
    columns,
    state: { expanded },
    onExpandedChange: setExpanded,
    getRowId: (row) => row.rid,
    getRowCanExpand: (row) => row.original.transactions.length > 1,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
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
            <Fragment key={row.id}>
              <tr>
                {dateMeta.showDateCell && (
                  <td rowSpan={dateMeta.rowSpan}>{dateMeta.label}</td>
                )}
                {dataCells.map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.getIsExpanded() &&
                row.original.transactions.map((transaction) => (
                  <TransactionTableRow key={transaction.rid} transaction={transaction} />
                ))}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
