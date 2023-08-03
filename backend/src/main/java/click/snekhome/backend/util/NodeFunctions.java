package click.snekhome.backend.util;

import click.snekhome.backend.model.Node;

import java.time.Instant;

public class NodeFunctions {

    private NodeFunctions() {
    }
    public static Node takeDamage(Node node, int damage) {
        int newHealth = node.health() - (damage - damage * node.level() / 100);
        if (newHealth < 0) {
            newHealth = 0;
        }
        return new Node(
                node.id(),
                node.ownerId(),
                node.name(),
                node.level(),
                newHealth,
                node.coordinates(),
                node.lastUpdate(),
                Instant.now().getEpochSecond()
        );
    }
}
