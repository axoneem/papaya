import { Button, Checkbox, Grid2 as Grid, IconButton, Link, Stack, Typography } from "@mui/material"
import AmountField from "../input/AmountField"
import CategoryAutocomplete from "../input/CategoryAutocomplete"
import { Add, Delete, Flag, FlagOutlined } from "@mui/icons-material"
import { useCallback, useContext, useRef, useState } from "react"
import { JournalEntry } from "@/types/schema"
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form"
import SelectionActionModal from "../modal/SelectionActionModal"
import { JournalContext } from "@/contexts/JournalContext"
import { makeJournalEntry } from "@/utils/journal"
import { RESERVED_TAGS } from "@/constants/tags"

export default function ChildJournalEntryForm() {
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const selectionMenuAnchorRef = useRef<HTMLDivElement>(null);
    const journalContext = useContext(JournalContext)
    
    const { control } = useFormContext<JournalEntry>()
    const children = useWatch({ control, name: 'children' }) ?? []
    const childEntriesFieldArray = useFieldArray({
        control,
        name: 'children',
    })

	const handleAddChildEntry = useCallback(() => {
		if (!journalContext.journal) {
			return
		}
		const newEntry: JournalEntry = makeJournalEntry({}, journalContext.journal._id)
        childEntriesFieldArray.prepend(newEntry)
	}, [children])
    
    const handleToggleFlagged = (index: number, isFlagged: boolean) => {
        const entry = childEntriesFieldArray.fields[index]
        const tagIds = isFlagged
            ? [...entry.tagIds ?? [], RESERVED_TAGS.FLAGGED._id]
            : entry.tagIds?.filter((tagId) => tagId !== RESERVED_TAGS.FLAGGED._id)
        childEntriesFieldArray.update(index, { ...entry, tagIds })
    }

    const handleToggleSelected = (key: string) => {
        const isSelected = selectedRows.includes(key)
        if (isSelected) {
            setSelectedRows(selectedRows.filter((id) => id !== key))
        } else {
            setSelectedRows([...selectedRows, key])
        }
    }

    const handleRemoveChildEntries = (entryIds: string[]) => {
        const indices = entryIds.map((entryId) => childEntriesFieldArray.fields.findIndex((entry) => entry._id === entryId))
        childEntriesFieldArray.remove(indices)
        setSelectedRows(selectedRows.filter((id) => !entryIds.includes(id)))
    }

    const handleSelectAll = () => {    
        setSelectedRows(childEntriesFieldArray.fields.map((entry) => entry._id))
    }

    const handleDeselectAll = () => {
        setSelectedRows([])
    }

    const handleDeleteSelectedChildren = () => {
        handleRemoveChildEntries(selectedRows)
    }

    return (
        <>
            <SelectionActionModal
                anchorEl={selectionMenuAnchorRef.current}
                open={selectedRows.length > 0}
                numSelected={selectedRows.length}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                numTotalSelectable={childEntriesFieldArray.fields.length}
                actions={{
                    onDelete: handleDeleteSelectedChildren
                }}
            />

            <Stack direction='row' alignItems={'center'} justifyContent={'space-between'} mt={4} mx={-2} px={2} ref={selectionMenuAnchorRef}>
                <Typography>Sub-Entries ({children.length})</Typography>
                <Button onClick={() => handleAddChildEntry()} startIcon={<Add />}>Add Row</Button>
            </Stack>
            {children.length === 0 && (
                <Typography variant='body2' color='textSecondary'>
                    No sub-entries. <Link onClick={() => handleAddChildEntry()} sx={{ cursor: 'pointer' }}>Click to add one.</Link>
                </Typography>
            )}
            <Stack mt={2} mx={-1} spacing={1}>
                {childEntriesFieldArray.fields.map((entry, index) => {
                    const isFlagged = Boolean(entry.tagIds?.includes(RESERVED_TAGS.FLAGGED._id))
                    return (
                        <Stack direction='row' spacing={0} alignItems={'flex-start'} sx={{ width: '100%' }} key={entry._id}>
                            <Stack direction='row' spacing={-1}>
                                <Checkbox
                                    checked={selectedRows.includes(entry._id)}
                                    onChange={() => handleToggleSelected(entry._id)}
                                />
                                <Checkbox
                                    icon={<FlagOutlined />}
                                    checkedIcon={<Flag />}
                                    checked={isFlagged}
                                    onChange={() => handleToggleFlagged(index, !isFlagged)}
                                />
                            </Stack>
                            <Grid container columns={12} spacing={1} sx={{ flex: '1', ml: 1 }}>
                                <Grid size={6}>
                                    <Controller
                                        control={control}
                                        name={`children.${index}.amount`}
                                        render={({ field }) => (
                                            <AmountField
                                                {...field}
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <CategoryAutocomplete
                                        size='small'
                                        value={entry.categoryIds}
                                        onChange={(_event, newValue) => {
                                            if (newValue) {
                                                childEntriesFieldArray.update(index, { ...entry, categoryIds: newValue })
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <IconButton onClick={() => handleRemoveChildEntries([entry._id])}>
                                <Delete />
                            </IconButton>
                        </Stack>
                    )
                })}
            </Stack>
        </>
    )
}
