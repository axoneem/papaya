import { SCHEMA_VERSION } from '@/database/SchemaMigration'
import { Pictogram, PictogramVariantSchema } from '@/model/schema/journal/entity/pictogram'
import { Box, colors, Fade, Icon, Popover, Select, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import IconPicker from './IconPicker'
import ImagePictogramPicker, { ImagePictogram } from './ImagePictogramPicker'

interface PictogramPickerProps {
  value: Pictogram | null
  onChange: (pictogram: Pictogram) => void
}

export const DEFAULT_PICTOGRAM = {
  kind: 'papaya:entity:pictogram',
  '@version': SCHEMA_VERSION,
  content: 'layers',
  variant: PictogramVariantSchema.enum.PICTORIAL,
  primaryColor: colors.grey[500],
} as const satisfies Pictogram;

const renderPictogramItem = (pictogram: Pictogram) => {
  switch (pictogram.variant) {
    case PictogramVariantSchema.enum.PICTORIAL:
      return <Icon sx={{ color: pictogram.primaryColor }}>{pictogram.content}</Icon>
    case PictogramVariantSchema.enum.IMAGE:
      return <ImagePictogram pictogram={pictogram} sx={{ my: -0.5, width: '32px', height: '32px' }} />
    default:
      return null
  }
}

export default function PictogramPicker(props: PictogramPickerProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [currentTab, setCurrentTab] = useState<number>(0)

  const displayIcon: Pictogram = props.value ?? { ...DEFAULT_PICTOGRAM }
  const open = Boolean(anchorEl)

  const handleChange = (pictogram: Pictogram | null) => {
    props.onChange(pictogram ?? { ...DEFAULT_PICTOGRAM })
  }

  return (
    <>
      <Select
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}
        multiple
        readOnly
        value={displayIcon}
        renderValue={(value) => {
          return <Box sx={{ '& > *': { my: -0.5 } }}>{renderPictogramItem(value)}</Box>
        }}
      />
      <Popover
        TransitionComponent={Fade}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <Box
          sx={{
            px: 2,
            pt: 1
          }}>
          <Tabs value={currentTab} onChange={(_event, newValue) => setCurrentTab(newValue)}>
            <Tab label="Icon" />
            {/* <Tab disabled label='Emoji' />
                        <Tab disabled label='Letters' /> */}
            <Tab label="Image" />
          </Tabs>
        </Box>
        {currentTab === 0 && (
          <IconPicker value={displayIcon.variant === 'IMAGE' ? { ...DEFAULT_PICTOGRAM } : displayIcon} onChange={handleChange} />
        )}
        {currentTab === 1 && <ImagePictogramPicker value={displayIcon} onChange={handleChange} />}
      </Popover>
    </>
  );
}
