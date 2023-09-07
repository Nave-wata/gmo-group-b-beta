import React from "react";
import { signIn, useSession } from "next-auth/react";
import { isset } from "@/utils/isType";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Page() {
    const { data: session } = useSession();
    const router = useRouter();

    if (isset(session)) router.push("/home");

    return (
        <>
            <div className={"d-flex justify-content-center"}>
                <div className={"w-75 rounded border rounded-3 border-2 border-secondery d-flex flex-column justify-content-center text-center p-3"}
                    style={{ marginTop: "25vh", alignItems: "center" }}>
                    <div className={"fs-3"}>ログイン</div>
                    <div className={"w-100 my-3"}>下のボタンを押してGoogleアカウントにログインしてください。</div>
                    <div className={"w-25 mx-auto"}>
                        <Image
                            className={"img-fluid"}
                            src={"/btn_google_signin_dark_normal_web@2x.png"}
                            alt="Sign in with Google"
                            height={92}
                            width={382}
                            onClick={() => signIn("google")}
                        />
                    </div>
                </div>
            </div>


        </>
    )
}
