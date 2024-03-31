'use client'

import { toLogin } from "../lib/actions";
import { useEffect, useState } from "react"
import { loadUserData } from "@/app/lib/util"
import Button from "./components/Button";
import TextArea from "./components/TextArea";
import Title from "./components/Title";

export default function ModelInteraction() {

    const [question, setQuestion] = useState("")
    const [response, setResponse] = useState("")
    // const [userData, setUserData] = useState<any>(null)
    // useEffect(() => {
    //     if (userData && userData.error) {
    //         toLogin()
    //     }
    // },
    // [userData])

    // if (!userData) {loadUserData(admin).then(data => {
    //     console.log(data)
    //     setUserData(data)
    // })}
    return(<>
    <Title text= "Interact with the Model"/>
    <TextArea placeholder="Ask a question ..." setQuestion={setQuestion}/>
    <Button label="Interact" question={question} setStateFun={setResponse}/>
    <p>{response}</p>
    </>)
}