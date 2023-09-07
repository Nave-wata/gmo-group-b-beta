import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

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
  }, []);
  
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
    <div>
      <h3>日付：{event.start_time}</h3>
    </div>
    <div>
      <h3>イベント名：{event.name}</h3>
    </div>
    <div>
      <h3>ジャンル</h3>
      {event.technologies.map((tech, index) => (
        <p key={index}>{tech}</p>
        ))}
    </div>
    <div>
      <h3>主催者：{event.create_user}</h3>
    </div>
    <div>
      <h3>場所：{event.location}</h3>
    </div>
    <div>
      <h3>最大人数：{event.limitation}</h3>
    </div>
    <div>
      <h3>参加予定人数: {reserveNum.num}</h3>
    </div>
    <div>
      <button onClick={joinEvent}>イベントに参加</button>
    </div>
    </>
  )
}
