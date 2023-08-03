import {Navigate, Outlet} from "react-router-dom";

type Props = {
    user?: string
}

export default function ProtectedRoutes({user}: Props) {

    if(user === undefined) return "loading...";

    const isAuthenticated = user !== "anonymousUser"

    return <>{isAuthenticated ? <Outlet/> : <Navigate to="/login"/>}</>

}
