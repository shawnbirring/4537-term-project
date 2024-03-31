interface ButtonProps{
    label:string, 
    question:string,
    setStateFun:Function
    // textColour, 
    // backgroundColour
    // handleClickFun:Function
}

async function sendquestion(question : string, setStateFun : Function){
    try {
        console.log("setting post request")
        const response = await fetch('https://4537-term-project-backend.vercel.app/api', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            text: question
            }),
            credentials: 'include'
        });
        console.log("sending post request")
        const data = await response.json();
        console.log(data.modelData[0].generated_text)
        let response_split_newline = data.modelData[0].generated_text.split("\n\n\n")
        console.log(response_split_newline)
        console.log(response_split_newline[1])
        setStateFun(response_split_newline[1])
    } catch (error) {
        console.error('Error: ', error);
    }

}

export default function Button({label, question, setStateFun} : ButtonProps){
        return(<>
            <button onClick={() => sendquestion(question, setStateFun)}>{label}</button>
        </>)
}