import React from "react";
import {signIn, useSession} from "next-auth/react";

export default function Page() {
    const {data: session} = useSession();


    return (
        <>
            <div className={"d-flex justify-content-center"}>
                <div className={"w-75 rounded border rounded-3 border-2 border-primary d-flex flex-column justify-content-center text-center p-3"}
                     style={{marginTop: "25vh", alignItems: "center"}}>
                    <div className={"fs-3 border-primary border-start border-3 ps-3"}>ログイン</div>
                    <div className={"w-100 mt-5"}>下のボタンを押してGoogleアカウントにログインしてください</div>
                    {!session &&
                        (<div className={"w-25 mx-auto"}>
                            <img className={"img-fluid"} src={"./btn_google_signin_dark_normal_web@2x.png"}
                                 onClick={() => signIn("google")}/>
                        </div>)}
                </div>
            </div>


        </>
    )
}
