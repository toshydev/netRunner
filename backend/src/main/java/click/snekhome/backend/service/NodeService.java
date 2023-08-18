package click.snekhome.backend.service;

import click.snekhome.backend.exception.WrongRoleException;
import click.snekhome.backend.model.*;
import click.snekhome.backend.repo.NodeRepo;
import click.snekhome.backend.security.MongoUser;
import click.snekhome.backend.security.MongoUserService;
import click.snekhome.backend.security.Role;
import click.snekhome.backend.util.ActionType;
import click.snekhome.backend.util.IdService;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static click.snekhome.backend.util.Calculation.getDistance;
import static click.snekhome.backend.util.Calculation.getSecondsSince;
import static click.snekhome.backend.util.NodeFunctions.*;
import static click.snekhome.backend.util.PlayerFunctions.*;

@Service
@EnableScheduling
public class NodeService {
    private final List<String> initialPlayers = List.of("Arasaka", "Militech", "Kang Tao", "Biotechnica", "Petrochem", "Kendachi", "NetWatch");
    private static final int MAX_DISTANCE = 250;
    private static final long MIN_TIME_BETWEEN_SCANS = 300;
    private final NodeRepo nodeRepo;
    private final IdService idService;
    private final MongoUserService mongoUserService;
    private final PlayerService playerService;
    private final GooglePlacesService googlePlacesService;

    public NodeService(NodeRepo nodeRepo, IdService idService, MongoUserService mongoUserService, PlayerService playerService, GooglePlacesService googlePlacesService) {
        this.nodeRepo = nodeRepo;
        this.idService = idService;
        this.mongoUserService = mongoUserService;
        this.playerService = playerService;
        this.googlePlacesService = googlePlacesService;
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
        if (!hasOwner(node) || node.health() == 0) {
            newNode = handleNonOwnedNode(player, node, actionType);
        } else if (isOwner(player, node)) {
            newNode = handleOwnedNode(player, node, actionType);
        } else {
            newNode = handleAttackedNode(player, node, actionType);
        }
        return this.nodeRepo.save(newNode);
    }

    private Node handleNonOwnedNode(Player player, Node node, ActionType actionType) {
        if (actionType == ActionType.HACK && (getSecondsSince(node.lastUpdate()) > 120)) {
            Node newNode = claimNode(node, player.id());
            Player updatedPlayer = useAttackPoints(player, newNode.level());
            updatedPlayer = addExperience(updatedPlayer, newNode.level() * 10);
            playerService.updatePlayer(player.id(), updatedPlayer);
            return newNode;
        }
        return node;
    }

    private Node handleOwnedNode(Player player, Node node, ActionType actionType) {
        if (actionType == ActionType.HACK && (player.attack() >= node.level()) && (getSecondsSince(node.lastUpdate()) > node.level() * 60L)) {
            Node newNode = upgradeNode(node);
            Player updatedPlayer = useAttackPoints(player, newNode.level());
            updatedPlayer = addExperience(updatedPlayer, newNode.level() * 10);
            playerService.updatePlayer(player.id(), updatedPlayer);
            return newNode;
        } else if (actionType == ActionType.ABANDON && (getSecondsSince(node.lastUpdate()) > 120)) {
            Node newNode = downgradeNode(node);
            Player updatedPlayer = useAttackPoints(player, -1);
            playerService.updatePlayer(player.id(), updatedPlayer);
            return newNode;
        }
        return node;
    }

    private Node handleAttackedNode(Player player, Node node, ActionType actionType) {
        if (actionType == ActionType.HACK && (getSecondsSince(node.lastAttack()) > node.level() * 60L)) {
            Node newNode = takeDamage(node, player.level() * 10);
            Player updatedPlayer = hack(player, node);
            playerService.updatePlayer(player.id(), updatedPlayer);
            return newNode;

        }
        return node;
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

    public List<Node> getNodesByOwner(String id) {
        return this.nodeRepo.findAllByOwnerId(id);
    }

    @Scheduled(cron = "0 0 * * * *")
    public void generateCredits() {
        List<Node> nodes = this.nodeRepo.findAll();
        for (Node node : nodes) {
            if (node.ownerId() != null) {
                String playerName = this.playerService.getPlayerNameById(node.ownerId());
                Player player = this.playerService.getPlayer(playerName);
                player = getCredits(player, node.level() * 100);
                this.playerService.updatePlayer(player.id(), player);
            }
        }
    }

    public List<Node> scan(Coordinates coordinates) throws IOException {
        Player player = this.playerService.getPlayer(SecurityContextHolder.getContext().getAuthentication().getName());
        if (getSecondsSince(player.lastScan()) < MIN_TIME_BETWEEN_SCANS) {
            return Collections.emptyList();
        }
        Player updatedPlayer = useScan(player);
        this.playerService.updatePlayer(player.id(), updatedPlayer);
        return this.createNodes(coordinates);
    }

    public List<Node> createNodes(Coordinates coordinates) throws IOException {
        String latitude = String.valueOf(coordinates.latitude());
        String longitude = String.valueOf(coordinates.longitude());

        List<CustomPlacesResult> placesList = this.googlePlacesService.getUniquePlaces(latitude, longitude);

        List<Node> newNodes = new ArrayList<>();
        List<Node> allNodes = this.nodeRepo.findAll();
        for (CustomPlacesResult place : placesList) {
            if (allNodes.stream().noneMatch(node -> node.coordinates().latitude() == place.geometry().location().lat && node.coordinates().longitude() == place.geometry().location().lng)) {
                String nodeName = getNodeName(place);
                int level = calculateLevel(nodeName);
                String owner = getRandomString(this.initialPlayers);
                Node node = new Node(
                        this.idService.generateId(),
                        owner,
                        nodeName,
                        level,
                        100,
                        new Coordinates(place.geometry().location().lat, place.geometry().location().lng, Instant.now().getEpochSecond()),
                        Instant.now().getEpochSecond(),
                        0
                );
                newNodes.add(node);
                this.nodeRepo.insert(node);
            }
        }
        return newNodes;
    }

    static String getNodeName(CustomPlacesResult place) {
        if (place.types().contains("bank") || place.types().contains("atm") || place.types().contains("accounting") || place.types().contains("insurance_agency") || place.types().contains("real_estate_agency") || place.types().contains("jewelry_store") || place.types().contains("liquor_store")) {
            return "Trading interface";
        } else if (place.types().contains("clothing_store") || place.types().contains("convenience_store") || place.types().contains("department_store") || place.types().contains("electronics_store") || place.types().contains("furniture_store") || place.types().contains("hardware_store") || place.types().contains("home_goods_store") || place.types().contains("pet_store") || place.types().contains("shoe_store") || place.types().contains("shopping_mall") || place.types().contains("store")) {
            return "Server farm";
        } else if (place.types().contains("amusement_park") || place.types().contains("aquarium") || place.types().contains("art_gallery") || place.types().contains("bowling_alley") || place.types().contains("casino") || place.types().contains("movie_rental") || place.types().contains("movie_theater") || place.types().contains("museum") || place.types().contains("night_club") || place.types().contains("park") || place.types().contains("stadium") || place.types().contains("zoo")) {
            return "CCTV control";
        } else {
            return "Database access";
        }
    }
}
