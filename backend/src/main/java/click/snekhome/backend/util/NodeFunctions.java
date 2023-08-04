package click.snekhome.backend.util;

import click.snekhome.backend.model.Node;

import java.time.Instant;

public class NodeFunctions {

    private NodeFunctions() {
    }

    public static Node claimNode(Node node, String ownerId) {
        return new Node(
                node.id(),
                ownerId,
                node.name(),
                1,
                100,
                node.coordinates(),
                Instant.now().getEpochSecond(),
                node.lastAttack()
        );
    }

    public static Node upgradeNode(Node node) {
        int newLevel = node.level() + 1;
        return new Node(
                node.id(),
                node.ownerId(),
                node.name(),
                newLevel,
                100,
                node.coordinates(),
                Instant.now().getEpochSecond(),
                node.lastAttack()
        );
    }

    public static Node downgradeNode(Node node) {
        if (node.level() - 1 == 0) {
            return new Node(
                    node.id(),
                    null,
                    node.name(),
                    0,
                    100,
                    node.coordinates(),
                    Instant.now().getEpochSecond(),
                    node.lastAttack()
            );
        } else {
            return new Node(
                    node.id(),
                    node.ownerId(),
                    node.name(),
                    node.level() - 1,
                    100,
                    node.coordinates(),
                    Instant.now().getEpochSecond(),
                    node.lastAttack()
            );
        }
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
