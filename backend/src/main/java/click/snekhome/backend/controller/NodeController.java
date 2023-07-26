package click.snekhome.backend.controller;

import click.snekhome.backend.model.Node;
import click.snekhome.backend.model.NodeData;
import click.snekhome.backend.service.NodeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class NodeController {

    private final NodeService nodeService;

    public NodeController(NodeService nodeService) {
        this.nodeService = nodeService;
    }

    @GetMapping("/nodes")
    public List<Node> list() {
        return this.nodeService.list();
    }

    @PostMapping("/nodes")
    public Node add(@Valid @RequestBody NodeData nodeData) {
        return this.nodeService.add(nodeData);
    }
}
