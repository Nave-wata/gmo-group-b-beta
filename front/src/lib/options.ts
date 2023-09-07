import { writeFileSync } from "fs";
import { google } from "googleapis";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
    debug: true,
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar",
                },
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user, account, profile, isNewUser }) => {
            async () => {
                // Google OAuthへの接続
                const oauth2Client = new google.auth.OAuth2({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    redirectUri: "http://localhost:3000/api/auth/callback/google",
                });

                // トークンを設定。refresh_tokenも渡せます。
                oauth2Client.setCredentials({
                    access_token: account?.access_token,
                    refresh_token: account?.refresh_token,
                    scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly",
                });

                // Googleカレンダーの一覧を取得する
                const calendar = google.calendar({ version: "v3", auth: oauth2Client });
                const calendarResponse = await calendar.calendarList.list();

                writeFileSync("./calendar.json", JSON.stringify(calendarResponse));
            };

            if (user) {
                token.user = user;
            }
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
            }

            return token;
        },
        session: ({ session, token }) => {
            token.accessToken;
            return {
                ...session,
                user: {
                    ...session.user,
                    role: token.role,
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken,
                },
            };
        },
    },
};
