import { journalEntryRepository, transactionRepository } from "@/model/orm/repositories";
import type { AccountSlug, StampSlug, TopicSlug } from "@/model/schema/etc-schemas";
import { JournalEntry, JournalEntrySchema } from "@/model/schema/resource-schemas";
import { OrmDocument } from "@/model/types/orm-types";
import dayjs from "dayjs";

const DEFAULT_COUNT = 250;

const TOPICS: TopicSlug[] = [
  "papaya:topic:food",
  "papaya:topic:groceries",
  "papaya:topic:transport",
  "papaya:topic:housing",
  "papaya:topic:utilities",
  "papaya:topic:entertainment",
  "papaya:topic:health",
  "papaya:topic:shopping",
  "papaya:topic:travel",
  "papaya:topic:subscriptions",
  "papaya:topic:income",
  "papaya:topic:gifts",
  "papaya:topic:education",
  "papaya:topic:personal-care",
  "papaya:topic:pets",
];

const ACCOUNTS: AccountSlug[] = [
  "papaya:account:checking",
  "papaya:account:savings",
  "papaya:account:credit-card",
  "papaya:account:cash",
  "papaya:account:venmo",
];

const STAMPS: StampSlug[] = [
  "papaya:stamp:starred",
  "papaya:stamp:important",
  "papaya:stamp:flagged",
  "papaya:stamp:needsreview",
  "papaya:stamp:reviewed",
  "papaya:stamp:pinned",
];

const EXPENSE_MEMOS = [
  "Coffee at Blue Bottle",
  "Lunch with Alex",
  "Trader Joe's grocery run",
  "Uber to downtown",
  "Monthly rent payment",
  "Electric bill",
  "Spotify subscription",
  "Movie tickets",
  "Pharmacy — allergy meds",
  "New running shoes",
  "Flight to Portland",
  "Dog food and treats",
  "Haircut",
  "Birthday gift for Sam",
  "Online course renewal",
  "Farmers market haul",
  "Gas station fill-up",
  "Dentist copay",
  "Houseplant from nursery",
  "Thai takeout",
  "Parking garage",
  "Gym membership",
  "Bookstore splurge",
  "Car wash",
  "Wine for dinner party",
];

const INCOME_MEMOS = [
  "Paycheck — biweekly",
  "Freelance invoice #1042",
  "Reimbursement from work",
  "Interest payment — savings",
  "Sold old camera",
  "Tax refund",
  "Birthday cash from mom",
  "Side project payout",
];

const TRANSFER_MEMOS = [
  "Transfer to savings",
  "Credit card payment",
  "Move cash to checking",
  "Pay down credit card",
  "Sweep to emergency fund",
];

const SPLIT_MEAL_MEMOS = [
  "Dinner at Osteria — paid for the table",
  "Brunch at Sunny Side — covered the group",
  "Pizza night — spotted the bill",
  "Sushi with friends — paid upfront",
  "Taco Tuesday — covered everyone",
  "Happy hour — picked up the tab",
  "Birthday dinner — hosted the meal",
];

const FRIEND_NAMES = [
  "Alex",
  "Jordan",
  "Sam",
  "Riley",
  "Casey",
  "Morgan",
  "Taylor",
  "Jamie",
];

const SPLIT_MEAL_NOTES = [
  "Friends reimbursed in cash over the next few days.",
  "Still waiting on one person to pay back their share.",
  "Everyone settled up in cash by the end of the week.",
];

const NOTES = [
  "Split three ways with roommates.",
  "Used corporate card — need receipt.",
  "Annual renewal; price went up $2.",
  "Reimbursable per expense policy.",
  "Part of the Europe trip budget.",
  null,
  null,
  null,
];

