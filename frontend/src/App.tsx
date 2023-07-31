import Header from "./components/Header.tsx";
import NodeList from "./components/NodeList.tsx";
import GlobalStyle from "./GlobalStyle.tsx";
import {Route, Routes} from "react-router-dom";
import AddPage from "./components/AddPage.tsx";
import styled from "@emotion/styled";

export default function App() {
    return (
        <>
            <GlobalStyle/>
            <StyledContent>
            <Header/>
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
