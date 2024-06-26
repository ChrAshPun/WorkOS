import { createRequire } from "module";
const require = createRequire(import.meta.url);

import cookieParser from 'cookie-parser';
import { sealData, unsealData } from 'iron-session';

import dotenv from 'dotenv';
dotenv.config();

const express = require('express');
const { WorkOS } = require('@workos-inc/node');

const app = express();
const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID;
const port = process.env.PORT;

app.use(cookieParser());

app.get('/workos', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

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
  res.redirect('/workos');
});

// Javascript Object Signing and Encryption (JOSE)
// https://www.npmjs.com/package/jose
import { createRemoteJWKSet, jwtVerify } from 'jose';

// Set the JWKS URL. This is used to verify if the JWT is still valid
const JWKS = createRemoteJWKSet(
  new URL(workos.userManagement.getJwksUrl(clientId)),
);

// Auth middleware function
async function withAuth(req, res, next) {
  // First, attempt to get the session from the cookie
  const session = await getSessionFromCookie(req.cookies);

  // If no session, redirect the user to the login page
  if (!session) {
    return res.redirect('/workos/login');
  }

  const hasValidSession = await verifyAccessToken(session.accessToken);

  // If the session is valid, move on to the next function
  if (hasValidSession) {
    return next();
  }

  try {
    // If the session is invalid (i.e. the access token has expired)
    // attempt to re-authenticate with the refresh token
    const { accessToken, refreshToken } =
      await workos.userManagement.authenticateWithRefreshToken({
        clientId,
        refreshToken: session.refreshToken,
      });

    // Refresh tokens are single use, so update the session with the
    // new access and refresh tokens
    const encryptedSession = await sealData(
      {
        accessToken,
        refreshToken,
        user: session.user,
        impersonator: session.impersonator,
      },
      { password: process.env.WORKOS_COOKIE_PASSWORD },
    );

    // Update the cookie
    res.cookie('wos-session', encryptedSession, {
      path: '/workos',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return next();
  } catch (e) {
    // Failed to refresh access token, redirect user to login page
    // after deleting the cookie
    res.clearCookie('wos-session');
    res.redirect('/workos/login');
  }
}

async function getSessionFromCookie(cookies) {
  const cookie = cookies['wos-session'];

  if (cookie) {
    return unsealData(cookie, {
      password: process.env.WORKOS_COOKIE_PASSWORD,
    });
  }
}

async function verifyAccessToken(accessToken) {
  try {
    await jwtVerify(accessToken, JWKS);
    return true;
  } catch (e) {
    console.warn('Failed to verify session:', e);
    return false;
  }
}

// Specify the `withAuth` middleware function we defined earlier to protect this route
app.get('/workos/dashboard', withAuth, async (req, res) => {
  const session = await getSessionFromCookie(req.cookies);

  console.log(`User ${session.user.firstName} is logged in`);
  res.send(`User ${session.user.firstName} is logged in`);

  // ... render dashboard page
});