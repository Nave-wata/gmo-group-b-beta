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
        token: "",
        technologies: [{
            name: "",
            // age: ""
        }]
    });
    const URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:40000";
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
        const updateProfile = {
            ...profile,
            "token": user.id,
        };
        setProfile(updateProfile);

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
        const item = sessionStorage.getItem("profile");
        if (item) setProfile(JSON.parse(item));
    }, []);

    /**
     * プロフィールがなければ何も表示しない
     */
    if (!profile) {
        return <></>
    }

    return (
        <div className='.container mt-5 p-4 container-fluid border w-75 shadow rounded'>
            <div className="border-primary border-start border-3 ps-3">
                <h1 className="m-0">プロフィール</h1>
                <p className="mb-4">Profile</p>
            </div>
            <div className='row d-flex justify-content-evenly'>
                <h3 className='col-3 ps-5'>名前:</h3>
                <h3 className='col-4'>{isset(profile.name) ? profile.name : "--"}</h3>
            </div>
            <div className='row d-flex justify-content-evenly'>
                <h3 className='col-3 ps-5'>部署:</h3><h3 className='col-4'>{isset(profile.department) ? profile.department : "--"}</h3>
            </div>
            <div className='row d-flex justify-content-evenly'>
                <h3 className='col-3 ps-5'>保有技術:</h3>
                <div className='col-4'>
                    {isset(profile.technologies) ? profile.technologies.map((v: Technology, i: number) => (
                        <p key={i} className='mb-0'>{v.name}</p>
                    )) : "--"}
                </div>
            </div>
            <div className="m-2 mt-4 d-flex justify-content-evenly">
                <div className="col-6 me-1">
                    <button className="col-12 btn btn-outline-secondary" onClick={() => handleBack()}>戻る</button>
                </div>
                <button className="btn btn-primary col-6" onClick={() => handleSubmit()}>決定</button>
                
            </div>
        </div>
    )
}