const pick = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const pickSome = <T>(items: readonly T[], max = 3): T[] => {
  const count = Math.floor(Math.random() * (max + 1));
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const randomAmount = (min: number, max: number): number => {
  const value = min + Math.random() * (max - min);
  return Math.round(value * 100) / 100;
};

const maybePostedAt = (date: string): string | undefined => {
  if (Math.random() >= 0.4) {
    return undefined;
  }

  return dayjs(date)
    .hour(Math.floor(Math.random() * 24))
    .minute(Math.floor(Math.random() * 60))
    .toISOString();
};

const makeSplitMealTransactions = (date: string) => {
  const billTotal = randomAmount(60, 220);
  const reimbursingFriends = 2 + Math.floor(Math.random() * 3);
  const yourShare = randomAmount(12, billTotal * 0.35);
  let remainingReimbursement = Math.round((billTotal - yourShare) * 100) / 100;
  const mealMemo = pick(SPLIT_MEAL_MEMOS);

  const transactions = [
    transactionRepository.Model.make({
      amount: -billTotal,
      memo: mealMemo,
      sourceAccount: pick(["papaya:account:credit-card", "papaya:account:checking"] as const),
      postedAt: maybePostedAt(date),
    }),
  ];

  const shuffledFriends = [...FRIEND_NAMES].sort(() => Math.random() - 0.5);

  for (let i = 0; i < reimbursingFriends; i++) {
    const isLast = i === reimbursingFriends - 1;
    const amount = isLast
      ? remainingReimbursement
      : randomAmount(remainingReimbursement * 0.15, remainingReimbursement * 0.55);

    remainingReimbursement = Math.round((remainingReimbursement - amount) * 100) / 100;

    transactions.push(
      transactionRepository.Model.make({
        amount,
        memo: `${shuffledFriends[i]} — dinner share`,
        destinationAccount: "papaya:account:cash",
        postedAt: maybePostedAt(date),
      }),
    );
  }

  return { transactions, memo: mealMemo };
};

export class JournalEntrySeeder {
  async seed(count: number = DEFAULT_COUNT): Promise<OrmDocument<JournalEntry>[]> {
    const saved: OrmDocument<JournalEntry>[] = [];

    for (let i = 0; i < count; i++) {
      const partial = this.makeSampleData(i);
      const entry = journalEntryRepository.Model.make(partial);
      const parsed = JournalEntrySchema.parse(entry);
      const doc = await journalEntryRepository.Model.save(parsed);
      saved.push(doc);
    }

    console.info(`Seeded ${saved.length} journal entries`);
    return saved;
  }

  private makeSampleData(index: number): Partial<JournalEntry> {
    const daysAgo = Math.floor(Math.random() * 730);
    const date = dayjs().subtract(daysAgo, "day").format("YYYY-MM-DD");
    const isIncome = Math.random() < 0.12;
    const isTransfer = !isIncome && Math.random() < 0.08;
    const isSplitMeal = !isIncome && !isTransfer && Math.random() < 0.12;

    if (isSplitMeal) {
      const { transactions, memo } = makeSplitMealTransactions(date);

      const data: Partial<JournalEntry> = {
        date,
        memo: `${memo} (#${index + 1})`,
        topics: ["papaya:topic:food", ...pickSome(TOPICS.filter((topic) => topic !== "papaya:topic:food"), 1)],
        transactions,
        notes: pick(SPLIT_MEAL_NOTES),
      };

      if (Math.random() < 0.55) {
        const hour = Math.floor(Math.random() * 24);
        const minute = Math.floor(Math.random() * 60);
        const second = Math.floor(Math.random() * 60);
        data.time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
      }

      if (Math.random() < 0.25) {
        data.stamps = pickSome(STAMPS, 2);
      }

      return data;
    }

    const amount = isIncome
      ? randomAmount(800, 4500)
      : isTransfer
        ? randomAmount(50, 2000)
        : -randomAmount(3, 650);

    const memo = isIncome
      ? pick(INCOME_MEMOS)
      : isTransfer
        ? pick(TRANSFER_MEMOS)
        : pick(EXPENSE_MEMOS);

    const transaction = transactionRepository.Model.make({
      amount,
      memo,
    });

    if (isTransfer) {
      const accounts = pickSome(ACCOUNTS, 2);
      transaction.sourceAccount = accounts[0] ?? pick(ACCOUNTS);
      transaction.destinationAccount =
        accounts[1] ?? pick(ACCOUNTS.filter((a) => a !== transaction.sourceAccount));
    } else if (Math.random() < 0.6) {
      transaction.sourceAccount = pick(ACCOUNTS);
    }

    if (Math.random() < 0.4) {
      transaction.postedAt = maybePostedAt(date);
    }

    const data: Partial<JournalEntry> = {
      date,
      memo: `${memo} (#${index + 1})`,
      topics: pickSome(TOPICS, 2),
      transactions: [transaction],
    };

    if (Math.random() < 0.55) {
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);
      data.time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
    }

    if (Math.random() < 0.35) {
      data.notes = pick(NOTES) ?? undefined;
    }

    if (Math.random() < 0.25) {
      data.stamps = pickSome(STAMPS, 2);
    }

    return data;
  }
}
