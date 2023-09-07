import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type Task = {
  "id": number,
  "create_user_id": number,
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
};

type User = {
  "id": number,
  "name": string,
  "email": string,
  "department": string,
  "technologies": string[],
  "created_at": string,
  "edit_at": string,
};

type Num = {
  "num": number,
};

export default function Page() {
    const [tasks, setTasks] = useState<Task[]>([
    {
      "id": 1,
      "create_user_id": 1,
      "name": "モダンフロント勉強会",
      "technologies": [
        "フロントエンド",
        "Vue.js",
        "React.js",
      ],
      "start_time": "2022-02-02 15:00:00",
      "end_time": "2022-02-02 17:00:00",
      "location": "オンライン",
      "description": "これは説明です",
      "limitation": 10,
      "record_url": "hoge.google.com?hogehogehoge",
      "created_at": "2022-02-01 10:00:00",
      "edit_at": "2022-02-01 12:00:00",
    },
    {
      "id": 2,
      "create_user_id": 3,
      "name": "React.js勉強会",
      "technologies": [
        "React.js",
        "フロントエンド",
      ],
      "start_time": "2022-02-05 13:00:00",
      "end_time": "2022-02-05 17:00:00",
      "location": "オンライン",
      "description": "これは説明です",
      "limitation": 20,
      "record_url": "hoge.google.com?hogehogehoge",
      "created_at": "2022-02-01 10:00:00",
      "edit_at": "2022-02-01 12:00:00",
    }
  ]);

  // 現在の予約者数を保持するもの
  const [reserveNum, setReserveNum] = useState<Num[]>([
    {
      "num": 10,
    },
    {
      "num": 15,
    }]);

  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data)
      tasks.map(async (task: Task) => {
        const response = await fetch(`/api/event/${task.id}`);
        const data = await response.json();
        setReserveNum(data);
      });
    };
    fetchTasks();
  }, []);

  const details = async (id: number) => {
    router.push(`/event/${id}`);
  }
  return (
    <>
      <div className=".container mt-4 p-4 container-fluid">
        <div className="">
          <p>usernameさん</p>
          <div className="col-9 d-flex justify-content-between">
            <div className="pb-3">
              <h1 className="border-primary border-start border-3 ps-3">イベント一覧</h1>
            </div>
            <a className="btn btn-warning rounded-pill mt-5" href="/event/new">＋イベントの作成</a>
          </div>
        </div>
        <div className="row justify-content-around">
          <div className="row gy-2 col-9">
            {tasks.map((task: any, index: number) =>
              <div className="btn btn-outline-primary d-flex justify-content-around" onClick={ () => details(task.id) }>
                <div className="col-9">
                  <h1>{task.name}</h1>
                  <h2>{task.start_time}</h2>
                </div>
                <div className="col-3 border-primary border-start pt-3">
                  <h5>参加者 {reserveNum[index].num}/{task.limitation}人</h5>
                  <h5>場所  {task.location}</h5>
                </div>
              </div>
            )}
          </div>
          <div className="row gy-2 col-3">
            <div className="border border-secondary rounded">
              <h3 className="border-bottom border-secondary p-3">フィルター</h3>
              <div className="m-2">
                <p>#フロントエンド</p>
                <p>#バックエンド</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
