import {JSX} from "react";

type AgreementProps = {
    content: string
    handleOnAgree: () => void
    handleOnDisagree: () => void
}

// handleOnAgreeで同意したときの処理を書く
// handleOnDisagreeで同意しなかったときの処理を書く

function Agreement({content, handleOnAgree, handleOnDisagree}: AgreementProps): JSX.Element {
    return (
        <>
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}>
                <div className={"bg-light p-3"} style={{width: "75vw", borderRadius: 20, position: "relative"}}>
                    <button type="button" className="btn-close" aria-label="Close"
                            style={{position: "absolute", right: 10, top: 10}} onClick={handleOnDisagree}/>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                    }}>
                        <span>{content}</span>
                        <div className={"d-inline-block"}>
                            <button type="button" className="btn btn-primary m-2" onClick={handleOnAgree}>Yes</button>
                            <button type="button" className="btn btn-primary m-2" onClick={handleOnDisagree}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Agreement;