// Import modules
import express from 'express';
import { WorkOS } from '@workos-inc/node';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

// Import middleware and functions
import { sealData } from 'iron-session';
import { withAuth, getSessionFromCookie } from './authMiddleware.js';

// Configure environment variables
dotenv.config();
const __dirname = path.resolve();
const port = process.env.PORT || 3000;
const clientId = process.env.WORKOS_CLIENT_ID;

// Initialize Express app
const app = express();
const workos = new WorkOS(process.env.WORKOS_API_KEY);

// Middleware setup
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/workos', (req, res) => res.render('index'));

app.get('/workos/auth', (req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    // Specify that we'd like AuthKit to handle the authentication flow
    provider: 'authkit',

    // The callback endpoint that WorkOS will redirect to after a user authenticates
    redirectUri: 'https://christinapunla.dev/workos/callback',
    clientId,
  });

  // Redirect the user to the AuthKit sign-in page
  res.redirect(authorizationUrl);
});

app.get('/workos/callback', async (req, res) => {
  // The authorization code returned by AuthKit
  const code = req.query.code;

  const { user, accessToken, refreshToken, impersonator } =
    await workos.userManagement.authenticateWithCode({
      code,
      clientId,
    });

  // The refreshToken should never be accesible publicly,
  // hence why we encrypt it in the cookie session.
  // Alternatively you could persist the refresh token in a backend database
  const encryptedSession = await sealData(
    { accessToken, refreshToken, user, impersonator },
    { password: process.env.WORKOS_COOKIE_PASSWORD },
  );

  // Store the session in a cookie
  res.cookie('wos-session', encryptedSession, {
    path: '/workos',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  // Use the information in `user` for further business logic.

  // Redirect the user to the homepage
  res.redirect('/workos/dashboard');
});

// Specify the `withAuth` middleware function we defined earlier to protect this route
app.get('/workos/dashboard', withAuth, async (req, res) => {
  const session = await getSessionFromCookie(req.cookies);
  res.render('dashboard', { session, logout });
});

async function logout(req, res) {
  // path and domain must match
  res.clearCookie('wos-session',{path: '/workos'});

  const sessionId = req.cookies['sessionid']

  if (sessionId) {
    redirect(workos.userManagement.getLogoutUrl({ sessionId }))
  }

  res.redirect('/workos');
};

app.get('/workos/reset-password', (req, res) => res.redirect('https://peaceful-peacock-26-staging.authkit.app/reset-password'));