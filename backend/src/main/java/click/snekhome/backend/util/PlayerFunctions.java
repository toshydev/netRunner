package click.snekhome.backend.util;

import click.snekhome.backend.model.Player;

import java.time.Instant;

public class PlayerFunctions {

    private PlayerFunctions() {
    }

    public static Player addExperience(Player player, int experience) {
        int newExperience = player.experience() + experience;
        int newExperienceToNextLevel = player.experienceToNextLevel();
        int newLevel = player.level();
        int newAttack = player.attack();
        int newMaxAttack = player.maxAttack();
        if (newExperience >= player.experienceToNextLevel()) {
            newExperience -= player.experienceToNextLevel();
            newExperienceToNextLevel = (int) (player.experienceToNextLevel() * 1.5);
            newLevel++;
            if (newAttack + 5 + (newLevel - 1) * 2 >= player.maxAttack()) {
                newAttack = player.maxAttack();
            } else {
                newAttack += 5 + (newLevel - 1) * 2;
            }
            newMaxAttack = player.maxAttack() + 10 + (newLevel - 1) * 2;
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
                newAttack,
                newMaxAttack,
                player.credits(),
                player.lastScan()
        );
    }

    public static Player useAttackPoints(Player player, int attackPoints) {
        if (player.attack() >= attackPoints) {
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
                    player.credits(),
                    player.lastScan()
            );
        } else {
            return player;
        }
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
                newCredits,
                player.lastScan()
        );
    }

    public static Player useScan(Player player) {
        long newLastScan = Instant.now().getEpochSecond();
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
                player.credits(),
                newLastScan
        );
    }

    public static int increaseAttackPoints(int attackPoints, int maxAttackPoints, int increase) {
        return Math.min(attackPoints + increase, maxAttackPoints);
    }

    public static Player buyAttackPoints(Player player, ItemSize itemSize) {
        int newCredits = player.credits();
        int newAttackPoints = switch (itemSize) {
            case SMALL -> {
                if (player.credits() >= 1000) {
                    newCredits = player.credits() - 1000;
                    yield increaseAttackPoints(player.attack(), player.maxAttack(), 1);
                }
                yield player.attack();
            }
            case MEDIUM -> {
                if (player.credits() >= 4000) {
                    newCredits = player.credits() - 4000;
                    yield increaseAttackPoints(player.attack(), player.maxAttack(), 5);
                }
                yield player.attack();
            }
            case LARGE -> {
                if (player.credits() >= 7500) {
                    newCredits = player.credits() - 7500;
                    yield increaseAttackPoints(player.attack(), player.maxAttack(), 10);
                }
                yield player.attack();
            }
        };
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
                newCredits,
                player.lastScan()
        );}
}
