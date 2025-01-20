import { useState } from 'react'
import SearchModal from './SearchModal'
import SearchLaunchButton from './SearchLaunchButton'
import useKeyboardActions from '@/hooks/useKeyboardActions'
import { KeyboardActionName } from '@/constants/keyboard'

export default function SearchWidget() {
	const [showSearchModal, setShowSearchModal] = useState<boolean>(false)

	useKeyboardActions(KeyboardActionName.OPEN_SEARCH_MODAL, () => {
		setShowSearchModal(true);
	})

	return (
		<>
			<SearchModal
				open={showSearchModal}
				onClose={() => setShowSearchModal(false)}
				placeholderText='Search for journal entries and more...'
			/>
			<SearchLaunchButton
				placeholderText="Search"
				onOpen={() => setShowSearchModal(true)}
			/>
		</>
	)
}
