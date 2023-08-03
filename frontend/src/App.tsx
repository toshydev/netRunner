import Header from "./components/Header.tsx";
import NodeList from "./components/NodeList.tsx";
import GlobalStyle from "./GlobalStyle.tsx";
import {Route, Routes} from "react-router-dom";
import AddPage from "./components/AddPage.tsx";
import styled from "@emotion/styled";
import {useStore} from "./hooks/useStore.ts";
import {useEffect, useState} from "react";
import PlayerInfoBar from "./components/PlayerInfoBar.tsx";
import LoginPage from "./components/LoginPage.tsx";
import {ThemeProvider} from "@mui/material";
import {theme} from "./theme.ts";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import {Coordinates} from "./models.ts";

export default function App() {
    const [initialLoad, setInitialLoad] = useState(true)
    const [location, setLocation] = useState<Coordinates | null>(null)
    const user = useStore(state => state.user)
    const getUser = useStore(state => state.getUser)
    const getPlayer = useStore(state => state.getPlayer)
    const player = useStore(state => state.player)
    const updateLocation = useStore(state => state.updateLocation)
    const gps = useStore(state => state.gps)
    const setGps = useStore(state => state.setGps)

    useEffect(() => {
        try {
            getUser()
            console.log("getting user")
        } catch (e) {
            console.error(e)
        } finally {
            setInitialLoad(false)
        }
    }, [getUser])

    useEffect(() => {
        if (user !== "" && user !== "anonymousUser") {
            getPlayer()
            if (gps) {
                const interval = setInterval(() => {
                    getLocation()
                    if (location) {
                        updateLocation(location)
                    }
                }, 3000)
                return () => clearInterval(interval)
            }
        } else {
            setGps(false)
        }
    }, [location, updateLocation, gps, user, getPlayer, setGps])

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const {latitude, longitude} = position.coords
                const timestamp = position.timestamp
                const coords: Coordinates = {latitude: latitude, longitude: longitude, timestamp: timestamp}
                setLocation(coords)
            });
        }
    }

    if (initialLoad) return null;

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle/>
            <StyledContent>
                <Header user={user}/>
                <Routes>
                    <Route element={<ProtectedRoutes user={user}/>}>
                        <Route path={"/add"} element={<AddPage/>}/>
                        <Route path={"/"} element={
                            <>
                                <PlayerInfoBar player={player}/>
                                <NodeList/>
                            </>
                        }/>
                    </Route>
                    <Route path={"/login"} element={<LoginPage/>}/>
                </Routes>
            </StyledContent>
        </ThemeProvider>
    )
}

const StyledContent = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
`;
