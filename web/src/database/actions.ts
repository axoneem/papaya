import { Category, CreateCategory, CreateEntryArtifact, CreateJournalEntry, type CreateJournalEntryForm, CreateQuickJournalEntry, EditJournalEntryForm, EnhancedJournalEntry, EntryArtifact, type JournalEntry } from "@/types/schema";
import { db, ZISK_JOURNAL_META_KEY, ZiskJournalMeta } from "./client";
import { generateArtifactId, generateCategoryId, generateJournalEntryId } from "@/utils/id";
import { getJournalEntryArtifacts, getJournalEntryChildren } from "./queries";
import { isCreateJournalEntryForm, isEditJournalEntryForm } from "@/utils/journal";

export const createOrUpdateJournalEntry = async (formData: CreateJournalEntryForm | EditJournalEntryForm) => {
    const now = new Date().toISOString();

    const meta = await db.get(ZISK_JOURNAL_META_KEY) as ZiskJournalMeta;

    const parentDate = formData.parent.date;

    const editingChildrenIds = new Set<string>(
        formData.children.map(child => (child as JournalEntry)._id).filter(Boolean)
    );

    const deletedChildren: JournalEntry[] = [];
    const deletedArtifacts: EntryArtifact[] = [];

    let parent: JournalEntry;

    let parentId: string;

    const isEditing = '_id' in formData.parent && Boolean(formData.parent._id);

    if (isEditing) {
        parentId = (formData.parent as JournalEntry)._id;
    } else {
        parentId = generateJournalEntryId();
    }

    // Check if form data is for editing. If so, we need to check for children and artifacts to delete
    if (isEditing) {
        const currentChildren = await getJournalEntryChildren(parentId);
        currentChildren.forEach((child) => {
            if (!editingChildrenIds.has(child._id)) {
                deletedChildren.push({
                    ...child,
                    _deleted: true,
                });
            }
        });

        const currentArtifacts = await getJournalEntryArtifacts(parentId);
        currentArtifacts.forEach((artifact) => {
            if (!formData.artifacts.some(art => art._id === artifact._id)) {
                deletedArtifacts.push({
                    ...artifact,
                    _deleted: true,
                });
            }
        });
    }

    const children: JournalEntry[] = formData.children.map((child) => {
        if ('_id' in child) {
            // Child entry was edited
            return {
                ...child,
                date: parentDate,
                updatedAt: now,
            }
        } else {
            // New child entry
            return {
                ...child,
                _id: generateJournalEntryId(),
                type: 'JOURNAL_ENTRY',
                date: parentDate,
                parentEntryId: parentId,
                artifactIds: [],
                createdAt: now,
                updatedAt: null,
            }
        }
    });

    const artifacts: EntryArtifact[] = formData.artifacts.map((artifact) => {
        if ('parentEntryId' in artifact) {
            // Artifact was edited
            return {
                ...artifact,
                updatedAt: now,
            }
        } else {
            // New artifact
            return {
                ...artifact,
                type: 'ENTRY_ARTIFACT',
                parentEntryId: parentId,
                createdAt: now,
                updatedAt: null,
            }
        }
    });

    if ('_id' in formData.parent) {
        // Updating
        parent = {
            ...formData.parent,
            childEntryIds: children.map(child => child._id),
            artifactIds: artifacts.map(artifact => artifact._id),
            updatedAt: now,
        };
    } else {
        parent = {
            ...formData.parent,
            _id: parentId,
            type: 'JOURNAL_ENTRY',
            childEntryIds: children.map(child => child._id),
            artifactIds: artifacts.map(artifact => artifact._id),
            createdAt: now,
            updatedAt: null,
        };
    }

    const docs: Object[] = [
        parent,
        ...children,
        ...deletedChildren,
        ...artifacts,
        ...deletedArtifacts,
        {
            ...meta,
        }
    ];

    console.log('createOrUpdateJournalEntry.docs', docs);

    return db.bulkDocs(docs);
}

export const createQuickJournalEntry = async (formData: CreateQuickJournalEntry, date: string) => {
    const journalEntryFormData: CreateJournalEntryForm = {
        parent: {
            memo: formData.memo,
            amount: formData.amount,
            date,
            paymentMethodId: null,
            relatedEntryIds: [],
            categoryIds: [],
            tagIds: [],
            artifactIds: [],
            notes: '',
            entryType: 'CREDIT',
        },
        children: [],
        artifacts: [],
    };

    return createOrUpdateJournalEntry(journalEntryFormData);
}

export const deleteJournalEntry = async (journalEntryId: string): Promise<JournalEntry> => {
    const record = await db.get(journalEntryId);
    const children = await getJournalEntryChildren(journalEntryId);
    const docs = [
        { ...record, _deleted: true },
        ...children.map(child => ({ ...child, _deleted: true })),
    ];
    await db.bulkDocs(docs);
    return record as JournalEntry;
}

export const undeleteJournalEntry = async (journalEntry: JournalEntry) => {
    await db.put(journalEntry);
}

export const createCategory = async (formData: CreateCategory) => {
    const category: Category = {
        ...formData,
        type: 'CATEGORY',
        _id: generateCategoryId(),
        createdAt: new Date().toISOString(),
        updatedAt: null,
    };

    return db.put(category);
}

export const updateCategory = async (formData: Category) => {
    return db.put({
        ...formData,
        updatedAt: new Date().toISOString(),
    });
}

export const deleteCategory = async (categoryId: string): Promise<Category> => {
    const record = await db.get(categoryId);
    await db.remove(record);
    return record as Category;
}

export const undeleteCategory = async (category: Category) => {
    await db.put(category);
}
