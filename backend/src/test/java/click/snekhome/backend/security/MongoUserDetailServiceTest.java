package click.snekhome.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class MongoUserDetailServiceTest {

    private final MongoUserRepository userRepository = mock(MongoUserRepository.class);
    private final MongoUserDetailService userDetailService = new MongoUserDetailService(userRepository);

    @Test
    void expectLoadedUserByUsername() {
        //given
        MongoUser expected = new MongoUser("abc", "playerunknown", "player@example.com", "password", Role.PLAYER);
        String username = "playerunknown";
        //when
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(expected));
        UserDetails actual = userDetailService.loadUserByUsername("playerunknown");
        //then
        assertEquals(expected.username(), actual.getUsername());
        verify(userRepository).findByUsername(username);
    }
}
