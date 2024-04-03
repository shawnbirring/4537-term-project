import { getUserData } from "@/utils/manageUser"

interface Params {
    params: {
        userID: string
    }
}

export default async function Page({params}: Params) {
    getUserData(params.userID).then(res => {console.log(res)})

    return (<p>hi</p>)
}