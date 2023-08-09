package click.snekhome.backend.controller;

import click.snekhome.backend.model.Coordinates;
import click.snekhome.backend.model.Player;
import click.snekhome.backend.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/player")
public class PlayerController {
    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public Player getPlayer() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return playerService.getPlayer(username);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("{id}")
    public String getPlayerName(@PathVariable String id) {
        return playerService.getPlayerNameById(id);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("info/{name}")
    public Player getPlayerByName(@PathVariable String name) {
        return playerService.getPlayer(name);
    }

    @ResponseStatus(HttpStatus.ACCEPTED)
    @PutMapping("location")
    public Player updateLocation(@RequestBody Coordinates coordinates) {
        return playerService.updateLocation(coordinates);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("enemies")
    public List<Player> getEnemies() {
        return this.playerService.getEnemies();
    }

}
