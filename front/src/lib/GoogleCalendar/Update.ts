import { EventEntity } from "@/types";
import { GoogleCalender } from "./base";

/**
 * Google Calendar イベント更新
 *
 * @param {string} accessToken Google API アクセストークン
 * @param {string} refreshToken Google API リフレッシュトークン
 * @param {string} calendarId Google カレンダーID
 * @param {string} eventId Google カレンダーのイベントID
 * @param {EventEntity} event イベントの更新内容
 * @returns 更新したイベント
 */
export async function updateEvent(
    accessToken: string,
    refreshToken: string,
    calendarId: string,
    eventId: string,
    event: EventEntity
) {
    const calendar = GoogleCalender(accessToken, refreshToken);

    const result = await calendar.events.update({
        calendarId: calendarId,
        requestBody: event,
        eventId: eventId,
    });

    return result.data;
}
