import { insertEvent } from "@/lib/GoogleCalendar";
import { options } from "@/lib/options";
import { UserEntity } from "@/types";
import { empty, isEventEntity } from "@/utils/isType";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";

/**
 * /api/google/calendars/[calendarId]/events へのリクエストに対する処理
 *
 * パスパラメータの calendarId が空もしくは string 以外の場合 400
 * リクエストボディの event が空もしくは EventEntity 以外の場合 400
 *
 * ログインしていない場合 401
 *
 * POST 以外のメソッドの場合 405
 *
 * @param {NextApiRequest} req リクエスト
 * @param {NextApiResponse} res レスポンス
 * @returns
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, options);
    const user = session?.user as UserEntity;
    const calendarId = req.query.calendarId;
    const event = req.body;

    // 不正値のリクエストを弾く
    if (empty(event) || empty(calendarId) || typeof calendarId !== "string" || !isEventEntity(event)) {
        res.statusCode = 400;
        res.json({ event: event, calendarId: calendarId });
        res.end();
        return;
    }

    // ログインしていない場合は弾く
    if (!session) {
        res.statusCode = 401;
        res.end();
        return;
    }

    // POST メソッド以外は弾く
    if (req.method !== "POST") {
        res.statusCode = 405;
        res.end();
        return;
    }

    // Google カレンダーにイベントの追加を実行
    const result = await insertEvent(user.accessToken, user.refreshToken, calendarId, event);

    res.json(JSON.stringify(result));
    res.end();

    return;
}
