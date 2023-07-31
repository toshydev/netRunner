package click.snekhome.backend.service;

import click.snekhome.backend.model.Node;
import click.snekhome.backend.model.NodeData;
import click.snekhome.backend.repo.NodeRepo;
import click.snekhome.backend.security.MongoUser;
import click.snekhome.backend.security.MongoUserDetailService;
import click.snekhome.backend.security.Role;
import click.snekhome.backend.security.UserData;
import click.snekhome.backend.util.ActionType;
import click.snekhome.backend.util.IdService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class NodeService {
    private final NodeRepo nodeRepo;
    private final IdService idService;
    private final MongoUserDetailService mongoUserDetailService;

    public NodeService(NodeRepo nodeRepo, IdService idService, MongoUserDetailService mongoUserDetailService) {
        this.nodeRepo = nodeRepo;
        this.idService = idService;
        this.mongoUserDetailService = mongoUserDetailService;
    }

    public List<Node> list() {
        return this.nodeRepo.findAll();
    }

    public Node add(NodeData nodeData) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        MongoUser user = this.mongoUserDetailService.getUserByUsername(username);
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
            throw new RuntimeException("You are not an admin");
        }
    }

    public Node edit(String id, ActionType actionType) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserData userData = this.mongoUserDetailService.getUserData(username);
        Node node = this.nodeRepo.findById(id).orElseThrow();
        Node newNode;
        if (node.ownerId() == null) {
            if (actionType == ActionType.HACK) {
                newNode = new Node(
                        node.id(),
                        userData.id(),
                        node.name(),
                        node.level() + 1,
                        100,
                        node.coordinates(),
                        Instant.now().getEpochSecond(),
                        node.lastAttack()
                );
                return this.nodeRepo.save(newNode);
            }
        } else if (node.ownerId().equals(userData.id())){
            if (actionType == ActionType.HACK) {
                newNode = new Node(
                        node.id(),
                        node.ownerId(),
                        node.name(),
                        node.level() + 1,
                        100,
                        node.coordinates(),
                        Instant.now().getEpochSecond(),
                        node.lastAttack()
                );
                return this.nodeRepo.save(newNode);
            } else if (actionType == ActionType.ABANDON) {
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
                return this.nodeRepo.save(newNode);
            }
        }
        return node;
    }

    public void delete(String id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        MongoUser user = this.mongoUserDetailService.getUserByUsername(username);
        if (user.role().equals(Role.ADMIN)) {
            this.nodeRepo.deleteById(id);
        } else {
            throw new RuntimeException("You are not an admin");
        }
    }
}
