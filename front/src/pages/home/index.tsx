import {isset} from "@/utils/isType";
import axios from "axios";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";

type Task = {
    "description": string,
    "limitation": number,
    "record_url": string,
    "id": number,
    "name": string,
    "start_time": string,
    "end_time": string,
    "location": string,
    "google_calender_event_id": string,
    "created_at": string,
    "edit_at": string,
    "user": {
        "id": number
        "name": string,
        "email": string,
        "department": string,
        "token": string,
        "created_at": string,
        "edit_at": string
    },
    "event_technologies": Tech[]
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
    "remaining": number,
};

type Technology = {
    "id": number,
    "name": string,
    "created_at": string,
    "edited_at": string,
};

type Tech = {
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

const dummyTasks: Task[] = [
 {
        "description": "nothing",
        "limitation": 20,
        "record_url": "aa",
        "id": 1,
        "name": "hello",
        "start_time": "2023-09-09T05:04:00.000Z",
        "end_time": "2023-09-09T07:04:00.000Z",
        "location": "kitaQ",
        "google_calender_event_id": "test",
        "created_at": "2023-09-08T04:28:42.447Z",
        "edit_at": "2023-09-08T04:28:42.447Z",
        "user": {
            "id": 1,
            "name": "rei",
            "email": "al;kdsj",
            "department": "asl;dkfj",
            "token": "112413653104775313391",
            "created_at": "2023-09-08T04:28:10.843Z",
            "edit_at": "2023-09-08T04:28:10.843Z"
        },
        "event_technologies": [
            {
                "id": 1,
                "created_at": "2023-09-08T04:28:42.464Z",
                "edit_at": "2023-09-08T04:28:42.464Z",
                "technology": {
                    "id": 1,
                    "name": "Vue.js",
                    "created_at": "2023-09-08T04:23:36.347Z",
                    "edit_at": "2023-09-08T04:23:36.347Z"
                }
            },
        ]
    },
     {
        "description": "nothing",
        "limitation": 20,
        "record_url": "aa",
        "id": 1,
        "name": "hello",
        "start_time": "2023-09-09T05:04:00.000Z",
        "end_time": "2023-09-09T07:04:00.000Z",
        "location": "kitaQ",
        "google_calender_event_id": "test",
        "created_at": "2023-09-08T04:28:42.447Z",
        "edit_at": "2023-09-08T04:28:42.447Z",
        "user": {
            "id": 1,
            "name": "rei",
            "email": "al;kdsj",
            "department": "asl;dkfj",
            "token": "112413653104775313391",
            "created_at": "2023-09-08T04:28:10.843Z",
            "edit_at": "2023-09-08T04:28:10.843Z"
        },
        "event_technologies": [
            {
                "id": 1,
                "created_at": "2023-09-08T04:28:42.464Z",
                "edit_at": "2023-09-08T04:28:42.464Z",
                "technology": {
                    "id": 1,
                    "name": "Vue.js",
                    "created_at": "2023-09-08T04:23:36.347Z",
                    "edit_at": "2023-09-08T04:23:36.347Z"
                }
            },
            {
                "id": 2,
                "created_at": "2023-09-08T04:28:42.469Z",
                "edit_at": "2023-09-08T04:28:42.469Z",
                "technology": {
                    "id": 2,
                    "name": "React.js",
                    "created_at": "2023-09-08T04:23:48.116Z",
                    "edit_at": "2023-09-08T04:23:48.116Z"
                }
            }
        ]
    },
];

const dummyReserveNum: Num = {"remaining": 5}

const dummyTech: Technology[] = [
    {
        "id": 1,
        "name": "フロントエンド",
        "created_at": "2020-10-10 10:00:00",
        "edited_at": "2020-11-11 11:00:00",
    },
    {
        "id": 2,
        "name": "バックエンド",
        "created_at": "2020-10-10 10:00:00",
        "edited_at": "2020-11-11 11:00:00",
    },
    {
        "id": 3,
        "name": "Vue.js",
        "created_at": "2020-10-10 10:00:00",
        "edited_at": "2020-11-11 11:00:00",
    },
    {
        "id": 4,
        "name": "React.js",
        "created_at": "2020-10-10 10:00:00",
        "edited_at": "2020-11-11 11:00:00",
    },
    {
        "id": 5,
        "name": "Next.js",
        "created_at": "2020-10-10 10:00:00",
        "edited_at": "2020-11-11 11:00:00",
    },
    {
        "id": 6,
        "name": "Python",
        "created_at": "2020-10-10 10:00:00",
        "edited_at": "2020-11-11 11:00:00",
    },
];

export default function Page() {
    const {data: session} = useSession();
    const [tasks, setTasks] = useState<Task[]>(
        // 本番環境ではダミーデータを使用しない
        process.env.NODE_ENV !== "production" ? dummyTasks : []
    );

    // 現在の予約者数を保持するもの
    const [reserveNum, setReserveNum] = useState<Num>(
        // 本番環境ではダミーデータを使用しない
        process.env.NODE_ENV !== "production" ? dummyReserveNum : [] as any
    );

    const [tech, setTech] = useState<Technology[]>(
        // 本番環境ではダミーデータを使用しない
        process.env.NODE_ENV !== "production" ? dummyTech : []
    );

    const router = useRouter();
    const [inputTech, setInputTech] = useState<string>("");
    const [hiddenTasks, setHiddenTasks] = useState<boolean[]>(
        new Array<boolean>(tasks.length).fill(false)
    );

    const URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:40000";

    useEffect(() => {
        axios.get(`${URL}/api/event`)
            .then((res) => res.data)
            .then((data) => setTasks(data))
            .catch((e) => null);

        axios.get(`${URL}/api/tag`)
            .then((res) => res.data)
            .then((data) => setTech(data))
            .catch((e) => null);

        tasks.map(async (task: Task) => {
            axios.get(`${URL}/api/event/${task.id}/remaining`)
                .then((res) => res.data)
                .then((data) => setReserveNum(data))
                .catch((e) => null);
        });
    }, [URL, tasks]);

    // const handleTechCheck = (index: number) => {
    //     tasks.map((task: Task) => {
    //         if (!task.event_technologies[].technology.name.includes(tech[index].name)) {
    //             setHiddenTasks((prevState) => {
    //                 const newState = [...prevState];
    //                 const box: any = document.getElementById(tech[index].name);
    //                 if (box.checked) {
    //                     newState[tasks.indexOf(task)] = true;
    //                 } else {
    //                     newState[tasks.indexOf(task)] = !newState[tasks.indexOf(task)];
    //                 }
    //                 return newState;
    //             });
    //         }
    //     });
    //   }
  
      const handleTechCheck2 = () => {
          setHiddenTasks((prevState) => {
              const newState = [...prevState];
              tasks.map((task: Task) => {
                  newState[tasks.indexOf(task)] = true;
              });
              tech.map((tech: Technology) => {
                  const box: any = document.getElementById(tech.name);
                  tasks.map((task: Task) => {
                      if (box.checked) {
                        task.event_technologies.map((t) => {
                            if (t.technology.name === tech.name) {
                                newState[tasks.indexOf(task)] = false;
                            }
                        });
                      }
                  });
              });
              if (process.env.NODE_ENV !== "production") console.log(newState);
              return newState;
          });
      }
  
  
      const details = async (id: number) => {
          router.push(`/event/${id}`);
      }
    return (
    <>
    <div className=".container mt-4 p-4 container-fluid">
      <div className="">
        <div className="col-9 d-flex justify-content-between">
          <div className="">
            <div className="border-primary border-start border-3 ps-3">
              <h1 className="m-0">イベント一覧</h1>
              <p className="mb-5">Event list</p>
            </div>
          </div>
          <div className="mt-5 mb-1">
            <Link className="btn btn-warning rounded-pill mt-5 h-45" href="/event/new">＋イベントの作成</Link>
          </div>
        </div>
      </div>
      <div className="row justify-content-around">
        <div className="mt-2 col-9">
          {tasks.map((task: any, index: number) => {
              if (hiddenTasks[index] || task.start_time < new Date().toISOString()) {
                  return null
              } else {
                  return <div key={index}
                              className="mb-2 btn btn-outline-primary d-flex justify-content-around"
                              onClick={() => details(task.id)}>
                      <div className="col-9">
                          <h1>{task.name}</h1>
                          <h2>{task.start_time}</h2>
                      </div>
                      <div className="col-3 border-primary border-start pt-3  ps-2">
                          {task.limitation &&
                              <h5>参加者 {task.limitation - reserveNum.remaining}/{task.limitation}人</h5>}
                          <h5>場所 {task.location}</h5>
                      </div>
                  </div>
              }
          })}
          </div>
          <div className="row gy-2 col-3 h-100">
            <p className=" bg-secondary text-white rounded-top p-0 m-0 text-center">フィルター機能</p>
              <div className="border border-secondary rounded-bottom mt-0">
                <div className="m-2">
                  <input className="form-control" type="text" placeholder="検索"
                    onChange={(e) => setInputTech(e.target.value)}/>
                  <div className="border-bottom border-secondary pb-2"></div>
                  <div className="pt-2"></div>
                    {tech.map((tech: any) => {
                            if (tech.name.indexOf(inputTech) === -1) return null
                            return (
                                <div className="form-check" key={tech.id}>
                                    <label className="form-check-label">
                                        <input id={tech.name} className="form-check-input" type="checkbox"
                                                onChange={() => handleTechCheck2()}/> {tech.name}
                                    </label>
                                </div>
                            )
                        }
                        )}
                  <Link className="btn btn-outline-secondary rounded-pill mt-3 col-12" href="/tag">＋タグの作成</Link>
                  </div>
                </div>
                </div>
                </div>
                </div>
        </>
    )
}
