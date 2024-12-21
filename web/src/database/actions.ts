import {
	AttachmentMeta,
	Category,
	CreateCategory,
	CreateJournalMeta,
	EntryArtifact,
	JournalEntry,
	JournalMeta,
} from '@/types/schema'
import { getDatabaseClient } from './client'
import { generateCategoryId, generateJournalId } from '@/utils/id'
import { getOrCreateZiskMeta } from './queries'
import { makeEntryArtifact } from '@/utils/journal'
import { getImageBase64 } from '@/utils/file'

const db = getDatabaseClient()

export const createJournalEntry = async (formData: JournalEntry): Promise<JournalEntry> => {
	const now = new Date().toISOString()

	const newJournalEntry: JournalEntry = {
		...formData,
		type: 'JOURNAL_ENTRY',
		createdAt: now,
	}

	await db.put(newJournalEntry)
	return newJournalEntry
}

export const updateJournalEntry = async (formData: JournalEntry) => {
	delete formData._rev

	const existingRecord = await db.get(formData._id)
	const now = new Date().toISOString()

	const docs: object[] = [
		{
			...existingRecord,
			...formData,
			updatedAt: now,
		},
	]

	return db.bulkDocs(docs)
}

export const updateJournalEntryChildren = async (children: JournalEntry[]) => {
	const now = new Date().toISOString()

	const updatedChildren = children.map((child) => {
		delete child._rev
		return {
			...child,
			updatedAt: now,
		}
	})

	return db.bulkDocs(updatedChildren)
}

export const deleteJournalEntry = async (journalEntryId: string): Promise<JournalEntry> => {
	const record = await db.get(journalEntryId)
	await db.remove(record)
	return record as JournalEntry
}

export const undeleteJournalEntry = async (journalEntry: JournalEntry) => {
	await db.put(journalEntry)
}

export const createCategory = async (formData: CreateCategory, journalId: string) => {
	const category: Category = {
		...formData,
		type: 'CATEGORY',
		_id: generateCategoryId(),
		createdAt: new Date().toISOString(),
		updatedAt: null,
		journalId,
	}

	return db.put(category)
}

export const updateCategory = async (formData: Category) => {
	return db.put({
		...formData,
		updatedAt: new Date().toISOString(),
	})
}

export const deleteCategory = async (categoryId: string): Promise<Category> => {
	const record = await db.get(categoryId)
	await db.remove(record)
	return record as Category
}

export const undeleteCategory = async (category: Category) => {
	await db.put(category)
}

export const createJournal = async (journal: CreateJournalMeta): Promise<JournalMeta> => {
	const newJournal: JournalMeta = {
		...journal,
		type: 'JOURNAL',
		journalVersion: 1,
		_id: generateJournalId(),
		createdAt: new Date().toISOString(),
		updatedAt: null,
	}

	await db.put(newJournal)

	return newJournal
}

export const updateActiveJournal = async (journalId: string) => {
	const meta = await getOrCreateZiskMeta()
	await db.put({
		...meta,
		activeJournalId: journalId,
	})
}

export const getAllJournalObjects = async (journalId: string) => {
	const result = await db.find({
		selector: {
			journalId,
		},
	})
	return result.docs
}

export const resetJournal = async (journalId: string) => {
	const docs = await getAllJournalObjects(journalId)
	const deleted = docs.map((doc) => ({ ...doc, _deleted: true }))
	return db.bulkDocs(deleted)
}

export const deleteJournal = async (journalId: string) => {
	await resetJournal(journalId)
	const record = await db.get(journalId)
	await db.remove(record)
}

export const writeAttachmentToJournal = async (journalId: string, artifact: EntryArtifact, file: File): Promise<AttachmentMeta> => {
	const base64Data = await getImageBase64(file)

	await db.putAttachment(journalId, artifact._id, base64Data, artifact.contentType)
	return {
		data: base64Data,
		content_type: artifact.contentType,
	}
}

export const readAttachmentFromJournal = async (journalId: string, artifact: EntryArtifact) => {
	const attachment = await db.getAttachment(journalId, artifact._id)
	return {
		data: attachment.toString('base64'),
		content_type: artifact.contentType,
	}
}