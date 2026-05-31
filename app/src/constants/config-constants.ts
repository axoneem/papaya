import { CurrencyIso4217 } from "@/model/schema/etc-schemas";

// TODO should pull this from .env
export const DEFAULT_CURRENCY = 'CAD' as const satisfies CurrencyIso4217;
export const DEFAULT_JOURNAL_NAME = 'Papaya Journal' as const;
