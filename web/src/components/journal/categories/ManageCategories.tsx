import AvatarIcon from '@/components/icon/AvatarIcon'
import CategoryChip from '@/components/icon/CategoryChip'
import CreateCategoryModal from '@/components/modal/CreateCategoryModal'
import EditCategoryModal from '@/components/modal/EditCategoryModal'
import { JournalContext } from '@/contexts/JournalContext'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import {  deleteCategory, undeleteCategory } from '@/database/actions'
import { Category } from '@/types/schema'
import { pluralize as p } from '@/utils/string'
import { Add, Search } from '@mui/icons-material'
import {
	Button,
	Divider,
	ListItem,
	ListItemIcon,
	ListItemText,
	MenuList,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import Link from 'next/link'
import { useContext, useState } from 'react'

export default function ManageCategories() {
	const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false)
	const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

	const { snackbar } = useContext(NotificationsContext)
	const { getCategoriesQuery } = useContext(JournalContext)

	const handleSelectCategoryForEdit = (category: Category) => {
		setSelectedCategory(category)
		setShowEditCategoryModal(true)
	}

	const handleDeleteCategory = async (category: Category) => {
		const record = await deleteCategory(category._id)

		snackbar({
			message: 'Deleted category',
			action: {
				label: 'Undo',
				onClick: () => {
					undeleteCategory(record)
						.then(() => {
							getCategoriesQuery.refetch()
							snackbar({ message: 'Category restored' })
						})
						.catch(() => {
							snackbar({ message: 'Failed to restore category' })
						})
				},
			},
		})
		getCategoriesQuery.refetch()
	}

	const categories = Object.values(getCategoriesQuery.data)

	return (
		<>
			<CreateCategoryModal
				open={showCreateCategoryModal}
				onClose={() => setShowCreateCategoryModal(false)}
				onSaved={() => getCategoriesQuery.refetch()}
			/>
			{selectedCategory && (
				<EditCategoryModal
					open={showEditCategoryModal}
					initialValues={selectedCategory}
					onClose={() => setShowEditCategoryModal(false)}
					onSaved={() => getCategoriesQuery.refetch()}
				/>
			)}
			<Stack gap={3}>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<TextField
						slotProps={{
							input: {
								startAdornment: <Search />,
							}
						}}
						label="Search all categories"
						size='small'
					/>
					<Button startIcon={<Add />} onClick={() => setShowCreateCategoryModal(true)} variant="contained" size='small'>
						Add Category
					</Button>
				</Stack>
				<Paper sx={(theme) => ({ borderRadius: theme.spacing(2) })}>
					<Stack p={2} direction="row" justifyContent="space-between" alignItems="center">
						<Typography>
							<>{categories.length} {p(categories.length, 'categor', 'y', 'ies')}</>
						</Typography>
					</Stack>
					<Divider />
					<MenuList>
						{Object.values(getCategoriesQuery.data).map((category) => {
							return (
								<ListItem
									key={category._id}
									secondaryAction={
										<Stack direction='row' gap={1}>
											<Button
												color='primary'
												onClick={() => handleSelectCategoryForEdit(category)}
											>
												Edit
											</Button>
											<Button
												color='error'
												onClick={() => handleDeleteCategory(category)}
											>
												Delete
											</Button>
										</Stack>
									}
								>
									<ListItemIcon>
										<AvatarIcon avatar={category?.avatar} />
									</ListItemIcon>
									<Link href={`/journal/a?cs=${category._id}`}>
										<CategoryChip category={category} contrast />
									</Link>
								</ListItem>
							)
						})}
					</MenuList>
				</Paper>
			</Stack>
		</>
	)
}
