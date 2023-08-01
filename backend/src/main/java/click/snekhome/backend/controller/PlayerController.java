package click.snekhome.backend.controller;

import click.snekhome.backend.model.Player;
import click.snekhome.backend.service.PlayerService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
