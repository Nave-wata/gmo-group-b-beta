import React, {useState} from "react";
import Agreement from "@/components/Agreement";
import Link from "next/link";
import ReactLoading from 'react-loading';
import axios from "axios";

type Tag = {
    "name": string,
};

export default function Page() {
    const [tag, setTag] = useState<Tag>({
        "name": ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setTag({...tag, "name": value})
    };

    const URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:40000";

    const submitTagInfo = async () => {
        axios.post(`${URL}/api/tag`,
        tag,
        {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then((res) => console.log(res))
        .catch((e) => console.error("ERROR",e));
    }
    
    return (
        <>
        <Link href="/home" className="mx-3 mt-3 btn btn-outline-secondary">＜戻る</Link>
        <form onClick={submitTagInfo}>
        <label className="form-label d-flex justify-content-aroud m-2">
            <p className="col-1 pt-2">新しいタグ</p>
            <input className="form-control me-1" type="text" value={tag.name} onChange={handleChange}/>
            <button className="btn btn-primary col-3" type="submit">送信</button>
        </label>
        </form>
        </>
    )
}