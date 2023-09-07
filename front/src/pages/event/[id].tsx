import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {recordCalendar} from "@/lib/GoogleCalendarClient/calendarClient";

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-calendar2-date-fill" viewBox="0 0 16 16">
        <path
            d="M9.402 10.246c.625 0 1.184-.484 1.184-1.18 0-.832-.527-1.23-1.16-1.23-.586 0-1.168.387-1.168 1.21 0 .817.543 1.2 1.144 1.2z"/>
        <path
            d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zm9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5zm-4.118 9.79c1.258 0 2-1.067 2-2.872 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684c.047.64.594 1.406 1.703 1.406zm-2.89-5.435h-.633A12.6 12.6 0 0 0 4.5 8.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675V7.354z"/>
    </svg>
)

type Event = {
    "id": number,
    "create_user": string,
    "name": string,
    "technologies": string[],
    "start_time": string,
    "end_time": string,
    "location": string,
    "description": string,
    "limitation": number,
    "record_url": string,
    "created_at": string,
    "edit_at": string,
}

export default function Page() {
    const [isCalendarBtnHover, setIsCalendarBtnHover] = useState<boolean>(false);
    const handleCalendarBtnEnter = () => {
        setIsCalendarBtnHover(true);
    }
    const handleCalendarBtnLeave = () => {
        setIsCalendarBtnHover(false);
    }


    const [event, setEvent] = useState<Event>({
        "id": 1,
        "create_user": "Taro",
        "name": "Vue.js勉強会",
        "technologies": [
            "フロントエンド",
            "Vue.js",
        ],
        "start_time": "2022-02-02 17:00",
        "end_time": "2022-02-02 19:00",
        "location": "オンライン",
        "description": "Let's study Vue.js!!!",
        "limitation": 20,
        "record_url": "hoge.google.com?hogehogehoge",
        "created_at": "2022-02-01 10:00",
        "edit_at": "2022-02-01 12:00",
    });
    // 現在の予約者数を保持するもの
    const [reserveNum, setReserveNum] = useState({
        "num": 15,
    });

    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            const eventId = router.query.id;
            const fetchEvent = async () => {
                const response = await fetch(`/api/event/${eventId}`);
                const data = await response.json();
                setEvent(data);
            };
            const fetchReserveNum = async () => {
                const response = await fetch(`/api/reserver/${eventId}`)
                const data = await response.json();
                setReserveNum(data);
            }
            fetchEvent();
            fetchReserveNum();
        }
    }, [router]);

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
        if (process.env.NODE_ENV !== "production") console.log("Event ID → "+getCalendarId);
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
                                {event.technologies.map((tech, index) => (
                                    <p className="mb-0" key={index}>{tech}</p>
                                ))}
                            </div>
                        </div>
                        <div className="row d-flex justify-content-around">
                            <h3 className="col-3 ps-5">主催者</h3>
                            <h3 className="col-6">{event.create_user}</h3>
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
                            <h3 className="col-6">{reserveNum.num}</h3>
                        </div>
                        <div className="d-flex justify-content-around">
                            <button className="btn btn-primary btn-lg col-9 mt-4" onClick={joinEvent}>イベントに参加
                            </button>
                        </div>
                        <div
                            style={{padding: 5, justifyContent: "center", display: "inline-flex", borderRadius: 5, border: "solid 1px black", color: isCalendarBtnHover ? "white" : "gray", backgroundColor: isCalendarBtnHover ? "gray" : "white", position: "absolute", top: 5, right: 5}}
                            onMouseEnter={handleCalendarBtnEnter} onMouseLeave={handleCalendarBtnLeave} onClick={onCalendarBtnClick}>
                            <div style={{display: "inline-block", marginRight: "0.5rem"}}>カレンダーに追加する</div>
                            <div style={{position: "relative", bottom: 3}}>
                                <CalendarIcon/>
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
