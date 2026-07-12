import { AdminDashboardContext } from "@/model/contexts/AdminDashboardContext";
import { UserCredentialsForm, UserCredentialsFormSchema } from "@/model/schema/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogContent, DialogTitle, FormHelperText, Stack, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

export default function AdminLoginDialog() {
  const adminContext = useContext(AdminDashboardContext);
  const [open, setOpen] = useState<boolean>(() => {
    return !adminContext.databaseManagementStatus;
  });
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<UserCredentialsForm>({
    resolver: zodResolver(UserCredentialsFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    setLoadingLogin(true);
    adminContext.authenticate(data)
      .then((response) => {
        if (response.ok) {
          setOpen(false);
        } else if (response.status === 400) {
          setLoginError('Enter a valid username and password.');
        } else if (response.status === 401) {
          setLoginError('Invalid username or password.');
        } else {
          setLoginError('A server error occurred. Try again or check with your server admin.');
        }
      })
      .catch((error) => {
        console.error(error);
        setLoginError('A network error occurred. Try again or check your internet connection.');
      })
      .finally(() => {
        setLoadingLogin(false);
      });
  });

  return (
    <Dialog open={open}>
      <DialogTitle>Admin Login</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack sx={{
            gap: 2
          }}>
            <TextField
              {...form.register('username')}
              label="Admin Username"
              fullWidth
              variant="outlined"
            />
            <TextField
              {...form.register('password')}
              label="Admin Password"
              type="password"
              fullWidth
              variant="outlined"
            />
            {loginError && (
              <FormHelperText error>{loginError}</FormHelperText>
            )}
            <Button type="submit" loading={loadingLogin}>Login</Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}
