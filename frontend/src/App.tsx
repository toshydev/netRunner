import {useEffect} from 'react'
import Header from "./components/Header.tsx";
import NodeList from "./components/NodeList.tsx";
import {useStore} from "./hooks/useStore.ts";
import GlobalStyle from "./GlobalStyle.tsx";

export default function App() {
    const getNodes = useStore(state => state.getNodes);

    useEffect(() => {
        getNodes()
    }, [getNodes])

    return (
        <>
            <GlobalStyle/>
            <Header/>
            <NodeList/>
        </>
    )
}
