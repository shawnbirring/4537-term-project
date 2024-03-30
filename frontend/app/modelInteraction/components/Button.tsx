interface ButtonProps{
    label:string, 
    // textColour, 
    // backgroundColour
    // handleClickFun:Function
}

export default function Button({label} : ButtonProps){
        return(<>
            <button>{label}</button>
        </>)
}