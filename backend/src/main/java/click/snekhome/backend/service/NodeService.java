package click.snekhome.backend.service;

import click.snekhome.backend.model.Node;
import click.snekhome.backend.repo.NodeRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NodeService {

    private final NodeRepo nodeRepo;

    public NodeService(NodeRepo nodeRepo) {
        this.nodeRepo = nodeRepo;
    }

    public List<Node> list() {
        return this.nodeRepo.findAll();
    }
}
