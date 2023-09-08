import React, { useEffect, useState } from "react";
import Agreement from "@/components/Agreement";
import Link from "next/link";
import ReactLoading from 'react-loading';
import axios from "axios";
import { empty } from "@/utils/isType";

type Tag = {
    "name": string,
};

export default function Page() {
    const [tag, setTag] = useState<Tag>({
        "name": ""
    });
    const [savedTag, setSavedTag] = useState<Tag[]>([]);

    const URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:40000";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTag({ ...tag, "name": value })
    };

    useEffect(() => {
        axios.get(`${URL}/api/tag`)
            .then((res) => res.data)
            .then((data) => setSavedTag(data))
            .catch((e) => null);
    });

    const submitTagInfo = async () => {
        if (empty(tag.name)) return;
        if (savedTag.some((v) => v.name === tag.name)) {
            setTag({
                "name": ""
            });
            return;
        };

        axios.post(`${URL}/api/tag`,
            tag,
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })
            .then((res) => {
                console.log(res);
                setTag({
                    "name": ""
                })
            })
            .catch((e) => console.error("ERROR", e));
    }

    return (
        <>
            <div className=".container mt-5 container-fluid">
                <div className="m-4">
                    <label className="form-label d-flex justify-content-around px-3 mt-3">
                        <p className="col-3">新しいタグ</p>
                        <input className="form-control me-1" type="text" value={tag.name} onChange={handleChange} />
                    </label>

                    <div className="m-2 d-flex justify-content-around">
                        <div className="mt-4 col-6 me-1">
                            <Link href="/home" className="col-12 mt-4 btn btn-outline-secondary">＜ 戻る</Link>
                        </div>
                        <button className="mt-5 btn btn-primary col-6" onClick={submitTagInfo}>送信</button>
                    </div>
                </div>
            </div>
        </>
    )
}