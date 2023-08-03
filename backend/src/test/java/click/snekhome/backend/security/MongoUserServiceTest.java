package click.snekhome.backend.security;

import click.snekhome.backend.exception.UsernameAlreadyExistsException;
import click.snekhome.backend.service.PlayerService;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MongoUserServiceTest {
    private final MongoUserRepository mongoUserRepository = mock(MongoUserRepository.class);
    private final PlayerService playerService = mock(PlayerService.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final MongoUserService mongoUserService = new MongoUserService(mongoUserRepository, playerService);

    @Test
    void expectUserData_whenUsernameIsGiven() {
        //given
        MongoUser expected = new MongoUser("abc", "playerunknown", "player@example.com", "password", Role.PLAYER);
        String username = "playerunknown";
        //when
        when(mongoUserRepository.findByUsername(username)).thenReturn(java.util.Optional.of(expected));
        UserData actual = mongoUserService.getUserDataByUsername(username);
        //then
        assertEquals(expected.username(), actual.username());
        assertEquals(expected.id(), actual.id());
        verify(mongoUserRepository).findByUsername(username);
    }

    @Test
    void expectUser_whenUsernameIsGiven() {
        //given
        MongoUser expected = new MongoUser("abc", "playerunknown", "player@example.com", "password", Role.PLAYER);
        String username = "playerunknown";
        //when
        when(mongoUserRepository.findByUsername(username)).thenReturn(java.util.Optional.of(expected));
        MongoUser actual = mongoUserService.getUserByUsername(username);
        //then
        assertEquals(expected, actual);
        verify(mongoUserRepository).findByUsername(username);
    }

    @Test
    void expectUsernameAlreadyExistsException_whenRegisteringWithExistingUsername() {
        //given
        String username = "playerunknown";
        UserWithoutId user = new UserWithoutId("playerunknown", "player@example.com", "password");
        UsernameAlreadyExistsException exception = new UsernameAlreadyExistsException("Username already exists");
        //when
        when(mongoUserRepository.findByUsername(username)).thenThrow(exception);
        //then
        assertThrows(RuntimeException.class, () -> mongoUserService.registerUser(user));
        assertInstanceOf(RuntimeException.class, exception);
    }

    @Test
    void expectPlayerCreation_whenRegisteringNewUser() {
        //given
        String username = "playerunknown";
        UserWithoutId user = new UserWithoutId("playerunknown", "player@example.com", "password");
        //when
        when(passwordEncoder.encode(user.password())).thenReturn("password");
        when(mongoUserRepository.findByUsername(username)).thenReturn(java.util.Optional.empty());
        mongoUserService.registerUser(user);
        //then
        verify(playerService).createPlayer(any());
    }

}