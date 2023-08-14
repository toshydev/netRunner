package click.snekhome.backend.service;

import click.snekhome.backend.exception.NoSuchPlayerException;
import click.snekhome.backend.model.Coordinates;
import click.snekhome.backend.model.Player;
import click.snekhome.backend.repo.PlayerRepo;
import click.snekhome.backend.security.UserData;
import click.snekhome.backend.util.IdService;
import click.snekhome.backend.util.ItemSize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

import static click.snekhome.backend.util.PlayerFunctions.buyAttackPoints;

@Service
public class PlayerService {
    private final PlayerRepo playerRepo;
    public PlayerService(PlayerRepo playerRepo) {
        this.playerRepo = playerRepo;
    }

    public void createPlayer(UserData userData) {
        IdService idService = new IdService();
        long fiveMinutesAgo = Instant.now().getEpochSecond() - 300;
        Player player = new Player(
                idService.generateId(),
                userData.id(),
                userData.username(),
                new Coordinates(0, 0, Instant.now().getEpochSecond()),
                1,
                0,
                100,
                100,
                100,
                5,
                10,
                0,
                fiveMinutesAgo
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
                player.credits(),
                player.lastScan()
        );
        return this.playerRepo.save(updatedPlayer);
    }

    public void updatePlayer(String id, Player updatedPlayer) {
        Player player = this.playerRepo.findPlayerByid(id).orElseThrow(() -> new NoSuchPlayerException(id));
        Player newPlayer = new Player(
                player.id(),
                player.userId(),
                player.name(),
                player.coordinates(),
                updatedPlayer.level(),
                updatedPlayer.experience(),
                updatedPlayer.experienceToNextLevel(),
                updatedPlayer.health(),
                updatedPlayer.maxHealth(),
                updatedPlayer.attack(),
                updatedPlayer.maxAttack(),
                updatedPlayer.credits(),
                updatedPlayer.lastScan()
        );
        this.playerRepo.save(newPlayer);
    }

    public List<Player> getEnemies() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        Player player = this.getPlayer(username);
        return this.playerRepo.findAllByNameIsNot(player.name());
    }

    public Player buyItem(ItemSize itemSize) {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        Player player = this.getPlayer(username);
        Player updatedPlayer = buyAttackPoints(player, itemSize);
        return this.playerRepo.save(updatedPlayer);
    }
}
