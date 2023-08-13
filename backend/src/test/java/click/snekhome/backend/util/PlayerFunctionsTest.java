package click.snekhome.backend.util;

import click.snekhome.backend.model.Coordinates;
import click.snekhome.backend.model.Player;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PlayerFunctionsTest {

    @Test
    void testAddExperienceWithLevelUp() {
        Player initialPlayer = new Player("1", "user1", "Player1", new Coordinates(0, 0, 0), 1, 0, 100, 100, 100, 15, 25, 50, 0);
        int experienceToAdd = 200;
        int expectedNewLevel = initialPlayer.level() + 1;
        int expectedNewExperience = experienceToAdd - initialPlayer.experienceToNextLevel();
        int expectedNewExperienceToNextLevel = (int) (initialPlayer.experienceToNextLevel() * 1.5);
        Player newPlayer = PlayerFunctions.addExperience(initialPlayer, experienceToAdd);
        assertTrue(newPlayer.attack() > initialPlayer.attack() & newPlayer.attack() <= initialPlayer.maxAttack());
        assertEquals(expectedNewLevel, newPlayer.level());
        assertEquals(expectedNewExperience, newPlayer.experience());
        assertEquals(expectedNewExperienceToNextLevel, newPlayer.experienceToNextLevel());
    }

    @Test
    void testAddExperienceWithoutLevelUp() {
        Player initialPlayer = new Player("1", "user1", "Player1", new Coordinates(0, 0, 0), 3, 150, 200, 100, 100, 100, 200, 50, 0);
        int experienceToAdd = 49;
        int expectedNewLevel = initialPlayer.level();
        int expectedNewExperience = initialPlayer.experience() + experienceToAdd;
        int expectedNewExperienceToNextLevel = initialPlayer.experienceToNextLevel();
        Player newPlayer = PlayerFunctions.addExperience(initialPlayer, experienceToAdd);
        assertEquals(expectedNewLevel, newPlayer.level());
        assertEquals(expectedNewExperience, newPlayer.experience());
        assertEquals(expectedNewExperienceToNextLevel, newPlayer.experienceToNextLevel());
    }

    @Test
    void testAttackCannotExceedMaxAttackWhenLevelUp() {
        Player initialPlayer = new Player("1", "user1", "Player1", new Coordinates(0, 0, 0), 1, 0, 100, 100, 100, 20, 25, 50, 0);
        int experienceToAdd = 200;
        int expectedNewLevel = initialPlayer.level() + 1;
        int expectedNewExperience = experienceToAdd - initialPlayer.experienceToNextLevel();
        int expectedNewExperienceToNextLevel = (int) (initialPlayer.experienceToNextLevel() * 1.5);
        Player newPlayer = PlayerFunctions.addExperience(initialPlayer, experienceToAdd);
        assertTrue(newPlayer.attack() > initialPlayer.attack() & newPlayer.attack() <= initialPlayer.maxAttack());
        assertEquals(expectedNewLevel, newPlayer.level());
        assertEquals(expectedNewExperience, newPlayer.experience());
        assertEquals(expectedNewExperienceToNextLevel, newPlayer.experienceToNextLevel());
    }

    @Test
    void testPlayerIsUnchangedWhenNotEnoughAttackPoints() {
        Player initialPlayer = new Player("1", "user1", "Player1", new Coordinates(0, 0, 0), 1, 0, 100, 100, 100, 15, 25, 50, 0);
        int attackPointsToUse = 20;
        Player newPlayer = PlayerFunctions.useAttackPoints(initialPlayer, attackPointsToUse);
        assertEquals(initialPlayer, newPlayer);
    }
}
