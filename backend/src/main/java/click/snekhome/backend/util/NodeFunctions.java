package click.snekhome.backend.util;

import click.snekhome.backend.model.Modifier;
import click.snekhome.backend.model.Node;

import java.security.SecureRandom;
import java.time.Instant;

public class NodeFunctions {

    private NodeFunctions() {
    }

    public static boolean hasOwner(Node node) {
        return node.ownerId() != null;
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

    public static Modifier getModifier(Node node) {
        int experienceModifier = 0;
        int attackModifier = 0;
        int creditsModifier = 0;
        int randInt = new SecureRandom().nextInt(3);
        switch (node.name()) {
            case "Trading interface" -> creditsModifier = 2;
            case "Server farm" -> experienceModifier = 2;
            case "Database access" -> attackModifier = 1;
            case "CCTV control" -> {
                if (randInt == 0) {
                    creditsModifier = 2;
                } else if (randInt == 1) {
                    experienceModifier = 2;
                } else {
                    attackModifier = 2;
                }
            }
            default -> {
                experienceModifier = 2;
                attackModifier = 2;
                creditsModifier = 2;
            }
        }
        return new Modifier(
                experienceModifier,
                attackModifier,
                creditsModifier
        );
    }
}
