package click.snekhome.backend.service;

import click.snekhome.backend.model.Node;
import click.snekhome.backend.model.NodeData;
import click.snekhome.backend.repo.NodeRepo;
import click.snekhome.backend.util.IdService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class NodeService {

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

}
