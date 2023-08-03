package click.snekhome.backend.service;

import click.snekhome.backend.exception.WrongRoleException;
import click.snekhome.backend.model.Node;
import click.snekhome.backend.model.NodeData;
import click.snekhome.backend.model.Player;
import click.snekhome.backend.repo.NodeRepo;
import click.snekhome.backend.security.MongoUser;
import click.snekhome.backend.security.MongoUserService;
import click.snekhome.backend.security.Role;
import click.snekhome.backend.util.ActionType;
import click.snekhome.backend.util.IdService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

import static click.snekhome.backend.util.Calculation.getDistance;
import static click.snekhome.backend.util.NodeFunctions.takeDamage;
import static click.snekhome.backend.util.PlayerFunctions.*;

@Service
public class NodeService {

    private static final int MAX_DISTANCE = 50;
    private final NodeRepo nodeRepo;
    private final IdService idService;
    private final MongoUserService mongoUserService;
    private final PlayerService playerService;

    public NodeService(NodeRepo nodeRepo, IdService idService, MongoUserService mongoUserService, PlayerService playerService) {
        this.nodeRepo = nodeRepo;
        this.idService = idService;
        this.mongoUserService = mongoUserService;
        this.playerService = playerService;
    }

    public List<Node> list() {
        return this.nodeRepo.findAll();
    }

    public Node add(NodeData nodeData) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        MongoUser user = this.mongoUserService.getUserByUsername(username);
        if (user.role().equals(Role.ADMIN)) {
            Node node = new Node(
                    this.idService.generateId(),
                    null,
                    nodeData.name(),
                    0,
                    100,
                    nodeData.coordinates(),
                    Instant.now().getEpochSecond(),
                    0
            );
            this.nodeRepo.insert(node);
            return node;
        } else {
            throw new WrongRoleException("You are not an admin");
        }
    }

    public Node edit(String id, ActionType actionType) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Player player = this.playerService.getPlayer(username);
        Node node = this.nodeRepo.findById(id).orElseThrow();
        Node newNode;

        if (getDistance(player.coordinates().latitude(), player.coordinates().longitude(), node.coordinates().latitude(), node.coordinates().longitude()) > MAX_DISTANCE) {
            return node;
        }

        if ((node.ownerId() == null || node.health() == 0) && player.attack() > 0) {
            newNode = handleNonOwnedNode(player, node, actionType);
        } else if (node.ownerId() != null && node.ownerId().equals(player.id())) {
            newNode = handleOwnedNode(player, node, actionType);
        } else {
            newNode = handleAttackedNode(player, node, actionType);
        }

        return this.nodeRepo.save(newNode);
    }

    private Node handleNonOwnedNode(Player player, Node node, ActionType actionType) {
        if (actionType == ActionType.HACK) {
            Node newNode = new Node(
                    node.id(),
                    player.id(),
                    node.name(),
                    node.level() + 1,
                    100,
                    node.coordinates(),
                    Instant.now().getEpochSecond(),
                    node.lastAttack()
            );
            Player updatedPlayer = useAttackPoints(player, newNode.level());
            updatedPlayer = addExperience(updatedPlayer, newNode.level() * 10);
            playerService.updatePlayer(player.id(), updatedPlayer);
            return newNode;
        } else {
            return node;
        }
    }

    private Node handleOwnedNode(Player player, Node node, ActionType actionType) {
        if (actionType == ActionType.HACK) {
            Node newNode = new Node(
                    node.id(),
                    node.ownerId(),
                    node.name(),
                    node.level() + 1,
                    100,
                    node.coordinates(),
                    Instant.now().getEpochSecond(),
                    node.lastAttack()
            );
            Player updatedPlayer = useAttackPoints(player, newNode.level());
            updatedPlayer = addExperience(updatedPlayer, newNode.level() * 10);
            playerService.updatePlayer(player.id(), updatedPlayer);
            return newNode;
        } else if (actionType == ActionType.ABANDON) {
            Node newNode;
            if (node.level() == 1) {
                newNode = new Node(
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
                newNode = new Node(
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
            Player updatedPlayer = useAttackPoints(player, -1);
            playerService.updatePlayer(player.id(), updatedPlayer);
            return newNode;
        } else {
            return node;
        }
    }

    private Node handleAttackedNode(Player player, Node node, ActionType actionType) {
        if (actionType == ActionType.HACK) {
            Node newNode = takeDamage(node, player.level() * 10);
            Player updatedPlayer = getCredits(player, newNode.level() * 10);
            updatedPlayer = addExperience(updatedPlayer, newNode.level() * 10);
            playerService.updatePlayer(player.id(), updatedPlayer);
            return newNode;
        } else {
            return node;
        }
    }

    public void delete(String id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        MongoUser user = this.mongoUserService.getUserByUsername(username);
        if (user.role().equals(Role.ADMIN)) {
            this.nodeRepo.deleteById(id);
        } else {
            throw new WrongRoleException("You are not an admin");
        }
    }
}
