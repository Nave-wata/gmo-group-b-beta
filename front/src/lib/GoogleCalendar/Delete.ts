import { GoogleCalender } from "./base";

/**
 * Google Calendar イベント削除
 *
 * @param {string} accessToken Google API アクセストークン
 * @param {string} refreshToken Google API リフレッシュトークン
 * @param {string} eventId Google Calendar イベントID
 * @returns Google Calendar イベント削除のレスポンス
 */
export async function deleteEvent(accessToken: string, refreshToken: string, calendarId: string, eventId: string) {
    const calendar = GoogleCalender(accessToken, refreshToken);

    const result = await calendar.events.delete({
        calendarId: calendarId,
        eventId: eventId,
    });

    return result.data;
}
