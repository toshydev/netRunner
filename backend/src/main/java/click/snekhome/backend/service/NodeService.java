package click.snekhome.backend.service;

import click.snekhome.backend.model.Node;
import click.snekhome.backend.model.NodeData;
import click.snekhome.backend.repo.NodeRepo;
import click.snekhome.backend.util.ActionType;
import click.snekhome.backend.util.IdService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class NodeService {

    private static final String PLAYERNAME = "playerUnknown";

    private final NodeRepo nodeRepo;
    private final IdService idService;

    public NodeService(NodeRepo nodeRepo, IdService idService) {
        this.nodeRepo = nodeRepo;
        this.idService = idService;
    }

    public List<Node> list() {
        return this.nodeRepo.findAll();
    }

    public Node add(NodeData nodeData) {
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
    }

    public Node edit(String id, ActionType actionType) {
        Node node = this.nodeRepo.findById(id).orElseThrow();
        Node newNode;
        if (node.ownerId() == null) {
            if (actionType == ActionType.HACK) {
                newNode = new Node(
                        node.id(),
                        PLAYERNAME,
                        node.name(),
                        node.level() + 1,
                        100,
                        node.coordinates(),
                        Instant.now().getEpochSecond(),
                        node.lastAttack()
                );
                return this.nodeRepo.save(newNode);
            }
        } else {
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
        this.nodeRepo.deleteById(id);
    }
}
