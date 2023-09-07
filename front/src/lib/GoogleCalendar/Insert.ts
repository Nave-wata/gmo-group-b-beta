import { EventEntity } from "@/types";
import { GoogleCalender } from "./base";

/**
 * ログイン中のグーグルアカウントのカレンダーにイベントを追加する
 *
 * @param {string} accessToken Google API へのアクセストークン
 * @param {string} refreshToken Google API へのリフレッシュトークン
 * @param {string} calendarId カレンダーの ID
 * @param {EventEntity} event 追加するイベント
 * @returns 追加したイベント
 */
export async function insertEvent(accessToken: string, refreshToken: string, calendarId: string, event: EventEntity) {
    const calendar = GoogleCalender(accessToken, refreshToken);

    const result = await calendar.events.insert({
        calendarId: calendarId,
        requestBody: event,
    });

    return result.data;
}
