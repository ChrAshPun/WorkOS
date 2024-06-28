// Javascript Object Signing and Encryption (JOSE)
// https://www.npmjs.com/package/jose
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { sealData, unsealData } from 'iron-session';
import { WorkOS } from '@workos-inc/node';

import dotenv from 'dotenv';
dotenv.config();

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID;

// Set the JWKS URL. This is used to verify if the JWT is still valid
const JWKS = createRemoteJWKSet(new URL(workos.userManagement.getJwksUrl(clientId)));

async function withAuth(req, res, next) {
  // First, attempt to get the session from the cookie
  const session = await getSessionFromCookie(req.cookies);

  // If no session, redirect the user to the login page
  if (!session) {
    return res.redirect('/workos');
  }

  const hasValidSession = await verifyAccessToken(session.accessToken);

  // If the session is valid, move on to the next function
  if (hasValidSession) {
    return next();
  }

  try {
    // If the session is invalid (i.e. the access token has expired)
    // attempt to re-authenticate with the refresh token
    const { accessToken, refreshToken } = await workos.userManagement.authenticateWithRefreshToken({
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
    res.redirect('/workos');
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

export { withAuth, getSessionFromCookie, verifyAccessToken };