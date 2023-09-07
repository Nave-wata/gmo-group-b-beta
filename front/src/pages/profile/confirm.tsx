import { isset } from '../../utils/isType';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Technology, Profile } from '.';
import { GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { useSession } from 'next-auth/react';
// import { UserEntity } from '@/types';

type UserEntity = {
    "id": string,
    "email": string,
    "accessToken": string,
    "refreshToken": string,
};

/**
 * サーバサイドの処理
 * 
 * @param {GetServerSidePropsContext} context リクエストやレスポンス
 * @returns 
 */
export function getServerSideProps(context: GetServerSidePropsContext) {
    const referer = context.req.headers.referer ?? "";

    // プロフィールページ以外からのアクセスは不可
    if (referer.match(/profile$/g) === null) {
        return {
            notFound: true
        }
    }

    return {
        props: {}
    }
}

/**
 * 入力されたプロフィールを確認
 * @returns 
 */
export default function Page() {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile>({
        name: "",
        email: "",
        department: "",
        technologies: [{
            name: "",
            // age: ""
        }]
    });
    const URL = "http://localhost:40000";
    const { data: session } = useSession();
    const user = session?.user as UserEntity;

    /**
     * 戻るボタンのクリックイベント
     */
    const handleBack = () => {
        router.back();
    }

    /**
     * 決定ボタンのクリックイベント
     * 
     * セッション内から profile を削除する
     */
    const handleSubmit = () => {
        sessionStorage.removeItem("profile");
        // console.log(profile);
        const userId = user.id;
        axios.patch(`${URL}/api/user/${userId}`,
        profile,
        {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then((res) => {
            console.log(res);
            router.push("/home");
        })
        .catch((e) => console.error("ERROR", e));
    }

    /**
     * セッション内にプロフィールがあれば取得する
     */
    useEffect(() => {
        // const item = sessionStorage.getItem("profile");
        // if (item) setProfile(JSON.parse(item));
    }, []);

    /**
     * プロフィールがなければ何も表示しない
     */
    if (!profile) {
        return <></>
    }

    return (
        <div>
            <h1>プロフィール</h1>
            <div>名前: {isset(profile.name) ? profile.name : "--"}</div>
            <div>部署: {isset(profile.department) ? profile.department : "--"}</div>
            <div>保有技術: {isset(profile.technologies) ? profile.technologies.map((v: Technology, i: number) => (
                <div key={i}>
                    <div>名前: {v.name}</div>
                    {/* <div>年齢: {v.age}</div> */}
                </div>
            )) : "--"}</div>
            <button onClick={() => handleBack()}>戻る</button>
            <button onClick={() => handleSubmit()}>決定</button>
        </div>
    )
}
