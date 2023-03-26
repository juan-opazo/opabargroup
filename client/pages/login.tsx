import * as React from 'react';
import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';

const Copyright = (props: any) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://google.com/">
        TUPAQU
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const SignIn = () => {
  const [hasError, setHasError] = React.useState<Boolean>(false);
  const router = useRouter();

  const getToken = async (payload: any, router: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/token/`, {
      method: "POST",
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload),
    })
    .then(res => {
      res.json()
      .then(data => {
        if (res.ok) {
          console.log(data);
          localStorage.setItem('token', data.token);
          router.push('/');
  
        } else {
          console.error(data.non_field_errors[0]);
          setHasError(true);
        }
  
      })
      .catch(err => {
        console.error(err);
        setHasError(true);
      });
    })
    .catch(err => {
      console.error(err);
      setHasError(true);
    });
    
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('username'),
      password: data.get('password'),
    });
    getToken({
      username: data.get('username'),
      password: data.get('password'),
    }, router)
  };

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/');
    }
  }, []);
    
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> */}
            <Image alt="opabar" src="/OPABAR_LOGO.png" style={{width:'10rem'}}/>
            {/* <LockOutlinedIcon /> */}
          {/* </Avatar> */}
          <Typography component="h1" variant="h5">
            Iniciar Sesion
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuario"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contrasena"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            { hasError ? <Alert severity="error">Usuario o contraseña inválidos.</Alert> : null }

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Ingresar
            </Button>
            <Grid container>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;