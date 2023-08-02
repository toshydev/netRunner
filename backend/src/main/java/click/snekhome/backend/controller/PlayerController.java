package click.snekhome.backend.controller;

import click.snekhome.backend.model.Coordinates;
import click.snekhome.backend.model.Player;
import click.snekhome.backend.service.PlayerService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/player")
public class PlayerController {
    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    public Player getPlayer() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return playerService.getPlayer(username);
    }

    @GetMapping("{id}")
    public String getPlayerName(@PathVariable String id) {
        return playerService.getPlayerNameById(id);
    }

    @PutMapping("location")
    public Player updateLocation(@RequestBody Coordinates coordinates) {
        return playerService.updateLocation(coordinates);
    }

}
