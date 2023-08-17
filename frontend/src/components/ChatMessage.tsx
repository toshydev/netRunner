import {Message} from "../models.ts";
import styled from "@emotion/styled";
import {Card} from "@mui/material";
import {useStore} from "../hooks/useStore.ts";

type Props = {
    message: Message;
}

export default function ChatMessage({message}: Props) {
    const user = useStore(state => state.user);
    const isUser = message.username === user;
    const isAdmin = message.username === "Netwalker";
    const usernameColor = (isUser: boolean, isAdmin: boolean) => {
        if (isUser) return "var(--color-secondary)";
        if (isAdmin) return "var(--color-special)";
        return "var(--color-primary)";
    }

    return <StyledMessage isuser={`${isUser}`} isadmin={`${isAdmin}`}>
        <StyledUsername color={usernameColor(isUser, isAdmin)}>{message.username}</StyledUsername>
        <p>{message.message}</p>
        <StyledTimestamp>{new Date(message.timestamp).toLocaleTimeString("en-US")}</StyledTimestamp>
    </StyledMessage>
}

const StyledMessage = styled(Card)<{ isuser: string, isadmin: string }>`
  width: 90%;
  height: auto;
  background: ${({isadmin}) => isadmin === "true" ? "var(--color-primary-dark)" : "var(--color-semiblack)"};
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin: 0.5rem 0;
  color: var(--color-primary);
  display: flex;
  flex-direction: column;
  ${props => props.isuser === "true" ? "margin-left: auto;" : ""}
`;

const StyledUsername = styled.h6<{color: string}>`
 color: ${({color}) => color};
`;

const StyledTimestamp = styled.small`
  align-self: flex-end;
  font-size: 0.75rem;
`;
