package click.snekhome.backend.service;

import click.snekhome.backend.exception.NoSuchPlayerException;
import click.snekhome.backend.model.Coordinates;
import click.snekhome.backend.model.Player;
import click.snekhome.backend.repo.PlayerRepo;
import click.snekhome.backend.security.UserData;
import click.snekhome.backend.util.IdService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class PlayerService {
    private final PlayerRepo playerRepo;
    public PlayerService(PlayerRepo playerRepo) {
        this.playerRepo = playerRepo;
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
        Player player = this.playerRepo.findPlayerByid(id).orElseThrow(() -> new NoSuchPlayerException(id));
        return player.name();
    }

    public Player updateLocation(Coordinates coordinates) {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        Player player = this.getPlayer(username);
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
}
