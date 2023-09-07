import axios from "axios";

type recordCalendarType = {
    summary: string,
    location: string,
    description: string,
    startDate: Date,
    endDate: Date,
}

// 成功したらイベントIDを返す。失敗したら「」(空文字)を返す。
export function recordCalendar(summary: string, location: string, description: string, startDate: Date, endDate: Date): string {
    const reformattedStartDate = formatDateToCustomString(startDate);
    const reformattedEndDate = formatDateToCustomString(endDate);
    let result = "";

    axios.post(
        "/api/google/calendars/primary/events",
        {
            summary: summary, //　タイトル
            location: location, // 場所
            description: description, // 詳細
            start: { // 開始
                // date: "2023-09-05" 数日間にわたるイベント用・未定義可・dateTimeとどちらかはおそらく必要
                dateTime: reformattedStartDate,　// 未定義可・dateとどちらかはおそらく必要
                timeZone: "Asia/Tokyo", // 未定義可・ほとんど検証してない
            },
            end: { // 終了
                // date: "2023-09-07" 数日間にわたるイベント用・未定義可・dateTimeとどちらかはおそらく必要（この場合 2023-09-5~6日 7日は含まれない）
                dateTime: reformattedEndDate, // 未定義可・dateとどちらかはおそらく必要
                timeZone: "Asia/Tokyo", // 未定義可・ほとんど検証してない
            },
        }
    )
        .then((res) => {
            // debug
            if (process.env.NODE_ENV !== "production") console.log(res.data) // 上のイベント例がレスポンス;

            const responseObject = JSON.parse(res.data);
            result = responseObject.id;
        })
        .catch((err) => {
            if (process.env.NODE_ENV !== "production") console.log(err);
        });

    return result;
}

function formatDateToCustomString(date: Date): string {
    // ゼロを前に付ける関数
    const pad = (n: number): string => n < 10 ? `0${n}` : `${n}`;

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);  // 月は0から始まるので+1する
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    // +09:00は固定と仮定する(タイムゾーン)
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`;
}