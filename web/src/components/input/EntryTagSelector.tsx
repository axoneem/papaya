import { useContext, useRef, useState } from "react";
import { 
    AutocompleteCloseReason,
    Button,
    ButtonBase,
    Chip,
    ClickAwayListener,
    Divider,
    IconButton,
    InputBase,
    Link,
    ListItem,
    ListItemText,
    Paper,
    Popper,
    Stack,
    Typography
} from "@mui/material";
import { Close, Done, Settings } from "@mui/icons-material";
import { EntryTag, ReservedTag } from "@/types/schema";
import { JournalContext } from "@/contexts/JournalContext";
import { createEntryTag } from "@/database/actions";
import clsx from "clsx";
import EntryTagAutocomplete, { EntryTagAutocompleteProps } from "./EntryTagAutocomplete";
import { RESERVED_TAGS } from "@/constants/tags";

type EntryTagSelectorProps = Omit<EntryTagAutocompleteProps, 'renderInput'>

export default function EntryTagSelector(props: EntryTagSelectorProps) {
    const anchorRef = useRef<HTMLAnchorElement>(null);
    const [open, setOpen] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>('')
    const { getEntryTagsQuery, journal } = useContext(JournalContext)
    const value = props.value ?? []

    console.log('entryTagSelectorProps', props)

    const selectedEntryTags: EntryTag[] = value
        .map((tagId) => getEntryTagsQuery.data[tagId])
        .filter(Boolean)

    const options: Record<string, EntryTag | ReservedTag> = {
        ...RESERVED_TAGS,
        ...getEntryTagsQuery.data
    }

    const handleClose = () => {
        setOpen(false)
    }

    const createEntryTagWithValue = async () => {
        if (!journal) {
            return
        }
        const journalId = journal._id
        await createEntryTag({
            label: searchValue,
            description: '',
        }, journalId)
        getEntryTagsQuery.refetch()
    }

    return (
        <Stack gap={0.5}>
            <Button
                component='a'
                className={clsx({ '--open': open })}
                ref={anchorRef}
                onClick={() => setOpen(true)}
                sx={(theme) => ({
                    mx: -1,
                    mt: -2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    color: 'inherit',
                    '&:hover, &:focus, &:focus-within, &.--open': {
                        color: theme.palette.primary.main
                    },
                    background: 'none',
                })}
                disableRipple
                tabIndex={-1}
            >
                <Typography component='span' sx={{ fontWeight: 500 }}>Tags</Typography>
                <IconButton sx={{ m: -1, color: 'inherit' }} disableTouchRipple>
                    <Settings />
                </IconButton>
            </Button>
            {selectedEntryTags.length === 0 ? (
                <Typography sx={{ mt: -1 }} variant='body2' color='textSecondary'>
                    <span>No tags — </span>
                    <Link onClick={() => setOpen(true)} sx={{ cursor: 'pointer' }}>Add one</Link>
                </Typography>
            ) : (
                <Stack direction='row' alignItems='flex-start' gap={1} sx={{ flexWrap: 'wrap', mx: -0.5 }}>
                    {selectedEntryTags.map((tag) => {
                        return (
                            <ButtonBase disableRipple onClick={() => setOpen(true)} key={tag._id}>
                                <Chip label={tag.label} />
                            </ButtonBase>
                        )
                    })}
                </Stack>
            )}
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                sx={(theme) => ({ width: '300px', zIndex: theme.zIndex.modal})}
                placement='bottom-start'
            >
                <ClickAwayListener onClickAway={handleClose}>
                    <Paper>
                        <EntryTagAutocomplete
                            {...props}
                            open
                            onClose={(
                                _event,
                                reason: AutocompleteCloseReason,
                            ) => {
                                if (reason === 'escape') {
                                    handleClose();
                                }
                            }}
                            disableCloseOnSelect
                            noOptionsText={
                                searchValue.length === 0 ? (
                                    <Typography variant='body2' color='textSecondary'>
                                        No tags
                                    </Typography>
                                ) : (
                                    <Link onClick={() => createEntryTagWithValue()} sx={{ cursor: 'pointer' }}>
                                        Create new tag &quot;{searchValue}&quot;
                                    </Link>
                                )
                            }
                            renderTags={() => null}
                            renderInput={(params) => (
                                <>
                                    <InputBase
                                        sx={{ width: '100%', px: 2, py: 1 }}
                                        ref={params.InputProps.ref}
                                        value={searchValue}
                                        onChange={(event) => setSearchValue(event.target.value)}
                                        inputProps={params.inputProps}
                                        autoFocus
                                        placeholder="Filter tags"
                                    />
                                    <Divider />
                                </>
                            )}
                            renderOption={(props, option, { selected }) => {
                                const { key, ...optionProps } = props
                                const entryTag: EntryTag | ReservedTag | undefined = options[option]

                                return (
                                    <ListItem key={key} {...optionProps}>
                                        <Done
                                            sx={(theme) => ({
                                                width: 17,
                                                height: 17,
                                                mr: theme.spacing(1),
                                                visibility: selected ? 'visible' : 'hidden',
                                            })}
                                        />
                                        <ListItemText
                                            primary={entryTag?.label}
                                            secondary={entryTag?.description}
                                        />
                                        <Close
                                            sx={{
                                                opacity: 0.6,
                                                width: 18,
                                                height: 18,
                                                visibility: selected ? 'visible' : 'hidden',
                                            }}
                                        />
                                    </ListItem>
                                );
                            }}
                            slots={{
                                popper: (params: any) => <div {...params} />,
                                paper: (params) => <div {...params} />,
                            }}
                        />
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </Stack>
    )
}
