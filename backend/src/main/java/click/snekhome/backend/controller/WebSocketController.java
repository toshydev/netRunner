package click.snekhome.backend.controller;

import click.snekhome.backend.model.ChatMessage;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Service
public class WebSocketController extends TextWebSocketHandler {

    private final Set<WebSocketSession> activeSessions = new HashSet<>();

    @Override
    public void afterConnectionEstablished(@NotNull WebSocketSession session) throws Exception {
        activeSessions.add(session);
        broadcastUserSession(session, "login");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String username = Objects.requireNonNull(session.getPrincipal()).getName();
        ChatMessage chatMessage = new ChatMessage(username, message.getPayload(), Instant.now().getEpochSecond());
        TextMessage textMessage = new TextMessage(chatMessage.toString());

        for (WebSocketSession activeSession : activeSessions) {
            activeSession.sendMessage(textMessage);
        }
    }

    @Override
    public void afterConnectionClosed(@NotNull WebSocketSession session, @NotNull CloseStatus status) throws Exception {
        activeSessions.remove(session);
        broadcastUserSession(session, "logout");
    }

    void broadcastUserSession(WebSocketSession session, String type) throws IOException {
        String username = Objects.requireNonNull(session.getPrincipal()).getName();
        String message = switch (type) {
            case "login" -> "joined the chat";
            case "logout" -> "left the chat";
            default -> throw new IllegalStateException("Unexpected value: " + type);
        };
        ChatMessage chatMessage = new ChatMessage(username, message, Instant.now().getEpochSecond());
        TextMessage textMessage = new TextMessage(chatMessage.toString());

        for (WebSocketSession activeSession : activeSessions) {
            activeSession.sendMessage(textMessage);
        }

        String serverMessage = "Welcome to Netwalker! You are now connected to the new chat server. Join us on Discord: https://discord.gg/CmtvmcbPCq";
        ChatMessage welcomeMessage = new ChatMessage("Netwalker", serverMessage, Instant.now().getEpochSecond());
        TextMessage welcomeTextMessage = new TextMessage(welcomeMessage.toString());
        session.sendMessage(welcomeTextMessage);
    }
}
