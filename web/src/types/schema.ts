import { z } from 'zod'

export const IdentifierMetadata = z.object({
	_id: z.string(),
})

export const BelongsToJournal = z.object({
    journalId: z.string(),
})

export const AttachmentMeta = z.object({
	content_type: z.string(),
	data: z.string(),
})

export type AttachmentMeta = z.output<typeof AttachmentMeta>

export const DocumentMetadata = IdentifierMetadata.merge(
	z.object({
		_rev: z.string().optional(),
		_deleted: z.boolean().optional(),
		_attachments: z.record(z.string(), AttachmentMeta).optional(),
		type: z.string(),
	})
)

export const AvatarVariant = z.enum(['TEXT', 'PICTORIAL', 'IMAGE'])

export const Avatar = z.object({
	content: z.string(),
	variant: AvatarVariant,
	primaryColor: z.string(),
	secondaryColor: z.string().optional().nullable(),
})

export type Avatar = z.output<typeof Avatar>

export const CreateCategory = z.object({
	label: z.string(),
	description: z.string(),
	avatar: Avatar,
})

export type CreateCategory = z.output<typeof CreateCategory>

export const Category = DocumentMetadata.merge(BelongsToJournal).merge(CreateCategory).merge(
	z.object({
		type: z.literal('CATEGORY'),
		createdAt: z.string(),
		updatedAt: z.string().nullable(),
	})
)

export type Category = z.output<typeof Category>

const amountValidationPattern = /[-+]?\d{1,3}(,\d{3})*(\.\d+)?/;

const AmountRecord = z.object({
	amount: z.string()
		.regex(amountValidationPattern, 'A valid amount is required')
})

export type AmountRecord = z.output<typeof AmountRecord>

export const EntryArtifact = DocumentMetadata.merge(BelongsToJournal).merge(
	z.object({
		type: z.literal('ENTRY_ARTIFACT'),
		// attachmentId: z.string(), // The ID of the _attachment record attached to the journal object
		originalFileName: z.string(),
		contentType: z.string(),
		description: z.string().optional(),
		createdAt: z.string(),
		updatedAt: z.string().nullable().optional(),
	})
)

export type EntryArtifact = z.output<typeof EntryArtifact>

export const BaseJournalEntry = DocumentMetadata.merge(BelongsToJournal).merge(AmountRecord).merge(
	z.object({
		type: z.literal('JOURNAL_ENTRY'),
		memo: z.string(),
		tagIds: z.array(z.string()).optional(),
		categoryIds: z.array(z.string()).optional(),
		date: z.string().optional(),
		notes: z.string().optional(),
		artifacts: z.array(EntryArtifact).optional(),
		paymentMethodId: z.string().nullable().optional(),
		relatedEntryIds: z.array(z.string()).optional(),
		createdAt: z.string(),
		updatedAt: z.string().nullable().optional(),
	})
)

export const JournalEntry = BaseJournalEntry.merge(
	z.object({
		children: z.array(BaseJournalEntry).optional(),
	})
)

export type JournalEntry = z.output<typeof JournalEntry>

export const CreateQuickJournalEntry = AmountRecord.merge(z.object({
	memo: z.string().optional(),
	categoryIds: z.array(z.string()).optional(),
}))

export type CreateQuickJournalEntry = z.output<typeof CreateQuickJournalEntry>

export const CreateEntryTag = z.object({
	label: z.string(),
	description: z.string(),
})

export type CreateEntryTag = z.output<typeof CreateEntryTag>

export const EntryTag = DocumentMetadata.merge(BelongsToJournal).merge(CreateEntryTag).merge(
	z.object({
		type: z.literal('ENTRY_TAG'),
		createdAt: z.string(),
		updatedAt: z.string().nullable(),
	})
)

export type EntryTag = z.output<typeof EntryTag>

export const ZiskDocument = z.union([Category, JournalEntry, EntryTag])

export type ZiskDocument = z.output<typeof ZiskDocument>

export const ZiskMeta = IdentifierMetadata.merge(
	z.object({
		activeJournalId: z.string().nullable(),
	})
)

export type ZiskMeta = z.output<typeof ZiskMeta>

export const CreateJournalMeta = z.object({
	journalName: z.string().min(1, 'Journal name must be at least 1 character'),
	avatar: Avatar,
})

export type CreateJournalMeta = z.output<typeof CreateJournalMeta>

export const JournalMeta = IdentifierMetadata.merge(CreateJournalMeta).merge(
	z.object({
		type: z.literal('JOURNAL'),
		journalVersion: z.number(),
		createdAt: z.string(),
		updatedAt: z.string().nullable(),
	})
)

export type JournalMeta = z.output<typeof JournalMeta>

export const ReservedTagKey = z.enum([
	'FLAGGED',
	'NEEDS_REVIEW',
	'WAS_REVIEWED',
])

export type ReservedTagKey = z.output<typeof ReservedTagKey>

export const ReservedTag = z.object({
	type: z.literal('RESERVED_TAG'),
	value: ReservedTagKey,
	label: z.string(),
	archived: z.boolean().optional(),
})

export type ReservedTag = z.output<typeof ReservedTag>
