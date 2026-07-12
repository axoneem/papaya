import z from "zod";


export const DisplayableJournalEntryActionSchema = z.object({
  variant: z.enum(['ACCEPT', 'REJECT', 'NUDGE']),
  label: z.string(),
});

/**
 * Represents a range preset for a calendar view.
 */
export const CalendarResolutionSchema = z.enum({
  WEEK: 'w',
  MONTH: 'm',
  YEAR: 'y',
  CUSTOM: 'c',
});
export type CalendarResolution = z.infer<typeof CalendarResolutionSchema>;

/**
 * Represents a specified or inferred range of dates for a calendar view.
 */
export const CalendarRangeSchema = z.object({
  /**
   * The start date of the range.
   */
  fromDate: z.iso.date(),
  /**
   * The resolution of the range. If not provided, the range is considered custom.
   */
  resolution: CalendarResolutionSchema.optional(),
  /**
   * The end date of the range. If a resolution is provided, this field is ignored.
   */
  toDate: z.iso.date().optional(),
})
export type CalendarRange = z.infer<typeof CalendarRangeSchema>;

export const RefinementSchema = z.literal(null);

export type Refinement = z.infer<typeof RefinementSchema>;

export const SortBySchema = z.enum(['DATE', 'MEMO', 'AMOUNT']).optional().default('DATE');
export type SortBy = z.infer<typeof SortBySchema>;

export const SortOrderSchema = z.enum(['ASC', 'DESC']).optional().default('ASC');
export type SortOrder = z.infer<typeof SortOrderSchema>;

export const GroupBySchema = z.enum(['DATE']).optional().default('DATE');
export type GroupBy = z.infer<typeof GroupBySchema>;

export const JournalSliceSchema = z.object({
  calendar: CalendarRangeSchema,
  refinements: RefinementSchema,
  sortBy: SortBySchema,
  sortOrder: SortOrderSchema,
  groupBy: GroupBySchema,
  // layout: z.enum(['TABLE', 'LIST']).optional().default('TABLE'),
})
export type JournalSlice = z.infer<typeof JournalSliceSchema>;
