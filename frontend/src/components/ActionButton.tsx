import {ActionType} from "../models.ts";
import {Button} from "@mui/material";
import styled from "@emotion/styled";
import {useStore} from "../hooks/useStore.ts";

type props = {
    action: ActionType
    nodeId: string
}

export default function ActionButton({action, nodeId}: props) {
    const editNode = useStore(state => state.editNode);

    function handleAction() {
        editNode(nodeId, action)
    }

    return <StyledButton onClick={handleAction} actionType={action}>{action.toString() === "ABANDON" ? "-" : "+"}</StyledButton>
}

const StyledButton = styled(Button)<{actionType: ActionType}>`
  width: 4rem;
  height: 4rem;
  scale: 0.6;
  font-family: inherit;
  background: var(--color-black);
  color: ${({actionType}) => actionType.toString() === "ABANDON" ? "var(--color-secondary)" : "var(--color-primary)"};
  font-size: 4rem;
  border-radius: 12px;
  border: 4px solid ${({actionType}) => actionType.toString() === "ABANDON" ? "var(--color-secondary)" : "var(--color-primary)"};
`;