import NodeItem from "./NodeItem.tsx";
import {useStore} from "../hooks/useStore.ts";
import styled from "@emotion/styled";
import AddButton from "./AddButton.tsx";
import {useEffect} from "react";

export default function NodeList() {
    const nodes = useStore(state => state.nodes);
    const getNodes = useStore(state => state.getNodes);

    useEffect(() => {
        getNodes()
    }, [getNodes]);

    return <StyledList>
        {nodes.map(node => <NodeItem key={node.id} node={node}/>)}
        <AddButton/>
    </StyledList>
}

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 8rem;

  li:first-of-type {
    margin-top: 1rem;
  }
`;
