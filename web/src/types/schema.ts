import { z } from 'zod'

export const IdentifierMetadata = z.object({
	_id: z.string(),
})

export const BelongsToJournal = z.object({
    journalId: z.string(),
})

export const DocumentMetadata = IdentifierMetadata.merge(
	z.object({
		_rev: z.string().optional(),
		_deleted: z.boolean().optional(),
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

export const CreateJournalEntryChild = AmountRecord.merge(z.object({
	memo: z.string(),
	tagIds: z.array(z.string()).optional(),
	categoryIds: z.array(z.string()).optional(),
}))

export type CreateJournalEntryChild = z.output<typeof CreateJournalEntryChild>

export const AttachmentContent = z.any()

// export const AttachmentContent = z.object({
//     content_type: z.string(),
//     data: z.any(),
//     // TODO need to reconcile this
//     // length: z.number(),
//     // digest: z.string(),
//     // revpos: z.number(),
//     // stub: z.boolean(),
// });

export type AttachmentContent = z.output<typeof AttachmentContent>

export const CreateEntryArtifact = IdentifierMetadata.merge(
	z.object({
		filename: z.string(),
		filesize: z.number(),
		description: z.string(),
		_attachments: z.record(z.string(), AttachmentContent),
	})
)

export type CreateEntryArtifact = z.output<typeof CreateEntryArtifact>

export const EntryArtifact = DocumentMetadata.merge(BelongsToJournal).merge(CreateEntryArtifact).merge(
	z.object({
		type: z.literal('ENTRY_ARTIFACT'),
		parentEntryId: z.string(),
		createdAt: z.string(),
		updatedAt: z.string().nullable(),
	})
)

export type EntryArtifact = z.output<typeof EntryArtifact>

export const CreateJournalEntry = CreateJournalEntryChild.merge(
	z.object({
		date: z.string().optional(),
		notes: z.string().optional(),
		artifactIds: z.array(z.string()).optional(),
		paymentMethodId: z.string().nullable().optional(),
		relatedEntryIds: z.array(z.string()).optional(),
	})
)

export type CreateJournalEntry = z.output<typeof CreateJournalEntry>

export const JournalEntry = DocumentMetadata.merge(BelongsToJournal).merge(CreateJournalEntry).merge(
	z.object({
		type: z.literal('JOURNAL_ENTRY'),
		parentEntryId: z.string().nullable().optional(),
		childEntryIds: z.array(z.string()).optional(),
		createdAt: z.string(),
		updatedAt: z.string().nullable().optional(),
	})
)

export type JournalEntry = z.output<typeof JournalEntry>

export const EnhancedJournalEntry = JournalEntry.merge(
	z.object({
		children: z.array(JournalEntry),
		artifacts: z.array(EntryArtifact),
		allCategoryIds: z.array(z.string()),
		netAmount: z.number(),
	})
)

export type EnhancedJournalEntry = z.output<typeof EnhancedJournalEntry>

export const CreateQuickJournalEntry = AmountRecord.merge(z.object({
	memo: z.string(),
	categoryIds: z.array(z.string()),
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
