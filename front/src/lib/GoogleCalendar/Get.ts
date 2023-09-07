import { GoogleCalender } from "./base";

/**
 * Google Calendar イベント取得
 *
 * @param {string} accessToken Google API アクセストークン
 * @param {string} refreshToken Google API リフレッシュトークン
 * @param {string} calendarId Google Calendar ID
 * @param {string} eventId Google Calendar イベントID
 * @returns Google Calendar イベント取得のレスポンス
 */
export async function getEvent(accessToken: string, refreshToken: string, calendarId: string, eventId: string) {
    const calendar = GoogleCalender(accessToken, refreshToken);

    const result = await calendar.events.get({
        calendarId: calendarId,
        eventId: eventId,
    });

    return result.data;
}
