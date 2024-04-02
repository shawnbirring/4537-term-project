interface TextAreaProps{
    placeholder:string,
    setQuestion:Function 
    // textColour, 
    // backgroundColour
    // handleClickFun:Function
}

function handleChange(event:any, setFun:Function) {
    setFun(event.target.value);
  }

export default function TextArea({placeholder, setQuestion}: TextAreaProps) {
    return (
        <>
        <textarea placeholder={placeholder} onChange={(e) => handleChange(e, setQuestion)}></textarea>
        </>
    )
}