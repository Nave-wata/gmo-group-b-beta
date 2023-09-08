import {isset} from "@/utils/isType";
import axios from "axios";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";

type Task = {
    "id": number,
    "create_user_id": number,
    "name": string,
    "technologies": string[],
    "start_time": string,
    "end_time": string,
    "location": string,
    "description": string,
    "limitation": number | null,
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
    "remaining": number,
};

type Technology = {
    "id": number,
    "name": string,
    "created_at": string,
    "edited_at": string,
};

const dummyTasks: Task[] = [
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
    },
    {
        "id": 3,
        "create_user_id": 5,
        "name": "Next.js勉強会",
        "technologies": [
            "Next.js",
            "バックエンド",
        ],
        "start_time": "2024-03-05 13:00:00",
        "end_time": "2024-03-05 17:00:00",
        "location": "オンライン",
        "description": "これは説明です",
        "limitation": 20,
        "record_url": "hoge.google.com?hogehogehoge",
        "created_at": "2022-02-01 10:00:00",
        "edit_at": "2022-02-01 12:00:00",
    },
];

const dummyReserveNum: Num = {"remaining": 5}

const dummyTech: Technology[] = [
<<<<<<< HEAD
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
=======
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
>>>>>>> 21c5c43 (add-font-desgin)
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

    const handleTechCheck = (index: number) => {
        tasks.map((task: Task) => {
            if (!task.technologies.includes(tech[index].name)) {
                setHiddenTasks((prevState) => {
                    const newState = [...prevState];
                    const box: any = document.getElementById(tech[index].name);
                    if (box.checked) {
                        newState[tasks.indexOf(task)] = true;
                    } else {
                        newState[tasks.indexOf(task)] = !newState[tasks.indexOf(task)];
                    }
                    return newState;
                });
            }
        });
<<<<<<< HEAD
    }

    const handleTechCheck2 = () => {
        setHiddenTasks((prevState) => {
            const newState = [...prevState];
            tasks.map((task: Task) => {
                newState[tasks.indexOf(task)] = false;
            });
            tech.map((tech: Technology) => {
                const box: any = document.getElementById(tech.name);
                tasks.map((task: Task) => {
                    if (box.checked && !(task.technologies.includes(tech.name))) {
                        newState[tasks.indexOf(task)] = true;
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
                    {/* <p>{isset(session) ? session?.user?.name + "さん" : null}</p> */}
                    <div className="col-9 d-flex justify-content-between">
                        <div className="pb-3">
                            <h1 className="border-primary border-start border-3 ps-3">イベント一覧</h1>
                        </div>
                        <Link className="btn btn-warning rounded-pill mt-5" href="/event/new">＋イベントの作成</Link>
                        <Link className="btn btn-warning rounded-pill mt-5" href="/tag">＋タグの作成</Link>
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
                            </div>
                        </div>
                    </div>
                </div>
=======
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
          {/* <p>{isset(session) ? session?.user?.name + "さん" : null}</p> */}
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
              if (hiddenTasks[index]) return null
              return <div key={index} className="mb-2 btn btn-outline-primary d-flex justify-content-around" onClick={() => details(task.id)}>
                <div className="col-9">
                  <h1>{task.name}</h1>
                  <h2>{task.start_time}</h2>
                </div>
                <div className="col-3 border-primary border-start pt-3  ps-2">
                  <h5>参加者 {task.limitation - reserveNum.remaining}/{task.limitation}人</h5>
                  <h5>場所  {task.location}</h5>
                </div>
              </div>
            })}
          </div>
          <div className="row gy-2 col-3 h-100">
            <p className=" bg-secondary text-white rounded-top p-0 m-0 text-center">フィルター機能</p>
            <div className="border border-secondary rounded-bottom mt-0">
              <div className="m-2">
                <input className="form-control" type="text" placeholder="検索" onChange={(e) => setInputTech(e.target.value)} />
                <div className="border-bottom border-secondary pb-2"></div>
                <div className="pt-2"></div>
                {tech.map((tech: any) => {
                  if (tech.name.indexOf(inputTech) === -1) return null
                  return (
                    <div className="form-check" key={tech.id}>
                      <label className="form-check-label">
                        <input id={tech.name} className="form-check-input" type="checkbox" onChange={() => handleTechCheck2()} /> {tech.name}
                      </label>
                    </div>
                  )
                }
                )}
                {/* <div className="mt-4 mb-1"> */}
                  <Link className="btn btn-outline-secondary rounded-pill mt-3 col-12" href="/tag">＋タグの作成</Link>
                {/* </div> */}
              </div>
>>>>>>> 21c5c43 (add-font-desgin)
            </div>
        </>
    )
}
