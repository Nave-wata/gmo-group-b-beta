import { google } from "googleapis";

/**
 * Google Calendar API のオブジェクトを生成する。
 *
 * @param {string} accessToken Google API のアクセストークン
 * @param {string} refreshToken Google API のリフレッシュトークン
 * @returns Google Calendar API のオブジェクト
 */
export function GoogleCalender(accessToken: string, refreshToken: string) {
    // Google OAuthへの接続
    const oauth2Client = new google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: "http://localhost:3000/api/auth/callback/google",
    });

    // トークンを設定。
    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly",
    });

    // カレンターオブジェクト生成
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    return calendar;
}
