import NodeItem from "./NodeItem.tsx";
import {useStore} from "../hooks/useStore.ts";
import styled from "@emotion/styled";
import AddButton from "./AddButton.tsx";

export default function NodeList() {
    const nodes = useStore(state => state.nodes);

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

  li:first-child {
    margin-top: 1rem;
  }
`;
