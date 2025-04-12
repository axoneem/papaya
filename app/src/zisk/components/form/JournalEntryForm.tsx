import {
	Box,
	Collapse,
	Divider,
	Grid2 as Grid,
	Stack,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
} from '@mui/material'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { EntryRecurrency, JOURNAL_ENTRY, NonspecificEntry, TRANSFER_ENTRY } from '@/types/schema'
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
import { Book, InfoOutlined, TransferWithinAStation } from '@mui/icons-material'
import RecurrenceSelect from '../input/RecurrenceSelect'
import { RESERVED_TAGS } from '@/constants/tags'

export default function JournalEntryForm() {
	const { setValue, control, register } = useFormContext<NonspecificEntry>()

	const date: string = useWatch({ control, name: 'date' }) ?? dayjs().format('YYYY-MM-DD')
	const parentEntryId = useWatch({ control, name: '_id' })
	const categoryId = useWatch({ control, name: 'categoryId' })
	const sourceAccountId = useWatch({ control, name: 'sourceAccountId' })
	const entryTagIds = useWatch({ control, name: 'tagIds' })
	const attachments = useWatch({ control, name: '_attachments' }) ?? {}
	const journalEntryId = useWatch({ control, name: '_id' })
	const entryType = useWatch({ control, name: 'type' })
	const childEntries = useWatch({ control, name: 'children' })
	const isApproximate = entryTagIds && entryTagIds.some((tagId) => tagId === RESERVED_TAGS.APPROXIMATE._id)

	const handleChangeEntryType = (newType: NonspecificEntry['type']) => {
		if (newType === TRANSFER_ENTRY.value && childEntries && childEntries.length > 0) {
			const confirmedRemoveChildren = confirm('Making this entry a Transfer will remove any child entries. Are you sure?')
			if (!confirmedRemoveChildren) {
				return
			}
		}
		setValue('type', newType)
	}

	useEffect(() => {
		getJournalEntryWithAttachments(journalEntryId)
			.then((entry) => {
				setValue('_attachments', { ...attachments, ...(entry._attachments ?? {}) })
			})
			.catch()
	}, [journalEntryId])

	return (
		<>
			<Box data-journalEntryId={parentEntryId} sx={{ position: 'relative' /* Used for attachment drag overlay */ }}>
				<ToggleButtonGroup exclusive value={entryType} size='small' onChange={(_event, value) => handleChangeEntryType(value)}>
					<ToggleButton value={JOURNAL_ENTRY.value}>
						<Stack direction='row' gap={0.5} alignItems='center'>
							<Book sx={{ mr: 0 }} />
							<span>Ledger</span>
							<Tooltip title="Journal entry"><InfoOutlined fontSize='small' /></Tooltip>
						</Stack>
					</ToggleButton>
					<ToggleButton value={TRANSFER_ENTRY.value}>
						<Stack direction='row' gap={0.5} alignItems='center'>
							<TransferWithinAStation sx={{ mr: 0 }} />
							<span>Transfer</span>
							<Tooltip title="Transfer between accounts"><InfoOutlined fontSize='small' /></Tooltip>
						</Stack>
					</ToggleButton>
				</ToggleButtonGroup>
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
											date={date}
											value={field.value as EntryRecurrency | undefined}
											onChange={(value: EntryRecurrency | undefined) => {
												setValue(`recurs`, value ?? undefined, { shouldDirty: true })
											}}
										/>
									)}
								/>
							</Stack>
							<Grid container columns={12} columnSpacing={2}>
								<Grid size={entryType === 'JOURNAL_ENTRY' ? 8 : 4}>
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
												approximate={isApproximate}
											/>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										control={control}
										name="sourceAccountId"
										render={({ field }) => {
											return (
												<AccountAutocomplete
													{...field}
													value={sourceAccountId}
													onChange={(_event, newValue) => {
														setValue(field.name, newValue ?? undefined, { shouldDirty: true })
													}}
													renderInput={(params) => (
														<TextField
															{...params}
															label={entryType === 'JOURNAL_ENTRY' ? 'Account' : 'From Account'}
															variant='filled'
														/>
													)}
												/>
											)
										}}
									/>
								</Grid>
								{entryType === 'TRANSFER_ENTRY' && (
									<Grid size={4}>
										<Controller
											control={control}
											name="destAccountId"
											render={({ field }) => {
												return (
													<AccountAutocomplete
														{...field}
														value={sourceAccountId}
														onChange={(_event, newValue) => {
															setValue(field.name, newValue ?? undefined, { shouldDirty: true })
														}}
														renderInput={(params) => (
															<TextField
																{...params}
																label={'To Account'}
																variant='filled'
															/>
														)}
													/>
												)
											}}
										/>
									</Grid>
								)}
							</Grid>
						</Stack>
						<Collapse in={entryType === 'JOURNAL_ENTRY'}>
							<ChildJournalEntryForm />
						</Collapse>
						<EntryArtifactsForm />
					</Grid>
					<Grid size={5}>
						<Stack gap={3} pt={1}>
							<Controller
								control={control}
								name="categoryId"
								render={({ field }) => {
									return (
										<CategorySelector
											{...field}
											value={categoryId}
											onChange={(_event, newValue: string | string[] | null) => {
												setValue(
													field.name,
													!Array.isArray(newValue) && newValue ? newValue : undefined,
													{ shouldDirty: true }
												)
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
				</Grid>
			</Box>
		</>
	)
}
