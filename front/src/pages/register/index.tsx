import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";

/**
 * 以下のようなプロフィールを作成する
 */
export interface Profile {
  name: string;
  email: string;
  department: string;
  token: string;
  technologies: string[];
}

/**
 * 保有技術
 */
export interface Technology {
  name: string;
  // age: string;
}

type UserEntity = {
    "id": string,
    "email": string,
    "accessToken": string,
    "refreshToken": string,
};

/**
 * プロフィールページ
 * 
 * @returns 
 */
export default function Page() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<Profile>({
    name: "",
    email: "",
    department: "",
    token: "",
    technologies: []
  });
  const URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:40000";
  const { data: session } = useSession();
  const user = session?.user as UserEntity;
  
  // セッション内にプロフィールがあれば取得する
  useEffect(() => {
    // const item = sessionStorage.getItem("profile");
    // if (item) setInputValue(JSON.parse(item));
    if (!user) return;
    axios.get(`${URL}/api/user/${user.id}`)
    .then((res) => res.data)
    .then((data) => setInputValue(data))
    .catch((e) => { 
      if (process.env.NODE_ENV !== "production") {
        console.error("ERROR",e)
      }
    });
  }, [URL, session?.user])

  /**
   * @param e 名前入力欄の変更イベント 
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({
      ...inputValue,
      name: e.target.value
    });
  }

  /**
   * @param e 部署入力欄の変更イベント
   */
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({
      ...inputValue,
      department: e.target.value
    });
  }

  /**
 * @param e メールアドレス入力欄の変更イベント
 */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({
      ...inputValue,
      email: e.target.value,
      token: user.id
    });
  }

  /**
   * @param e 保有技術入力欄の変更イベント
   * @param index 保有技術のindex
   * @param attribute 保有技術の属性
   */
  const handletechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, attribute: string) => {
    const newInputValue = { ...inputValue };
    const techName: any = e.target.value;
    newInputValue.technologies[index] = techName;
      // name: attribute === "name" ? e.target.value : inputValue.technologies[index].name,
      // age: attribute === "age" ? e.target.value : inputValue.technologies[index].age
    setInputValue(newInputValue);
  };

  /**
   * 保有技術の追加
   */
  const handleAddTechnology = () => {
    // 入力がない場合は追加しない
    if (inputValue.technologies[inputValue.technologies.length - 1] === "") return;
    // if (inputValue.technologies[inputValue.technologies.length - 1].age === "") return;

    const newInputValue = { ...inputValue };
    newInputValue.technologies.push("");
    setInputValue(newInputValue);
  }

  /**
   * @param index 削除する保有技術のindex
   */
  const handleDeleteTechnology = (index: number) => {
    // 技術が1つしかない場合は削除しない
    if (inputValue.technologies.length === 1) return;
    const newInputValue = { ...inputValue };
    newInputValue.technologies.splice(index, 1);
    setInputValue(newInputValue);
  }

  /**
   * 更新ボタン押下時の処理
   */
  const submit = () => {
    // 入力がない場合は更新しない
    if (inputValue.name === "") return;
    if (inputValue.department === "") return;
    // if (inputValue.technologies.some((ability) => ability.name === "")) return;
    // console.log(user.id)
    // const updateInput = {
    //   ...inputValue,
    //   "token": user.id,
    // }
    // setInputValue(updateInput);
    sessionStorage.setItem("profile", JSON.stringify(inputValue));
    console.log(JSON.stringify(inputValue))
    router.push("/register/confirm");
  }

  return (
    <>
      <div className=".container mt-5 container-fluid">
        <div className="mx-4">
          <div className="pb-4">
            <h1 className="border-primary border-start border-3 ps-3">プロフィール</h1>
          </div>

          <div>
            <label className="form-label d-flex justify-content-around px-3">
              <p className="col-3">お名前</p>
              <input className="form-control" type="text" value={inputValue.name} onChange={(e) => handleNameChange(e)} />
            </label>

            <label className="form-label d-flex justify-content-around px-3">
              <p className="col-3">メールアドレス</p>
              <input className="form-control" type="email" value={inputValue.email} onChange={(e) => handleEmailChange(e)} />
            </label>
            <br />

            <label className="form-label d-flex justify-content-around px-3">
              <p className="col-3">部署</p>
              <input className="form-control" type="text" value={inputValue.department} onChange={(e) => handleDepartmentChange(e)} />
            </label>

            <label className="form-label d-flex justify-content-around px-3">
              <p className="col-3">保有技術</p>
              <div className="col-9 justify-content-around">
                {inputValue.technologies.map((ability, index) => (
                  <div key={index}>
                    <label className="form-label d-flex justify-content-around mb-2">
                      <input className="form-control me-1" type="text" value={ability} onChange={(e) => handletechnologiesChange(e, index, "name")} />

                      {/* <label>年数：<input type="text" value={ability.age} onChange={(e) => handletechnologiesChange(e, index, "age")} /></label> */}
                      <button className="col-3 btn btn-secondary" onClick={() => handleDeleteTechnology(index)}>削除</button>
                    </label>
                  </div>
                )
                )}
                <button className="col-12 btn btn-warning rounded-pill" onClick={() => handleAddTechnology()}>＋追加</button>
              </div>
            </label>
            <br />
            <label className="mb-3 d-flex justify-content-between">
              <div className="mt-4">
                <Link href="/home" className="btn btn-outline-secondary">＜戻る</Link>
              </div>
              <button className="btn btn-primary col-10 mt-4" onClick={() => submit()}>更新</button></label>
          </div>
        </div>
      </div>
    </>
  )
}