package click.snekhome.backend.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WebSocketControllerUnitTest {

    @InjectMocks
    private WebSocketController webSocketController;

    @Mock
    private WebSocketSession mockSession1;

    @Mock
    private WebSocketSession mockSession2;

    @Test
    void testAfterConnectionEstablished() throws Exception {
        when(mockSession1.getPrincipal()).thenReturn(() -> "username");

        webSocketController.afterConnectionEstablished(mockSession1);

        verify(mockSession1).getPrincipal();
        verify(mockSession1, times(3)).sendMessage(any(TextMessage.class));
    }

    @Test
    void testHandleTextMessage() throws Exception {
        when(mockSession1.getPrincipal()).thenReturn(() -> "username");

        String payload = "Hello!";
        TextMessage textMessage = new TextMessage(payload);
        webSocketController.activeSessions.add(mockSession1);
        webSocketController.handleTextMessage(mockSession1, textMessage);

        verify(mockSession1).getPrincipal();
        verify(mockSession1).sendMessage(any(TextMessage.class));
    }

    @Test
    void testAfterConnectionClosed() throws Exception {
        when(mockSession1.getPrincipal()).thenReturn(() -> "username");

        webSocketController.activeSessions.add(mockSession1);
        webSocketController.activeSessions.add(mockSession2);

        webSocketController.afterConnectionClosed(mockSession1, null);

        verify(mockSession1).getPrincipal();
        verify(mockSession2, times(2)).sendMessage(any(TextMessage.class));
    }

    @Test
    void testBroadcastMessage() throws IOException {
        webSocketController.activeSessions.add(mockSession1);

        webSocketController.broadcastMessage("Message");

        verify(mockSession1).sendMessage(any(TextMessage.class));
    }

    @Test
    void testWelcomeUser() throws IOException {
        webSocketController.welcomeUser(mockSession1);

        verify(mockSession1).sendMessage(any(TextMessage.class));
    }
}
