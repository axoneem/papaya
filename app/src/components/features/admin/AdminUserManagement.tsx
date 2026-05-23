import CopyField from "@/components/display/CopyField";
import { AdminDashboardContext } from "@/model/contexts/AdminDashboardContext";
import { UserDocument } from "@/model/schema/application/remote-schemas";
import { UserCredentialsForm, UserCredentialsFormSchema } from "@/model/schema/form-schemas";
import { usernameToDbName } from "@/utils/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, Edit, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Divider, FormHelperText, IconButton, InputAdornment, List, ListItem, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

interface AddEditUserFormProps {
  editingUser?: UserDocument;
  onSubmit: (values: UserCredentialsForm) => void;
}

function AddEditUserForm(props: AddEditUserFormProps) {
  const { editingUser } = props;
  const isEditing = !!props.editingUser;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRandomPasswordDisclaimer, setShowRandomPasswordDisclaimer] = useState<boolean>(false);

  const form = useForm<UserCredentialsForm>({
    defaultValues: editingUser ? {
      username: editingUser.name,
      password: editingUser.password ?? '',
    } : {
      username: '',
      password: '',
    },
    resolver: zodResolver(UserCredentialsFormSchema),
  });

  const handleRandomizePassword = () => {
    const password = Math.random().toString(36).substring(2, 15);
    form.setValue('password', password);
    setShowPassword(true);
    setShowRandomPasswordDisclaimer(true);
  }

  return (
    <form onSubmit={form.handleSubmit(props.onSubmit)}>
      <Stack sx={{
        gap: 2
      }}>
        <TextField
          {...form.register('username')}
          label="Username"
          fullWidth
          variant="outlined"
          autoComplete="off"
          // User names are read-only in CouchDB
          disabled={isEditing}
          helperText={isEditing ? 'User names are read-only in CouchDB and cannot be changed.' : undefined}
        />
        <TextField
          {...form.register('password')}
          onChange={() => {
            setShowRandomPasswordDisclaimer(false);
          }}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          autoComplete="off"
          slotProps={{
            input: {
              autoComplete: 'new-password',
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        {showRandomPasswordDisclaimer && (
          <FormHelperText>
            You can copy the password to your clipboard after creating the user.
          </FormHelperText>
        )}
        <Button
          size='small'
          variant='text'
          onClick={() => handleRandomizePassword()}
        >
          Use random password
        </Button>
        <Divider />
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? 'Update User' : 'Add User'}
        </Button>
      </Stack>
    </form>
  );
}

export default function AdminUserManagement() {
  const adminContext = useContext(AdminDashboardContext)
  const [editingUser, setEditingUser] = useState<UserDocument | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      return adminContext.listUsers();
    },
    enabled: !!adminContext.databaseManagementStatus,
    initialData: undefined,
  });

  const users: UserDocument[] | undefined = usersQuery.data

  console.log('users:', users)

  const handleSaveUser = (user: UserCredentialsForm) => {
    const userDocument: UserDocument = editingUser ? {
      ...editingUser,
      password: user.password,
    } : {
      name: user.username,
      password: user.password,
      roles: [],
      _id: `org.couchdb.user:${user.username}`,
      type: 'user',
    };
    adminContext.saveUser(userDocument);
    setIsCreating(false);
    setEditingUser(null);
  }

  return (
    <Paper>
      <Typography variant='h3'>Users</Typography>
      {!users ? (
        <Typography variant='body1'>Loading users...</Typography>
      ) : (
        <>
          {(users.length <= 0) ? (
            <Typography variant='body1'>No users found</Typography>
          ) : (
            <List>
              {users.map((user) => {
                if (editingUser?._id === user._id) {
                  return <AddEditUserForm
                    key={user._id}
                    editingUser={user}
                    onSubmit={handleSaveUser}
                  />;
                }
                return (
                  <ListItem
                    key={user._id}
                    secondaryAction={
                      <>
                        <IconButton onClick={() => setEditingUser(user)} disabled={!!editingUser || isCreating}>
                          <Edit />
                        </IconButton>
                        <IconButton>
                          <Delete />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      primary={user.name}
                      secondary={<>
                        <CopyField copyText={user._id} label="ID" />
                        <CopyField copyText={user.roles ? user.roles.join(', ') : 'None'} label="Roles" />
                        <CopyField copyText={usernameToDbName(user.name)} label="Database Name" />
                      </>}
                    />
                  </ListItem>
                )
              })}
            </List>
          )}
          {!editingUser && (
            <>
              {isCreating ? (
                <AddEditUserForm
                  onSubmit={handleSaveUser}
                />
              ) : (
                <Button onClick={() => setIsCreating(true)}>Create User</Button>
              )}
            </>
          )}
        </>
      )}
    </Paper>
  )
}
