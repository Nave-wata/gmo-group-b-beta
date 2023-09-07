import React, { useState } from "react";
import Agreement from "@/components/Agreement";
import Link from "next/link";

type Event = {
  "create_user": string,
  "name": string,
  "technologies": string[],
  "start_time": string,
  "end_time": string,
  "location": string,
  "description": string,
  "limitation": number,
  "record_url": string,
}

export default function Page() {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [formData, setFormData] = useState<Event>({
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
  });
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  };

  const handleTechChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newTech = [...formData.technologies]
    newTech[index] = e.target.value;
    setFormData({ ...formData, technologies: newTech })
  };

  const submitEventInfo = async (e: any) => {
    e.preventDefault();

    const updatedForm = {
      ...formData,
      "create_user": "Taro",
    };
    setFormData(updatedForm);
    try {
      const response = await fetch("api/createEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("form data is submitted.");
      } else {
        console.log("form data is not submitted")
        console.log(formData);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const addTags = async () => {
    setFormData({ ...formData, technologies: [...formData.technologies, ""] });
  }

  const removeTags = (index: number) => {
    const newFormData = { ...formData };
    newFormData.technologies.splice(index, 1);
    setFormData(newFormData);
  }


  return (
    <>
      <form onSubmit={submitEventInfo}>
        <div className=".container mt-4 container-fluid">
          <div className="pb-5">
            <h1 className="border-primary border-start border-3 ps-3">イベント作成</h1>
          </div>
          <div className="">
            <label className="form-label d-flex justify-content-around mb-3">
              <p className="col-3 ps-3">イベント名</p>
              <input className="form-control" type="text" name="name" value={formData.name} onChange={handleChange}
                required />
            </label>

          </div>
          <div className="border-2 border-top">
            {formData.technologies.map((tech, index) => (
              <div key={index} className="">
                <label className="form-label d-flex justify-content-around m-2">
                  <p className="col-3 ps-2">技術ラベル{index + 1}</p>
                  <input className="form-control me-1" type="text" name={`technologies[${index}]`} value={tech}
                    onChange={(e) => handleTechChange(e, index)} required />
                  <button className="col-3 btn btn-secondary" type="button"
                    onClick={() => removeTags(index)}>タグの削除
                  </button>
                </label>
                {/* <div className="col-1"></div> */}

              </div>
            ))}
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
                <p className="col-3 ps-3">開始時刻</p>
                <input className="form-control" type="datetime-local" name="start_time" value={formData.start_time}
                onChange={handleChange} required />
              </label>
            </div>
            <div className="">
              <label className="d-flex justify-content-around mb-3">
                <p className="col-3 ps-3">終了時刻</p>
                <input className="form-control" type="datetime-local" name="end_time" value={formData.end_time}
                  onChange={handleChange} required />
              </label>

            </div>
            <div className="">
              <label className="form-label d-flex justify-content-around mb-3">
                <p className="col-3 ps-3">場所</p>
                <input className="form-control" type="text" name="location" value={formData.location}
                  onChange={handleChange} required />
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
                <input className="form-control" type="number" name="limitation" placeholder="Default input" aria-label="default input example"
                  value={formData.limitation} onChange={handleChange} required></input>
              </label>
            </div>
            {/* <div className="d-flex justify-content-around mb-3">
              <label className="col-3 ps-3">イベントの説明</label>
              <textarea className="col-9" name="description" value={formData.description} cols={40}
                rows={5} onChange={handleChange} required></textarea>
            </div> */}

            <div className="">
              <label htmlFor="exampleFormControlTextarea1" className="form-label d-flex mb-3 justify-content-between">
                <p className="col-3 ps-3">イベントの説明</p>
                <textarea className="form-control" name="description" id="exampleFormControlTextarea1" value={formData.description}
                  rows={5} onChange={handleChange} required></textarea>
              </label>
              {/* <label>部署：<input type="text" value={inputValue.department} onChange={(e) => handleDepartmentChange(e)} /></label> */}

            </div>

            <div className="">
              <label className="form-label d-flex mb-3 justify-content-between">
                <p className="col-3 ps-3">record_url</p>
                <input className="form-control" type="text" name="record_url" value={formData.record_url}
                  onChange={handleChange} required />
              </label>

            </div>
          </div>
          <div className="mb-3 d-flex justify-content-around">
            <div className="mt-4">
              <Link href="/home" className="btn btn-outline-secondary">＜戻る</Link>
            </div>
            <button className="btn btn-primary col-9 mt-4" type="submit" onClick={() => {
              setIsChecking(true)
            }}>作成
            </button>
          </div>
        </div>
      </form>
      {isChecking &&
        <Agreement content={"イベントを作成しますか？"}
          handleOnAgree={() => {
            window.alert("作成する");
            setIsChecking(false);
          }}
          handleOnDisagree={() => {
            setIsChecking(false);
          }} />}
    </>
  )
}
