package click.snekhome.backend.service;

import click.snekhome.backend.exception.NoSuchPlayerException;
import click.snekhome.backend.model.Coordinates;
import click.snekhome.backend.model.Player;
import click.snekhome.backend.repo.PlayerRepo;
import click.snekhome.backend.util.CalculateDistance;
import click.snekhome.backend.util.CalculateSpeed;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PlayerServiceTest {

    private final PlayerRepo playerRepo = mock(PlayerRepo.class);
    private final PlayerService playerService = new PlayerService(playerRepo);
    private final Authentication authentication = mock(Authentication.class);
    private final SecurityContext securityContext = mock(SecurityContext.class);
    private final CalculateDistance calculateDistance = mock(CalculateDistance.class);
    private final CalculateSpeed calculateSpeed = mock(CalculateSpeed.class);
    @Test
    void expectPlayerNameWhenIdIsGiven() {
        //given
        Player player = new Player("abc", "123", "playerunknown", null, 1, 0, 100, 100, 100, 5, 10, 0);
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

    @Test
    void expectFalseWhenCoordinatesTooFarApart() {
        //given
        Coordinates oldCoordinates = new Coordinates(50.0, 50.0, 1000);
        Coordinates newCoordinates = new Coordinates(100.0, 100.0, 2000);
        //when
        boolean actual = playerService.validateLocation(oldCoordinates, newCoordinates);
        //then
        assertFalse(actual);
    }

    @Test
    void expectUpdatedPlayerWhenCoordinatesAreValid() {
        //given
        Coordinates oldCoordinates = new Coordinates(50.0, 50.0, 1000);
        Coordinates newCoordinates = new Coordinates(50.0, 50.0, 2000);
        Player player = new Player("abc", "123", "playerunknown", oldCoordinates, 1, 0, 100, 100, 100, 5, 10, 0);
        //when
        when(authentication.getName()).thenReturn("playerunknown");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("playerunknown");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(playerRepo.findPlayerByName("playerunknown")).thenReturn(Optional.of(player));
        when(playerRepo.save(player)).thenReturn(player);
        Player actual = playerService.updateLocation(newCoordinates);
        //then
        assertEquals(newCoordinates, actual.coordinates());
    }

}