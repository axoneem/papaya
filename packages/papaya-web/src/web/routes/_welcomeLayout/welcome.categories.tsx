import AvatarChip from '@/components/icon/AvatarChip'
import RadioToggleButton from '@/components/input/RadioToggleButton'
import { CATEGORY_PRESET_GROUPS, CategoryPresetGroup, PRESET_CATEGORIES_SIMPLE, PRESET_CATEGORIES_SPECIFIC, PRESET_CATEGORIES_TYPICAL } from '@/constants/presets'
import { JournalContext } from '@/contexts/JournalContext'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import { useCategories } from '@/hooks/queries/useCategories'
import WelcomePage from '@/layouts/WelcomePage'
import { Category, CreateCategory } from '@/schema/documents/Category'
import { generateGenericPapayaUniqueId } from '@/utils/id'
import { pluralize } from '@/utils/string'
import { ArrowBack, ArrowForward, ExpandLess, ExpandMore } from '@mui/icons-material'
import { Box, Button, Checkbox, Collapse, Container, FormControlLabel, Stack, ToggleButtonGroup, Typography } from '@mui/material'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useContext, useMemo, useState } from 'react'

export const Route = createFileRoute('/_welcomeLayout/welcome/categories')({
  component: CreateCategoryPage,
})

// Using centralized CategoryPresetGroup and labels from presets.tsx

const MAX_CATEGORIES_TO_SHOW = 10 as const
const TRUNCATE_CATEGORIES = true as const

