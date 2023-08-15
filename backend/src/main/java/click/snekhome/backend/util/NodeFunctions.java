package click.snekhome.backend.util;

import click.snekhome.backend.model.Modifier;
import click.snekhome.backend.model.Node;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;

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
        int experienceModifier = 1;
        int attackModifier = 0;
        int creditsModifier = 1;
        int randInt = new SecureRandom().nextInt(3);
        switch (node.name()) {
            case "Trading interface" -> creditsModifier = 2;
            case "Server farm" -> attackModifier = 1;
            case "Database access" -> experienceModifier = 2;
            case "CCTV control" -> {
                if (randInt == 0) {
                    creditsModifier = 2;
                } else if (randInt == 1) {
                    experienceModifier = 2;
                } else {
                    attackModifier = 1;
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

    public static int calculateLevel(String nodeName) {
        int level;
        SecureRandom random = new SecureRandom();
        switch (nodeName) {
            case "Trading interface" -> level = random.nextInt(5) + 1;
            case "Server farm" -> level = random.nextInt(1, 15) + 16;
            case "Database access" -> level = random.nextInt(1, 5) + 6;
            case "CCTV control" -> level = random.nextInt(10) + 1;
            default -> level = random.nextInt(3) + 1;
        }
        return level;
    }

    public static String getRandomString(List<String> strings) {
        SecureRandom random = new SecureRandom();
        int randInt = random.nextInt(strings.size());
        return strings.get(randInt);
    }
}
