'use client'

import {
	Box,
	Divider,
	Grid2 as Grid,
	SelectChangeEvent,
	Stack,
	TextField,
} from '@mui/material'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { JournalEntry, RecurringCadence } from '@/types/schema'
import AmountField from '../input/AmountField'
import CategorySelector from '../input/CategorySelector'
import ChildJournalEntryForm from './ChildJournalEntryForm'
import { useEffect } from 'react'
import EntryArtifactsForm from './EntryArtifactsForm'
import { getJournalEntryWithAttachments } from '@/database/queries'
import EntryTagSelector from '../input/EntryTagSelector'
import EntryNoteForm from './EntryNoteForm'
import EntryTasksForm from './EntryTasksForm'
import AccountAutocomplete from '../input/AccountAutocomplete'
import RecurrenceSelect from '../input/RecurrenceSelect'

export default function JournalEntryForm() {
	const { setValue, control, register } = useFormContext<JournalEntry>()

	const date: string = useWatch({ control, name: 'date' }) ?? dayjs().format('YYYY-MM-DD')
	const categoryIds = useWatch({ control, name: 'categoryIds' })
	const accountId = useWatch({ control, name: 'accountId' })
	const entryTagIds = useWatch({ control, name: 'tagIds' })
	const attachments = useWatch({ control, name: '_attachments' }) ?? {}
	const journalEntryId = useWatch({ control, name: '_id' })

	useEffect(() => {
		getJournalEntryWithAttachments(journalEntryId)
			.then((entry) => {
				setValue('_attachments', { ...attachments, ...(entry._attachments ?? {}) })
			})
			.catch()
	}, [journalEntryId])

	return (
		<>
			<Box sx={{ position: 'relative' /* Used for attachment drag overlay */ }}>
				<Grid container columns={12} spacing={4} rowSpacing={2} mb={1} sx={{ px: 0 }}>
					<Grid size={12}>
						{/* <Stack direction='row' sx={{ pt: 0, pb: 2 }}>
							<Button variant='outlined' startIcon={<SubdirectoryArrowRight />} onClick={() => handleAddChildEntry()}>
								Add Sub-Entry
							</Button>
						</Stack> */}
					</Grid>
					<Grid size={7}>
						<Stack spacing={2} mb={1}>
							<TextField
								label="Memo"
								variant='filled'
								autoFocus
								{...register('memo')}
								fullWidth
								multiline
								maxRows={3}
							/>
							<Stack direction='row' spacing={2}>
								<Controller
									control={control}
									name="date"
									render={({ field }) => (
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DatePicker
												{...field}
												value={dayjs(field.value)}
												onChange={(value) => {
													setValue(field.name, value?.format('YYYY-MM-DD') ?? '', { shouldDirty: true })
												}}
												format="ddd, MMM D"
												label="Date"
												slotProps={{
													textField: {
														// fullWidth: true,
														variant: 'filled'
													},
												}}
											/>
										</LocalizationProvider>
									)}
								/>
								
								<Controller
									control={control}
									name="recurs"
									render={({ field }) => (
										<RecurrenceSelect
											variant='filled'
											label='Recurrence'
											date={date}
											{...field}
											value={field.value?.cadence ?? ''}
											onChange={(event: SelectChangeEvent<RecurringCadence | string | undefined>) => {
												const value: RecurringCadence | string | undefined = event.target.value;
												console.log('got value:', value)
												setValue(`recurs.cadence`, value || undefined, { shouldDirty: true })
											}}
										/>
									)}
								/>
													
							</Stack>
							<Grid container columns={12} columnSpacing={2}>
								<Grid size={8}>
									<Controller
										control={control}
										name="amount"
										render={({ field }) => (
											<AmountField
												variant='filled'
												{...field}
												fullWidth
												sx={{ flex: 1 }}
												autoComplete="off"
											/>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										control={control}
										name="accountId"
										render={({ field }) => {
											return (
												<AccountAutocomplete
													{...field}
													value={accountId}
													onChange={(_event, newValue) => {
														setValue(field.name, newValue ?? undefined, { shouldDirty: true })
													}}
													renderInput={(params) => <TextField {...params} label={'Account'} variant='filled' />}
												/>
											)
										}}
									/>
								</Grid>
							</Grid>
						</Stack>					
						<ChildJournalEntryForm />
						<EntryArtifactsForm />
					</Grid>
					<Grid size={5}>
						<Stack gap={3} pt={1}>
							<Controller
								control={control}
								name="categoryIds"
								render={({ field }) => {
									return (
										<CategorySelector
											{...field}
											value={categoryIds}
											onChange={(_event, newValue) => {
												setValue(field.name, newValue ?? [], { shouldDirty: true })
											}}
										/>
									)
								}}
							/>
							<Divider flexItem />
							<Controller
								control={control}
								name="tagIds"
								render={({ field }) => {
									return (
										<EntryTagSelector
											{...field}
											value={entryTagIds}
											onChange={(_event, newValue) => {
												setValue(field.name, newValue ?? [], { shouldDirty: true })
											}}
										/>
									)
								}}
							/>
							<Divider flexItem />
							<EntryTasksForm />
							<Divider flexItem />
							<EntryNoteForm />
						</Stack>
					</Grid>
				{/* <AttachmentDropzone onFilesAdded={handleAddFiles}>
					<AttachmentButton />
				</AttachmentDropzone> */}
				</Grid>
			</Box>
		</>
	)
}
