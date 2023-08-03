package click.snekhome.backend.util;

import click.snekhome.backend.model.Coordinates;
import click.snekhome.backend.model.Node;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class NodeFunctionsTest {

    @Test
    void testTakeDamageWithPositiveDamage() {
        Node initialNode = new Node("1", "player1", "Node1", 10, 100, new Coordinates(0, 0, 0), 0, 0);
        int damage = 30;
        int expectedNewHealth = initialNode.health() - (damage - damage * initialNode.level() / 100);
        if (expectedNewHealth < 0) {
            expectedNewHealth = 0;
        }
        Node newNode = NodeFunctions.takeDamage(initialNode, damage);
        assertEquals(expectedNewHealth, newNode.health());
    }

    @Test
    void testTakeDamageWithNegativeDamage() {
        Node initialNode = new Node("1", "player1", "Node1", 10, 100, new Coordinates(0, 0, 0), 0, 0);
        int damage = -20;
        int expectedNewHealth = initialNode.health() - (damage - damage * initialNode.level() / 100);
        if (expectedNewHealth < 0) {
            expectedNewHealth = 0;
        }
        Node newNode = NodeFunctions.takeDamage(initialNode, damage);
        assertEquals(expectedNewHealth, newNode.health());
    }

    @Test
    void testTakeDamageWithZeroDamage() {
        Node initialNode = new Node("1", "player1", "Node1", 10, 100, new Coordinates(0, 0, 0), 0, 0);
        Node newNode = NodeFunctions.takeDamage(initialNode, 0);
        assertEquals(initialNode.health(), newNode.health());
    }

    @Test
    void testHealthCannotBeNegative() {
        Node initialNode = new Node("1", "player1", "Node1", 10, 100, new Coordinates(0, 0, 0), 0, 0);
        int damage = 200;
        Node newNode = NodeFunctions.takeDamage(initialNode, damage);
        assertEquals(0, newNode.health());
    }
}
