import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";

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
        console.log("joined event.");
      } else {
        console.log("cannot join event.")
      }
    } catch (error) {
      console.error("Error", error);
    }
  }

  return (
    <>
      <div className=".container mt-4 p-4 container-fluid">
        <div className="pb-3">
          <h1 className="border-primary border-start border-3 ps-3">イベント詳細確認</h1>
        </div>
        <div className="border border-secondary rounded p-4">
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
            <button className="btn btn-primary btn-lg col-9 mt-4" onClick={joinEvent}>イベントに参加</button>
          </div>
        </div>
        <div className="mt-2">
          <Link href="/home" className="btn btn-outline-secondary">＜戻る</Link>
        </div>
      </div>
    </>
  )
}
