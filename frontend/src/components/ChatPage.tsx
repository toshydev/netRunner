import {Card} from "@mui/material";
import styled from "@emotion/styled";
import {StyledInput} from "./styled/StyledInput.ts";
import {StyledFormButton} from "./styled/StyledFormButton.ts";
import React, {useEffect, useRef, useState} from "react";
import ChatMessage from "./ChatMessage.tsx";
import {nanoid} from "nanoid";
import {useStore} from "../hooks/useStore.ts";

export default function ChatPage() {
    const [text, setText] = useState<string>("")
    const messages = useStore(state => state.messages);
    const sendMessage = useStore(state => state.sendMessage);
    const messageListRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        sendMessage(text);
        setText("");
    }

    return <StyledCard>
        <StyledChatWindow ref={messageListRef}>
            {messages.length > 0 ? messages.map((message) => {
                return <ChatMessage key={nanoid()} message={message}/>
            }) : <p style={{color: "var(--color-primary)"}}>...</p>}
        </StyledChatWindow>
        <StyledInputForm onSubmit={handleSubmit}>
            <StyledInputField
                placeholder="Type your message here..."
                value={text}
                onChange={event => setText(event.target.value)}
                maxLength={500} />
            <StyledSendButton theme={"success"} disabled={text.length <= 0}>Send</StyledSendButton>
        </StyledInputForm>
    </StyledCard>
}

const StyledCard = styled(Card)`
  margin: 0.5rem 0;
  width: 95%;
  height: 70vh;
  background: var(--color-semiblack);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
`;

const StyledChatWindow = styled.ul`
  width: 100%;
  height: 90%;
  background: var(--color-black);
  border-radius: 0.5rem;
  overflow-y: scroll;
  padding: 0.5rem;
  box-shadow: 0 0 0.5rem var(--color-primary);

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-secondary);
    border-radius: 0.5rem;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-secondary);
    border-radius: 0.5rem;
  }
`;

const StyledInputForm = styled.form`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const StyledInputField = styled(StyledInput)`
  width: 90%;
  height: 100%;
  background: var(--color-semiblack);
  text-align: left;
  border-radius: 0.5rem;
  color: var(--color-primary);
  outline: 2px solid var(--color-grey);
  font-size: 1rem;
  padding: 0.5rem;
  text-shadow: none;
  
  &:focus {
    outline: 2px solid var(--color-primary);
    background: var(--color-black);
  }

  &::placeholder {
    color: var(--color-white);
  }

  &:hover {
    background: var(--color-black);
  }
`;

const StyledSendButton = styled(StyledFormButton)`
  width: 5%;
  height: 100%;
  filter: none;

  &:hover {
    background: var(--color-semiblack);
  }
  
  &:active {
    filter: drop-shadow(0 0 0.5rem var(--color-primary));
    background: var(--color-black);
  }
  
  &:disabled {
    filter: none;
    color: var(--color-grey);
    border-color: var(--color-grey);
  }
`;
