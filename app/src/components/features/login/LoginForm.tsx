import { UserCredentialsForm, UserCredentialsFormSchema } from "@/model/schema/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormHelperText, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

type LoginFormProps = {
  onLoginSuccess: () => void;
}

export default function LoginForm(props: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<UserCredentialsForm>({
    resolver: zodResolver(UserCredentialsFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    setLoading(true);
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          props.onLoginSuccess();
        } else if (response.status === 400) {
          setLoginError('Enter a valid username and password.');
        } else if (response.status === 401) {
          setLoginError('Invalid username or password.');
        } else {
          setLoginError('A server error occurred. Try again or check with your server admin.');
        }
      })
      .catch(() => {
        setLoginError('A network error occurred. Try again or check your internet connection.');
      })
      .finally(() => {
        setLoading(false);
      });
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack sx={{
        gap: 2
      }}>
        <TextField
          {...form.register('username')}
          label="Username"
          fullWidth
          variant="outlined"
        />
        <TextField
          {...form.register('password')}
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
        />
        {loginError && (
          <FormHelperText error>{loginError}</FormHelperText>
        )}
        <Button type="submit" loading={loading}>Login</Button>
      </Stack>
    </form>
  );
}
