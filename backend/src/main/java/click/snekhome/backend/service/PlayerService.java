package click.snekhome.backend.service;

import click.snekhome.backend.exception.NoSuchPlayerException;
import click.snekhome.backend.model.Coordinates;
import click.snekhome.backend.model.Player;
import click.snekhome.backend.repo.PlayerRepo;
import click.snekhome.backend.security.UserData;
import click.snekhome.backend.util.IdService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

import static click.snekhome.backend.util.CalculateDistance.calculateDistance;

@Service
public class PlayerService {
    private static final double MAX_ALLOWED_SPEED = 20.0;
    private final PlayerRepo playerRepo;

    public PlayerService(PlayerRepo playerRepo) {
        this.playerRepo = playerRepo;
    }

    public boolean validateLocation(Coordinates oldCoordinates, Coordinates newCoordinates) {
        BigDecimal distance = calculateDistance(
                oldCoordinates.latitude(),
                oldCoordinates.longitude(),
                newCoordinates.latitude(),
                newCoordinates.longitude()
        );

        long timeDifferenceInSeconds = newCoordinates.timestamp() - oldCoordinates.timestamp();
        if (timeDifferenceInSeconds <= 0) {
            return false;
        }

        BigDecimal timeDifferenceInHours = BigDecimal.valueOf(timeDifferenceInSeconds).divide(BigDecimal.valueOf(3600), 2, BigDecimal.ROUND_HALF_UP);
        BigDecimal speed = distance.divide(timeDifferenceInHours, 2, BigDecimal.ROUND_HALF_UP);

        return speed.compareTo(BigDecimal.valueOf(MAX_ALLOWED_SPEED)) <= 0;
    }


    public void createPlayer(UserData userData) {
        IdService idService = new IdService();
        Player player = new Player(
                idService.generateId(),
                userData.id(),
                userData.username(),
                null,
                1,
                0,
                100,
                100,
                100,
                5,
                10,
                0
        );
        this.playerRepo.save(player);
    }

    public Player getPlayer(String name) {
        return this.playerRepo.findPlayerByName(name).orElseThrow();
    }

    public String getPlayerNameById(String id) {
        Player player = this.playerRepo.findPlayerByid(id).orElseThrow( () -> new NoSuchPlayerException(id));
        return player.name();
    }

    public Player updateLocation(Coordinates coordinates) {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        Player player = this.getPlayer(username);
        if (player.coordinates() == null || (player.coordinates().latitude() == 0 && player.coordinates().longitude() == 0) || validateLocation(player.coordinates(), coordinates)) {
            Player updatedPlayer = new Player(
                    player.id(),
                    player.userId(),
                    player.name(),
                    coordinates,
                    player.level(),
                    player.experience(),
                    player.experienceToNextLevel(),
                    player.health(),
                    player.maxHealth(),
                    player.attack(),
                    player.maxAttack(),
                    player.credits()
            );
            return this.playerRepo.save(updatedPlayer);
        }
        return player;
    }



}
