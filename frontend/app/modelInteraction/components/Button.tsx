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
        // const token = localStorage.getItem('token');
        // if (!token) {
        //     alert('Token not found. Please login first.');
        //     return;
        // }
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
        const data = await response.json();
        console.log("AI Response: " + data)
        setStateFun(data)
    } catch (error) {
        console.error('Error: ', error);
    }

}

export default function Button({label, question, setStateFun} : ButtonProps){
        return(<>
            <button onClick={() => sendquestion(question, setStateFun)}>{label}</button>
        </>)
}