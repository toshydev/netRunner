package click.snekhome.backend.service;

import click.snekhome.backend.exception.NoSuchPlayerException;
import click.snekhome.backend.model.Player;
import click.snekhome.backend.repo.PlayerRepo;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PlayerServiceTest {

    private final PlayerRepo playerRepo = mock(PlayerRepo.class);
    private final PlayerService playerService = new PlayerService(playerRepo);
    @Test
    void expectPlayerNameWhenIdIsGiven() {
        //given
        Player player = new Player("abc", "123", "playerunknown", null, 1, 0, 100, 100, 100, 5, 10, 0, 0);
        String id = "abc";
        String expected = "playerunknown";
        //when
        when(playerRepo.findPlayerByid(id)).thenReturn(Optional.of(player));
        String actual = playerService.getPlayerNameById(id);
        //then
        assertEquals(expected, actual);
    }

    @Test
    void expectNoSuchPlayerExceptionWhenIdIsGiven() {
        //given
        String id = "abc";
        //when
        when(playerRepo.findPlayerByid(id)).thenReturn(Optional.empty());
        //then
        assertThrows(NoSuchPlayerException.class, () -> playerService.getPlayerNameById(id));
    }
}
