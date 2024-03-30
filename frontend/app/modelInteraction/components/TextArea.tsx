interface TextAreaProps{
    placeholder:string, 
    // textColour, 
    // backgroundColour
    // handleClickFun:Function
}

export default function TextArea({placeholder}: TextAreaProps) {
    return (
        <>
        <textarea placeholder={placeholder}></textarea>
        </>
    )
}