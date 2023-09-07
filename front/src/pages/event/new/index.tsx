import React, {useState} from "react";
import Agreement from "@/components/Agreement";

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
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    };

    const handleTechChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newTech = [...formData.technologies]
        newTech[index] = e.target.value;
        setFormData({...formData, technologies: newTech})
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
        setFormData({...formData, technologies: [...formData.technologies, ""]});
    }

    const removeTags = (index: number) => {
        const newFormData = {...formData};
        newFormData.technologies.splice(index, 1);
        setFormData(newFormData);
    }


    return (
        <>
            <form onSubmit={submitEventInfo}>
                <div className=".container mt-4 container-fluid">
                    <div className="d-flex justify-content-around mb-3">
                        <label className="col-3 ps-3">イベント名</label>
                        <input className="col-9" type="text" name="name" value={formData.name} onChange={handleChange}
                               required/>
                    </div>
                    <div className="border-2 border-top">
                        {formData.technologies.map((tech, index) => (
                            <div key={index} className="d-flex justify-content-around m-2">
                                <label className="col-3 ps-2">技術ラベル{index + 1}</label>
                                <input className="col-5" type="text" name={`technologies[${index}]`} value={tech}
                                       onChange={(e) => handleTechChange(e, index)} required/>
                                <div className="col-1"></div>
                                <button className="col-3 btn btn-secondary rounded-pill" type="button"
                                        onClick={() => removeTags(index)}>タグの削除
                                </button>
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
                        <div className="d-flex justify-content-around my-3">
                            <label className="col-3 ps-3">開始時刻</label>
                            <input className="col-9" type="datetime-local" name="start_time" value={formData.start_time}
                                   onChange={handleChange} required/>
                        </div>
                        <div className="d-flex justify-content-around mb-3">
                            <label className="col-3 ps-3">終了時刻</label>
                            <input className="col-9" type="datetime-local" name="end_time" value={formData.end_time}
                                   onChange={handleChange} required/>
                        </div>
                        <div className="d-flex justify-content-around mb-3">
                            <label className="col-3 ps-3">場所</label>
                            <input className="col-9" type="text" name="location" value={formData.location}
                                   onChange={handleChange} required/>
                        </div>
                        <div className="d-flex justify-content-around mb-3">
                            <label className="col-3 ps-3">参加可能人数</label>
                            <input className="col-9" type="number" name="limitation" value={formData.limitation}
                                   onChange={handleChange} required/>
                        </div>
                        <div className="d-flex justify-content-around mb-3">
                            <label className="col-3 ps-3">イベントの説明</label>
                            <textarea className="col-9" name="description" value={formData.description} cols={40}
                                      rows={5} onChange={handleChange} required></textarea>
                        </div>
                        <div className="d-flex justify-content-around mb-3">
                            <label className="col-3 ps-3">record_url</label>
                            <input className="col-9" type="text" name="record_url" value={formData.record_url}
                                   onChange={handleChange} required/>
                        </div>
                    </div>
                    <div className="d-flex justify-content-around">
                        <button className="btn btn-primary btn-lg col-9 mt-4" type="submit" onClick={() => {
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
                           }}/>}
        </>
    )
}
