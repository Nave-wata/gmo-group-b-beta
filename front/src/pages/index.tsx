import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { NextPage } from 'next';
import axios from "axios";

const Login: NextPage = () => {
    // sessionには、以下のような値が入っています。
    // {
    //     "user":{
    //        "name":"John",
    //        "email":"john@examle.com",
    //        "image":"https://lh3.googleusercontent.com/a/AGNmyxZF7jQN_YTYVyxIx5kfdo3kalfRktVD17GrZ9n=s96-c"
    //     },
    //     "expires":"2023-04-01T00:29:51.016Z"
    // }
    const { data: session } = useSession();
    const handleOnClick = () => {
        axios.post(
            "/api/google/calendars/primary/events",
            {
                summary: "summary", //　タイトル
                location: "location", // 場所
                description: "description", // 詳細
                start: { // 開始
                    // date: "2023-09-05" 数日間にわたるイベント用・未定義可・dateTimeとどちらかはおそらく必要
                    dateTime: "2023-09-05T20:00:00+09:00",　// 未定義可・dateとどちらかはおそらく必要
                    timeZone: "Asia/Tokyo", // 未定義可・ほとんど検証してない
                },
                end: { // 終了
                    // date: "2023-09-07" 数日間にわたるイベント用・未定義可・dateTimeとどちらかはおそらく必要（この場合 2023-09-5~6日 7日は含まれない）
                    dateTime: "2023-09-05T21:00:00+09:00", // 未定義可・dateとどちらかはおそらく必要
                    timeZone: "Asia/Tokyo", // 未定義可・ほとんど検証してない
                },
            }
        )
            .then((res) => {
                if (process.env.NODE_ENV !== "production") console.log(res.data) // 上のイベント例がレスポンス;
            })
            .catch((err) => {
                if (process.env.NODE_ENV !== "production") console.log(err);
            });
    }

    return (
        <>
            {
                // セッションがある場合、ログアウトを表示
                session && (
                    <div>
                        <h1>ようこそ, {session.user && session.user.email}</h1>
                        <button onClick={() => signOut()}>ログアウト</button>
                        <button onClick={handleOnClick}>イベント作成</button>
                    </div>
                )
            }
            {
                // セッションがない場合、ログインを表示
                // ログインボタンを押すと、ログインページに遷移する
                !session && (
                    <div>
                        <p>ログインしていません</p>
                        <button onClick={() => signIn()}>ログイン</button>
                    </div>
                )
            }
        </>
    );
};

export default Login;