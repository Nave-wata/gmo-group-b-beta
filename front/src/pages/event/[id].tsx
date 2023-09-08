import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {recordCalendar} from "@/lib/GoogleCalendarClient/calendarClient";
import axios from "axios";

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-calendar2-date-fill" viewBox="0 0 16 16">
        <path
            d="M9.402 10.246c.625 0 1.184-.484 1.184-1.18 0-.832-.527-1.23-1.16-1.23-.586 0-1.168.387-1.168 1.21 0 .817.543 1.2 1.144 1.2z"/>
        <path
            d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zm9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5zm-4.118 9.79c1.258 0 2-1.067 2-2.872 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684c.047.64.594 1.406 1.703 1.406zm-2.89-5.435h-.633A12.6 12.6 0 0 0 4.5 8.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675V7.354z"/>
    </svg>
)

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill"
         viewBox="0 0 16 16">
        <path
            d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
    </svg>
)

type Event = {
    "id": number,
    "name": string,
    "event_technologies": [
        {
            "id": number,
            "created_at": string,
            "edit_at": string,
            "technology": {
                "id": number,
                "name": string,
                "created_at": string,
                "edit_at": string
            }
        }
    ],
    "start_time": string,
    "end_time": string,
    "location": string,
    "description": string,
    "limitation": number,
    "record_url": string,
    "created_at": string,
    "edit_at": string,
    "google_calender_event_id": string,
    "user": {
        "id": number,
        "name": string,
        "email": string,
        "department": string,
        "token": string,
        "created_at": string,
        "edit_at": string
    }
}

type Joiner = {
    "id": number,
    "name": string,
    "users": any[],
}

