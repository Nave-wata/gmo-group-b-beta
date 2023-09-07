import { deleteEvent, getEvent, insertEvent, updateEvent } from "@/lib/GoogleCalendar";
import { options } from "@/lib/options";
import { UserEntity, EventEntity } from "@/types";
import { empty, isEventEntity } from "@/utils/isType";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";

/**
 * /api/google/calendars/[calendarId]/events/[eventId] へのリクエストに対する処理
 *
 * パスパラメータの calendarId, eventId が空もしくは string 以外の場合 400
 *
 * ログインしていない場合 401
 *
 * POST メソッドの場合 405
 *
 * GET メソッドの場合はイベントを取得
 *
 * PUT メソッドの場合はイベントを更新
 *  リクエストボディの event が空もしくは EventEntity 以外の場合 400
 *
 * DELETE メソッドの場合はイベントを削除
 *
 * @param {NextApiRequest} req リクエスト
 * @param {NextApiResponse} res レスポンス
 * @returns
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, options);
    const user = session?.user as UserEntity;
    const { calendarId, eventId } = req.query;

    // 不正値のリクエストを弾く
    if (empty(calendarId) || empty(eventId) || typeof calendarId !== "string" || typeof eventId !== "string") {
        res.statusCode = 400;
        res.end();
        return;
    }

    // ログインしていない場合は弾く
    if (!session) {
        res.statusCode = 401;
        res.end();
        return;
    }

    // POST の場合は 404
    if (req.method === "POST") {
        res.statusCode = 405;
        res.end();
        return;
    }

    // GET の場合はイベントを取得
    if (req.method === "GET") {
        const result = await getEvent(user.accessToken, user.refreshToken, calendarId, eventId);

        res.json(JSON.stringify(result));
        res.end();

        return;
    }

    // PUT の場合はイベントを更新
    if (req.method === "PUT") {
        const event = req.body;

        // 不正値のリクエストを弾く
        if (empty(event) || !isEventEntity(event)) {
            res.statusCode = 400;
            res.end();
            return;
        }

        // Google カレンダーにイベントの追加を実行
        const result = await updateEvent(user.accessToken, user.refreshToken, calendarId, eventId, event);

        res.json(JSON.stringify(result));
        res.end();

        return;
    }

    // DELETE の場合はイベントを削除
    if (req.method === "DELETE") {
        const result = await deleteEvent(user.accessToken, user.refreshToken, calendarId, eventId);

        res.json(JSON.stringify(result));
        res.end();

        return;
    }
}
