import LoginModal from '@/features/login/LoginModal';
import { AuthStatusEnum, RemoteContext } from '@/model/contexts/RemoteContext';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Avatar, Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useContext, useState } from 'react';

export default function UserWidget() {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const handleClose = () => {
    setAnchorEl(null)
  }

  const { userContext, authStatus } = useContext(RemoteContext);

  const name = userContext?.username ?? '';
  const isLoggedIn = authStatus === AuthStatusEnum.AUTHENTICATED;
  const isAuthenticating = authStatus === AuthStatusEnum.AUTHENTICATING;

  const handleSignOut = () => {
    // handleClose();
  }

  if (isLoggedIn || isAuthenticating) {
    return (
      <>
        <Button
          sx={(theme) => ({ borderRadius: 56, ml: 1, color: theme.palette.grey[500] })}
          onClick={(event) => {
            setAnchorEl(event.currentTarget)
          }}
          loading={isAuthenticating}
        >
          <MenuIcon sx={(theme) => ({ color: theme.palette.grey[500] })} />
          <Avatar
            sx={(theme) => ({
              background: theme.palette.background.paper,
              outline: `2px solid ${theme.palette.divider}`,
              ml: 1,
              color: theme.palette.text.primary,
            })}
          />
        </Button>
        <Menu
          id="header-profile-menu"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorEl={anchorEl}
          slotProps={{
            list: {
              sx: { minWidth: 250 },
            }
          }}>
          <Box component="li" sx={{ px: 2, pb: 1 }}>
            <Typography variant="subtitle1">
              <strong>{name}</strong>
            </Typography>
          </Box>
          <MenuItem onClick={() => handleSignOut()}>Sign Out</MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <Button onClick={() => setShowLoginModal(true)}>Sign In</Button>
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}