export default function Page() {
    const [isCalendarBtnHover, setIsCalendarBtnHover] = useState<boolean>(false);
    const [isDeleteBtnHover, setIsDeleteBtnHover] = useState<boolean>(false);

    const handleCalendarBtnEnter = () => {
        setIsCalendarBtnHover(true);
    }
    const handleCalendarBtnLeave = () => {
        setIsCalendarBtnHover(false);
    }


    const [event, setEvent] = useState<Event>({
        "description": "Let's study Vue.js!!!",
        "limitation": 20,
        "record_url": "aaaa@bbbb",
        "id": 1,
        "name": "dummy",
        "start_time": "2024-02-02T08:00:00.000Z",
        "end_time": "2024-02-02T10:00:00.000Z",
        "location": "オンライン",
        "google_calender_event_id": "test",
        "created_at": "2023-09-08T01:35:27.367Z",
        "edit_at": "2023-09-08T01:35:27.367Z",
        "user": {
            "id": 1,
            "name": "reiya",
            "email": "reiya4742@gmail.com",
            "department": "none",
            "token": "112413653104775313391",
            "created_at": "2023-09-08T01:34:54.579Z",
            "edit_at": "2023-09-08T01:34:54.579Z"
        },
        "event_technologies": [
            {
                "id": 1,
                "created_at": "2023-09-08T01:35:27.373Z",
                "edit_at": "2023-09-08T01:35:27.373Z",
                "technology": {
                    "id": 1,
                    "name": "Vue.js",
                    "created_at": "2023-09-08T01:35:03.116Z",
                    "edit_at": "2023-09-08T01:35:03.116Z"
                }
            }
        ]
    });
    // 現在の予約者数を保持するもの
    const [reserveNum, setReserveNum] = useState({
        "remaining": 15,
    });

    const [joiner, setJoiner] = useState<Joiner>({
        "id": 1,
        "name": "hello world",
        "users": [
            {}
        ]
    })

    const router = useRouter();
    const URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:40000";

    useEffect(() => {
        if (router.isReady) {
            const eventId = router.query.id;

            axios.get(`${URL}/api/event/${eventId}`)
                .then((res) => res.data)
                .then((data) => setEvent(data))
                .catch((e) => console.error("ERROR", e));

            axios.get(`${URL}/api/event/${eventId}/remaining`)
                .then((res) => res.data)
                .then((data) => setReserveNum(data))
                .catch((e) => console.error("ERROR", e));

            axios.get(`${URL}/api/user/event/${eventId}`)
                .then((res) => res.data)
                .then((data) => setJoiner(data))
                .catch((e) => console.error("ERROR", e));
        }
    }, [router, URL]);

    const joinEvent = async () => {
        try {
            const response = await fetch(`/api/joinEvent/${event.id}`, {
                method: "POST",
            });

            if (response.ok) {
                if (process.env.NODE_ENV !== "production") console.log("joined event.");
            } else {
                if (process.env.NODE_ENV !== "production") console.log("cannot join event.")
            }
        } catch (error) {
            if (process.env.NODE_ENV !== "production") console.error("Error", error);
        }
    }

    const onCalendarBtnClick = () => {
        if (process.env.NODE_ENV !== "production") console.log("カレンダーに追加する");

        const convertedStartDate = new Date(event.start_time.replace(' ', 'T'));
        const convertedEndDate = new Date(event.end_time.replace(' ', 'T'));
        // Google Calendar APIにアクセス
        const getCalendarId: string = recordCalendar(event.name, event.location, event.description, convertedStartDate, convertedEndDate);
        window.alert("追加しました");
        if (process.env.NODE_ENV !== "production") console.log("Event ID → " + getCalendarId);
    }

    const onDeleteBtnClick = async () => {
        if (process.env.NODE_ENV !== "production") console.log("カレンダーに追加する");

        const eventId = router.query.id;
        await axios.delete(`${URL}/api/event/${eventId}`);
        await router.push("/home");
    }

    return (
        <>
            <div className=".container mt-5 p-4 container-fluid">
                <div className="mx-4">
                    <div className="pb-3">
                        <h1 className="border-primary border-start border-3 ps-3">イベント詳細確認</h1>
                    </div>
                    <div className="border border-secondary rounded p-4" style={{position: "relative"}}>
                        <div className="row d-flex justify-content-around">
                            <h3 className="col-3 ps-5 ">日付</h3>
                            <h3 className="col-6">{event.start_time}</h3>
                        </div>
                        <div className="row d-flex justify-content-around">
                            <h3 className="col-3 ps-5">イベント名</h3>
                            <h3 className="col-6">{event.name}</h3>
                        </div>
                        <div className="row d-flex justify-content-around">
                            <h3 className="col-3 ps-5">ジャンル</h3>
                            <div className="col-6 mb-2">
                                {event.event_technologies.map((tech, index) => (
                                    <p className="mb-0" key={index}>{tech.technology.name}</p>
                                ))}
                            </div>
                        </div>
                        <div className="row d-flex justify-content-around">
                            <h3 className="col-3 ps-5">主催者</h3>
                            <h3 className="col-6">{event.user.name}</h3>
                        </div>
                        <div className="row d-flex justify-content-around">
                            <h3 className="col-3 ps-5">場所</h3>
                            <h3 className="col-6">{event.location}</h3>
                        </div>
                        <div className="row d-flex justify-content-around">
                            <h3 className="col-3 ps-5">定員</h3>
                            <h3 className="col-6">{event.limitation}</h3>
                        </div>
                        <div className="row d-flex justify-content-around">
                            <h3 className="col-3 ps-5">参加予定人数</h3>
                            <h3 className="col-6">{reserveNum.remaining}</h3>
                        </div>
                        <div className="d-flex justify-content-around">
                            <button className="btn btn-primary btn-lg col-9 mt-4" onClick={joinEvent}>
                                イベントに参加
                            </button>
                        </div>
                        <div style={{position: "absolute", top: 5, right: 5, display: "flex", flexDirection: "column"}}>
                            <div
                                style={{marginBottom: 5, padding: 5, justifyContent: "center", display: "inline-flex", borderRadius: 5, border: "solid 1px black", color: isCalendarBtnHover ? "white" : "gray", backgroundColor: isCalendarBtnHover ? "gray" : "white"}}
                                onMouseEnter={handleCalendarBtnEnter} onMouseLeave={handleCalendarBtnLeave}
                                onClick={onCalendarBtnClick}>
                                <div style={{display: "inline-block", marginRight: "0.5rem"}}>カレンダーに追加する</div>
                                <div style={{position: "relative", bottom: 3}}>
                                    <CalendarIcon/>
                                </div>
                            </div>
                            <div
                                style={{padding: 5, justifyContent: "center", display: "inline-flex", borderRadius: 5, border: "solid 1px black", color: isDeleteBtnHover ? "white" : "gray", backgroundColor: isDeleteBtnHover ? "gray" : "white"}}
                                onMouseEnter={() => {
                                    setIsDeleteBtnHover(true);
                                }} onMouseLeave={() => {
                                setIsDeleteBtnHover(false);
                            }}
                                onClick={onDeleteBtnClick}>
                                <div style={{display: "inline-block", marginRight: "0.5rem"}}>勉強会を削除する</div>
                                <div style={{position: "relative", bottom: 3}}>
                                    <TrashIcon/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <Link href="/home" className="btn btn-outline-secondary">＜戻る</Link>
                    </div>
                </div>
            </div>
        </>
    )
}
