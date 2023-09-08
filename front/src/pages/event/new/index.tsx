import React, {use, useEffect, useState} from "react";
import Agreement from "@/components/Agreement";
import Link from "next/link";
import ReactLoading from 'react-loading';
import {recordCalendar} from "@/lib/GoogleCalendarClient/calendarClient";
import RequiredMark from "@/components/RequiredMark";
import { useSession } from "next-auth/react";
import {useRouter} from "next/router";

type Event = {
    "create_user": string,
    "name": string,
    "technologies": string[],
    "start_time": string,
    "end_time": string,
    "location": string,
    "description": string,
    "limitation": number|null,
};

type UserEntity = {
    "id": string,
    "email": string,
    "accessToken": string,
    "refreshToken": string,
};

export default function Page() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<Event>({
        "create_user": "",
        "name": "",
        "technologies": [
            "",
            "",
        ],
        "start_time": "",
        "end_time": "",
        "location": "",
        "description": "",
        "limitation": null,
    });
    // sample default value
    // "create_user": "1",
    //         "name": "Vue.js勉強会",
    //         "technologies": [
    //             "フロントエンド",
    //             "Vue.js",
    //         ],
    //         "start_time": "2024-02-02 17:00",
    //         "end_time": "2024-02-02 19:00",
    //         "location": "オンライン",
    //         "description": "Let's study Vue.js!!!",
    //         "limitation": 20,

    //   const [formData, setFormData] = useState<Event>({
    //   "create_user": "",
    //   "name": "",
    //   "technologies": [""],
    //   "start_time": "",
    //   "end_time": "",
    //   "location": "",
    //   "description": "",
    //   "limitation": 0,
    //   "record_url": "",
    // });
    const URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:40000";
    const { data: session } = useSession();
    
    useEffect(() => {
        const user = session?.user as UserEntity;
       const userId = user.id;
    setFormData({
        ...formData,
        create_user: user.id
    })
   },[session?.user]) 
    
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    };
    
    const handleTechChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newTech = [...formData.technologies]
        newTech[index] = e.target.value;
        setFormData({...formData, technologies: newTech })
    };

    const submitEventInfo = async () => {

        const convertedStartDate = new Date(formData.start_time.replace(' ', 'T'));
        const convertedEndDate = new Date(formData.end_time.replace(' ', 'T'));
        // Google Calendar APIにアクセス
        const getCalendarId: string = recordCalendar(formData.name, formData.location, formData.description, convertedStartDate, convertedEndDate);

        if (getCalendarId === "") {
            // カレンダーの作成に失敗した場合
            if (process.env.NODE_ENV !== "production") console.log("Failed to create calendar.")
        }
        try {
            const response = await fetch(`${URL}/api/event`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData),
            });
            console.log(JSON.stringify(formData));
            if (response.ok) {
                if (process.env.NODE_ENV !== "production") console.log(response);
            } else {
                console.log("jdaslkfjlpads");
                if (process.env.NODE_ENV !== "production") console.log("form data is not submitted")
                if (process.env.NODE_ENV !== "production") console.log(formData);
            }
        } catch (error) {
            if (process.env.NODE_ENV !== "production") console.error("Error", error);
        }

        await router.push("/home");
    };

    const addTags = async () => {
        setFormData({...formData, technologies: [...formData.technologies, ""]});
    }

    const removeTags = (index: number) => {
        const newFormData = {...formData};
        newFormData.technologies.splice(index, 1);
        setFormData(newFormData);
    }

    const validate = () => {
        // 入力がないところをはじく。過去の日付を受け付けないようにする。

        let lackArray = [];
        let errorArray = [];
        if (formData.name === "") {
            lackArray.push("イベント名");
        }
        if (formData.technologies.length === 0) {
            lackArray.push("技術ラベル");
        }
        if(formData.location=== ""){
            lackArray.push("場所");
        }
        let isStartDateExist: boolean = false;
        let isEndDateExist: boolean = false;


        if (formData.start_time === "") {
            lackArray.push("開始時刻");
        } else {
            isStartDateExist = true;
            const startDate = new Date(formData.end_time.replace(' ', 'T'))
            const currentDate = new Date()
            if (startDate < currentDate) {
                errorArray.push("startDateが過去の日付です");
            }
        }
        if (formData.end_time === "") {
            lackArray.push("終了時刻");
        } else {
            isEndDateExist = true;
            const startDate = new Date(formData.end_time.replace(' ', 'T'))
            const currentDate = new Date()
            if (startDate < currentDate) {
                errorArray.push("endDateが過去の日付です");
            }
        }

        if (isStartDateExist && isEndDateExist) {
            if (formData.start_time > formData.end_time) {
                errorArray.push("startDateがendDateより後の日付です");
            }
        }

        if (lackArray.length > 0) {
            errorArray.push(lackArray.join(",") + "が入力されていません");
        }
        // 問題がないのはエラーの配列に一つも入っていないとき
        if (errorArray.length > 0) {
            window.alert(errorArray.join("\n"));
            return false;
        } else {
            return true;
        }

    }


    return (
        <>
            <div>
                <div className=".container mt-5 container-fluid">
                    <div className="mx-4">
                        <div className="pb-5">
                            <h1 className="border-primary border-start border-3 ps-3">イベント作成</h1>
                        </div>
                        <div className="">
                            <label className="form-label d-flex justify-content-around mb-3">
                                <p className="col-3 ps-3">イベント名<RequiredMark/></p>
                                <input className="form-control" type="text" name="name" value={formData.name}
                                       onChange={handleChange}
                                       required/>
                            </label>

                        </div>
                        <div className="border-2 border-top">
                            {formData.technologies.map((tech, index) => (
                                <div key={index} className="">
                                    <label className="form-label d-flex justify-content-around m-2">
                                        <p className="col-3 ps-2">技術ラベル{index + 1} </p>
                                        <input className="form-control me-1" type="text" name={`technologies[${index}]`}
                                               value={tech}
                                               onChange={(e) => handleTechChange(e, index)} required/>
                                        <button className="col-3 btn btn-secondary" type="button"
                                                onClick={() => removeTags(index)}>タグの削除
                                        </button>
                                    </label>
                                    {/* <div className="col-1"></div> */}

                                </div>
                            ))}
                            <RequiredMark/>
                            <div className="d-flex justify-content-around mb-3">
                                <div className="col-3"></div>
                                <button className="col-9 btn btn-warning rounded-pill" type="button"
                                        onClick={addTags}>＋新しいタグの追加
                                </button>
                            </div>
                        </div>
                        <div className=" border-2 border-top">
                            <div className="">
                                <label className="d-flex justify-content-around my-3">
                                    <p className="col-3 ps-3">開始時刻<RequiredMark/></p>
                                    <input className="form-control" type="datetime-local" name="start_time"
                                           value={formData.start_time}
                                           onChange={handleChange} required/>
                                </label>
                            </div>
                            <div className="">
                                <label className="d-flex justify-content-around mb-3">
                                    <p className="col-3 ps-3">終了時刻<RequiredMark/></p>
                                    <input className="form-control" type="datetime-local" name="end_time"
                                           value={formData.end_time}
                                           onChange={handleChange} required/>
                                </label>

                            </div>
                            <div className="">
                                <label className="form-label d-flex justify-content-around mb-3">
                                    <p className="col-3 ps-3">場所<RequiredMark/></p>
                                    <input className="form-control" type="text" name="location"
                                           value={formData.location}
                                           onChange={handleChange} required/>
                                </label>
                            </div>

                            {/* <div className="d-flex justify-content-around mb-3">
              <label className="col-3 ps-3">参加可能人数</label>
              <input className="col-9" type="number" name="limitation" value={formData.limitation}
                onChange={handleChange} required />
            </div> */}

                            {/* <input className="form-control" type="text" placeholder="Default input" aria-label="default input example"></input> */}

                            <div className="">
                                <label className="form-label d-flex mb-3 justify-content-between">
                                    <p className="col-3 ps-3">定員</p>
                                    <input className="form-control" type="number" name="limitation"
                                           placeholder="Default input" aria-label="default input example"
                                           onChange={handleChange} required></input>
                                </label>
                            </div>
                            {/* <div className="d-flex justify-content-around mb-3">
              <label className="col-3 ps-3">イベントの説明</label>
              <textarea className="col-9" name="description" value={formData.description} cols={40}
                rows={5} onChange={handleChange} required></textarea>
            </div> */}

                            <div className="">
                                <label htmlFor="exampleFormControlTextarea1"
                                       className="form-label d-flex mb-3 justify-content-between">
                                    <p className="col-3 ps-3">イベントの説明</p>
                                    <textarea className="form-control" name="description"
                                              id="exampleFormControlTextarea1" value={formData.description}
                                              rows={5} onChange={handleChange} required></textarea>
                                </label>
                                {/* <label>部署：<input type="text" value={inputValue.department} onChange={(e) => handleDepartmentChange(e)} /></label> */}

                            </div>
                        </div>
                        <div className="mb-3 d-flex justify-content-around">
                            <div className="mt-4">
                                <Link href="/home" className="btn btn-outline-secondary">＜戻る</Link>
                            </div>
                            <button className="btn btn-primary col-9 mt-4" type="submit" onClick={() => {
                                const result = validate();
                                if (result) {
                                    setIsChecking(true);
                                }
                            }}>作成
                            </button>
                        </div>
                    </div>
                </div>
                {isChecking && (
                    <Agreement content={"イベントを作成しますか？"}
                               handleOnAgree={async () => {

                                   setIsLoading(true);
                                   await submitEventInfo();
                                   setIsLoading(false);

                                   setIsChecking(false);
                               }}
                               handleOnDisagree={() => {
                                   setIsChecking(false);
                               }}/>)}

            </div>
            {isLoading && <ReactLoading type={"spin"} color={"#000000"} height={667} width={375}/>}
        </>
    )
}
