package click.snekhome.backend.controller;

import click.snekhome.backend.model.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    final Set<WebSocketSession> activeSessions = new HashSet<>();
    final Set<String> activeUsers = new HashSet<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(@NotNull WebSocketSession session) throws Exception {
        String username = Objects.requireNonNull(session.getPrincipal()).getName();
        activeSessions.add(session);
        activeUsers.add(username);
        String message = username + " is online";
        broadcastMessage(message);
        welcomeUser(session);
        sendActiveUsers();
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
    public void afterConnectionClosed(@NotNull WebSocketSession session, CloseStatus status) throws Exception {
        String username = Objects.requireNonNull(session.getPrincipal()).getName();
        activeSessions.remove(session);
        activeUsers.remove(username);
        String message = username + " disconnected";
        broadcastMessage(message);
        sendActiveUsers();
    }

    void broadcastMessage(String message) throws IOException {
        ChatMessage chatMessage = new ChatMessage("Netwalker", message, Instant.now().getEpochSecond());
        TextMessage textMessage = new TextMessage(chatMessage.toString());
        for (WebSocketSession activeSession : activeSessions) {
            activeSession.sendMessage(textMessage);
        }
    }

    void welcomeUser(WebSocketSession session) throws IOException {
        String serverMessage = "Welcome to Netwalker! You are now connected to the new chat server. Join us on Discord: https://discord.gg/CmtvmcbPCq";
        ChatMessage welcomeMessage = new ChatMessage("Netwalker", serverMessage, Instant.now().getEpochSecond());
        TextMessage welcomeTextMessage = new TextMessage(welcomeMessage.toString());
        session.sendMessage(welcomeTextMessage);
    }

    void sendActiveUsers() throws IOException {
        String json = objectMapper.writeValueAsString(activeUsers);
        TextMessage message = new TextMessage(json);
        for (WebSocketSession activeSession : activeSessions) {
            activeSession.sendMessage(message);
        }
    }
}
