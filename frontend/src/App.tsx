import Header from "./components/Header.tsx";
import NodeList from "./components/NodeList.tsx";
import GlobalStyle from "./GlobalStyle.tsx";
import {Route, Routes} from "react-router-dom";
import AddPage from "./components/AddPage.tsx";
import styled from "@emotion/styled";
import {useStore} from "./hooks/useStore.ts";
import {useEffect} from "react";

export default function App() {
    const user = useStore(state => state.user)
    const player = useStore(state => state.player)
    const getUser = useStore(state => state.getUser)
    const getPlayer = useStore(state => state.getPlayer)
    const logout = useStore(state => state.logout)

    useEffect(() => {
        getUser()
        getPlayer()
    }, [getPlayer, getUser])

    console.log(user)

    return (
        <>
            <GlobalStyle/>
            <StyledContent>
            <Header/>
                <p>{player?.name ?? user?.username}</p>
                {user && <button onClick={logout}>logout</button>}
                {user && <button onClick={logout}>logout</button>}
                <Routes>
                    <Route path="/add" element={<AddPage/>}/>
                    <Route path={"/"} element={<NodeList/>}/>
                </Routes>
            </StyledContent>
        </>
    )
}

const StyledContent = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
`;