function CreateCategoryPage() {
  const [preset, setPreset] = useState<string>('minimal')
  const [isCreating, setIsCreating] = useState(false)
  const [showGroupOptions, setShowGroupOptions] = useState(false)
  const [selectedGroups, setSelectedGroups] = useState<Set<CategoryPresetGroup>>(new Set())

  const { activeJournalId } = useContext(JournalContext)
  const { snackbar } = useContext(NotificationsContext)
  const navigate = useNavigate()

  // Get existing categories for this journal
  const getCategoriesQuery = useCategories()
  const userCategories: Category[] = Object.values(getCategoriesQuery.data || {})

  // Generate preset categories based on selected preset and groups
  const presetCategories: CreateCategory[] = useMemo(() => {
    if (preset === 'none') {
      return []
    }

    let presetArray
    switch (preset) {
      case 'minimal':
        presetArray = PRESET_CATEGORIES_SIMPLE
        break
      case 'basic':
        presetArray = PRESET_CATEGORIES_TYPICAL
        break
      case 'specific':
        presetArray = PRESET_CATEGORIES_SPECIFIC
        break
      default:
        return []
    }

    // Filter categories based on selection
    return presetArray
      .filter(group => {
        // Always include categories with no group (core categories)
        if (group.group === null) {
          return true
        }
        // Include categories from selected groups
        return selectedGroups.has(group.group)
      })
      .flatMap(group => group.categories)
  }, [preset, selectedGroups])

  // Convert preset categories to display categories (with generated IDs for preview)
  const presetDisplayCategories: Category[] = useMemo(() => {
    return presetCategories.map(category => ({
      ...category,
      kind: 'papaya:category' as const,
      _id: generateGenericPapayaUniqueId(),
      createdAt: new Date().toISOString(),
      updatedAt: null,
      journalId: activeJournalId || '',
    }))
  }, [presetCategories, activeJournalId])

  const allCategories: Category[] = useMemo(() => {
    return [...presetDisplayCategories, ...userCategories]
  }, [presetDisplayCategories, userCategories])

  const canContinue = true // Users can always continue, even with no categories

  const handlePresetChange = (_event: React.MouseEvent<HTMLElement>, newPreset: string | null) => {
    if (newPreset !== null) {
      setPreset(newPreset)
    }
  }

  const handleGroupToggle = (group: CategoryPresetGroup) => {
    setSelectedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(group)) {
        newSet.delete(group)
      } else {
        newSet.add(group)
      }
      return newSet
    })
  }

  const handleContinue = async () => {
    if (!activeJournalId) {
      snackbar({ message: 'No active journal found' })
      return
    }

    setIsCreating(true)

    try {
      // // Create all preset categories in the database
      // const creationPromises = presetCategories.map(category =>
      //   createCategory(category, activeJournalId)
      // )

      // await Promise.all(creationPromises)

      // if (presetCategories.length > 0) {
      //   snackbar({
      //     message: `Created ${presetCategories.length} categories`
      //   })
      // }

      // // Navigate to the final welcome step
      // navigate({ to: '/welcome/start' })
    } catch (error) {
      console.error('Failed to create categories:', error)
      snackbar({ message: 'Failed to create categories' })
    } finally {
      setIsCreating(false)
    }
  }

  // Get available groups for the current preset
  const availableGroups = useMemo(() => {
    if (preset === 'none') return []

    let presetArray
    switch (preset) {
      case 'minimal':
        presetArray = PRESET_CATEGORIES_SIMPLE
        break
      case 'basic':
        presetArray = PRESET_CATEGORIES_TYPICAL
        break
      case 'specific':
        presetArray = PRESET_CATEGORIES_SPECIFIC
        break
      default:
        return []
    }

    const groups = new Set<CategoryPresetGroup>()
    presetArray.forEach(group => {
      if (group.group !== null) {
        groups.add(group.group)
      }
    })

    return Array.from(groups)
  }, [preset])

  return (
    <WelcomePage
      formSlot={
        <Container maxWidth='md' disableGutters>
          <Stack gap={4}>
            <Stack gap={2}>
              <Typography variant='h5'>
                Add categories
              </Typography>
              <Typography variant='body2'>
                Add categories to your journal to help organize your expenses.
              </Typography>
            </Stack>

            <Stack gap={2}>
              <ToggleButtonGroup
                value={preset}
                orientation='vertical'
                exclusive
                fullWidth
                onChange={handlePresetChange}
                aria-label="category preset"
              >
                <RadioToggleButton
                  heading='Minimal'
                  description='A minimal set of categories to get you started.'
                  value="minimal"
                />
                <RadioToggleButton
                  heading='Basic'
                  description='A basic set of categories to help you track your spending.'
                  value="basic"
                />
                <RadioToggleButton
                  heading='Specific'
                  description='A comprehensive set of categories for detailed tracking.'
                  value="specific"
                />
                <RadioToggleButton
                  heading='None'
                  description='Skip categories for now - you can add them later.'
                  value="none"
                />
              </ToggleButtonGroup>
            </Stack>

            {/* Expandable Group Selection */}
            {preset !== 'none' && availableGroups.length > 0 && (
              <Stack gap={2}>
                <Button
                  variant="text"
                  onClick={() => setShowGroupOptions(!showGroupOptions)}
                  endIcon={showGroupOptions ? <ExpandLess /> : <ExpandMore />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  <Typography variant="subtitle1">
                    Customize Categories ({selectedGroups.size} selected)
                  </Typography>
                </Button>

                <Collapse in={showGroupOptions}>
                  <Stack gap={2}>
                    <Typography variant="body2" color="text.secondary">
                      Select additional category groups that apply to your lifestyle:
                    </Typography>
                    <Stack gap={1}>
                      {availableGroups.map(group => (
                        <FormControlLabel
                          key={group}
                          control={
                            <Checkbox
                              checked={selectedGroups.has(group)}
                              onChange={() => handleGroupToggle(group)}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {CATEGORY_PRESET_GROUPS[group].label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {CATEGORY_PRESET_GROUPS[group].description}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Collapse>
              </Stack>
            )}
          </Stack >
        </Container >
      }
      previewSlot={
        < Container maxWidth='md' disableGutters >
          {
            allCategories.length > 0 ? (
              <Stack gap={2}>
                <Typography>
                  {allCategories.length} {pluralize(allCategories.length, 'categor', 'y', 'ies')}
                </Typography>
                <Stack direction='row' flexWrap='wrap' gap={1} sx={{ alignItems: 'center' }}>
                  {allCategories.slice(0, TRUNCATE_CATEGORIES ? MAX_CATEGORIES_TO_SHOW : allCategories.length).map((category) => {
                    return (
                      <AvatarChip
                        key={category._id}
                        label={category.label}
                        avatar={category.avatar}
                        icon
                      />
                    )
                  })}
                  {TRUNCATE_CATEGORIES && allCategories.length > MAX_CATEGORIES_TO_SHOW && (
                    <Typography color='text.secondary'>
                      ... and {allCategories.length - MAX_CATEGORIES_TO_SHOW} {pluralize(allCategories.length - MAX_CATEGORIES_TO_SHOW, 'other')}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            ) : (
              <Typography variant='body2'>
                Skip creating categories for now. You can add them later from the main app.
              </Typography>
            )
          }
        </Container >
      }
      actionsSlot={
        < Stack direction='row' gap={2} >
          <Button component={Link} to='/welcome/journal' variant='text' startIcon={<ArrowBack />}>
            Back
          </Button>
          <Button
            variant='text'
            endIcon={<ArrowForward />}
            disabled={!canContinue || isCreating}
            onClick={handleContinue}
          >
            {isCreating ? 'Creating...' : 'Continue'}
          </Button>
        </Stack >
      }
    />
  )
}
