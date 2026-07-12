import { Pictogram, PictogramVariantSchema } from '@/model/schema/journal/entity/pictogram'
import { createImagePictogram, getPaletteColors } from '@/utils/image'
import { AddPhotoAlternate, RemoveCircle } from '@mui/icons-material'
import { Avatar, AvatarProps, Box, Button, FormHelperText, Stack } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import ColorPicker from './ColorPicker'

interface ImagePictogramPicker {
  value: Pictogram
  onChange: (pictogram: Pictogram | null) => void
}

interface ImagePictogramProps extends AvatarProps {
  pictogram: Pictogram
}

export const ImagePictogram = (props: ImagePictogramProps) => {
  const { pictogram, ...rest } = props

  return <Avatar variant="rounded" src={pictogram.content} {...rest} />
}

export default function ImagePictogramPicker(props: ImagePictogramPicker) {
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [paletteColors, setPaletteColors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  console.log(paletteColors)

  const hasImageIcon = useMemo(() => {
    return [
      Boolean(props.value),
      Boolean(props.value?.content),
      props.value?.variant === PictogramVariantSchema.enum.IMAGE,
    ].every(Boolean)
  }, [props.value])

  const handleRemoveImage = () => {
    props.onChange(null)
  }

  const handleClickUploadButton = () => {
    fileInputRef?.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploading(true)
      setUploadError(null)

      try {
        const imagePictogram = await createImagePictogram(file)
        const paletteColors = await getPaletteColors(file)
        setPaletteColors(paletteColors)
        props.onChange({ ...imagePictogram, primaryColor: paletteColors[0] })
      } catch (err) {
        setUploadError((err as Error).message)
      } finally {
        setUploading(false)
      }
    }
  }

  return (
    <Box sx={{
      p: 2
    }}>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <Stack
        direction="row"
        sx={{
          gap: 2,
          mb: 1
        }}>
        {hasImageIcon && (
          <>
            <ImagePictogram pictogram={props.value} />
            <ColorPicker
              color={props.value.primaryColor}
              onChange={(color) => props.onChange({ ...props.value, primaryColor: color })}
              swatches={paletteColors.map((color: string) => ({ color, name: '' }))}
              disabled={!paletteColors.length}
            />
            <Button variant="text" onClick={() => handleRemoveImage()} startIcon={<RemoveCircle />}>
              Remove
            </Button>
          </>
        )}
        <LoadingButton onClick={handleClickUploadButton} loading={uploading} startIcon={<AddPhotoAlternate />}>
          {hasImageIcon ? 'Replace Image' : 'Add Image'}
        </LoadingButton>
      </Stack>
      {uploadError && <FormHelperText error>{uploadError}</FormHelperText>}
    </Box>
  );
}
