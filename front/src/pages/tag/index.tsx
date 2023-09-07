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

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setTag({...tag, "name": value})
    };

    const URL = "http://localhost:40000";

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
        <form onClick={submitTagInfo}>
        <label>
            <input type="text" value={tag.name} onChange={handleChange}/>
        </label>
        <button type="submit">送信</button>
        </form>
    )
}