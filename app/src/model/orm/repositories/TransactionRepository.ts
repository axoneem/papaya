import { Transaction } from "@/model/schema/resource-schemas";
import { Repository, ResourceIntrinsic } from "../Repository";

export class TransactionRepository extends Repository<"Transaction"> {
  constructor() {
    super("Transaction");
  }

  factory = (data: Partial<Transaction> = {}): ResourceIntrinsic<"Transaction"> => {
    return {
      amount: data.amount ?? 0,
      memo: data.memo ?? "",
      postedAt: data.postedAt,
      sourceAccount: data.sourceAccount,
      destinationAccount: data.destinationAccount,
      convertedFrom: data.convertedFrom,
    };
  };
}

export const transactionRepository = new TransactionRepository();
