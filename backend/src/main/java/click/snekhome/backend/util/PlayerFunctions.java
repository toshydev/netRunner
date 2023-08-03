package click.snekhome.backend.util;

import click.snekhome.backend.model.Player;

public class PlayerFunctions {

    private PlayerFunctions() {
    }

    public static Player addExperience(Player player, int experience) {
        int newExperience = player.experience() + experience;
        int newExperienceToNextLevel = player.experienceToNextLevel();
        int newLevel = player.level();
        if (newExperience >= player.experienceToNextLevel()) {
            newExperience -= player.experienceToNextLevel();
            newExperienceToNextLevel = (int) (player.experienceToNextLevel() * 1.5);
            newLevel++;
        }
        return new Player(
                player.id(),
                player.userId(),
                player.name(),
                player.coordinates(),
                newLevel,
                newExperience,
                newExperienceToNextLevel,
                player.health(),
                player.maxHealth(),
                player.attack(),
                player.maxAttack(),
                player.credits()
        );
    }

    public static Player useAttackPoints(Player player, int attackPoints) {
        int newAttackPoints = player.attack() - attackPoints;
        return new Player(
                player.id(),
                player.userId(),
                player.name(),
                player.coordinates(),
                player.level(),
                player.experience(),
                player.experienceToNextLevel(),
                player.health(),
                player.maxHealth(),
                newAttackPoints,
                player.maxAttack(),
                player.credits()
        );
    }

    public static Player getCredits(Player player, int credits) {
        int newCredits = player.credits() + credits;
        return new Player(
                player.id(),
                player.userId(),
                player.name(),
                player.coordinates(),
                player.level(),
                player.experience(),
                player.experienceToNextLevel(),
                player.health(),
                player.maxHealth(),
                player.attack(),
                player.maxAttack(),
                newCredits
        );
    }
}
