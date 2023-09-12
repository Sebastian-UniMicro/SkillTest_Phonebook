import { IDENTITY_SERVER_BASE_URL, IDENTITY_SERVER_SCOPES, SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';
import { SvelteKitAuth } from '@auth/sveltekit';
import type { Handle } from '@sveltejs/kit';
import type { TokenSet } from '@auth/core/types';
import type { JWT } from '@auth/core/jwt';

export const handle: Handle = SvelteKitAuth({
	secret: SECRET_CLIENT_SECRET,
	providers: [
		{
			id: 'softrig',
			name: 'SoftRig',
			type: 'oidc',
			issuer: IDENTITY_SERVER_BASE_URL,
			wellKnown: `${IDENTITY_SERVER_BASE_URL}/.well-known/openid-configuration`,
			authorization: {
				url: `${IDENTITY_SERVER_BASE_URL}/connect/authorize`,
				params: {
					scope: IDENTITY_SERVER_SCOPES
				}
			},
			clientId: SECRET_CLIENT_ID,
			clientSecret: SECRET_CLIENT_SECRET
		}
	],
	callbacks: {
		async jwt({ token, account, profile }: any) {
			if (account) {
				// Save token data in the JWT after login
				return {
					access_token: account.access_token!,
					refresh_token: account.refresh_token!,
					expires_at: Date.now() + account.expires_in! * 1000,
					user: {
						name: profile?.name,
						email: profile?.email,
						username: profile?.preferred_username,
						globalIdentity: profile?.sub,
						roles: profile?.role
					}
				};
			} else if (Date.now() < token.expires_at) {
				// If token is about to expire, renew it
				if (token.expires_at - Date.now() < (1000 * 60 * 5)) {
					return await renewToken(token);
				}

				return token;
			} else {
				// If token is expired we return null to invalidate the session
				return null;
			}
		},
		async session({ session, token }: any) {
			session.isAuthenticated = !!token.access_token && Date.now() < token.expires_at;
			session.access_token = token.access_token;
			session.user = token.user;
			session.expires_at = token.expires_at;

			if (token?.error) {
				session.isAuthenticated = false;
				session.error = token.error;
			}

			return session;
		}
	}
});

async function renewToken(token: JWT) {
	try {
		const response = await fetch(`${IDENTITY_SERVER_BASE_URL}/connect/token`, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			method: 'POST',
			body: new URLSearchParams({
				client_id: SECRET_CLIENT_ID,
				client_secret: SECRET_CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: token.refresh_token as string
			})
		});

		const newToken: TokenSet = await response.json();

		if (!response.ok) throw newToken;

		return {
			...token,
			access_token: newToken.access_token!,
			expires_at: Date.now() + newToken.expires_in! * 1000,
			refresh_token: newToken.refresh_token ?? token.refresh_token
		};
	} catch (error) {
		console.error('Error refreshing access token', error);
		return null;
	}
}

