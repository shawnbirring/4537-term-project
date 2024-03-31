interface TitleProps{
    text:string
}

export default function Title({text} : TitleProps){
    return(<>
        <h1>{text}</h1>
    </>)
}