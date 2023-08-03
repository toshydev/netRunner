package click.snekhome.backend.controller;

import click.snekhome.backend.model.Node;
import click.snekhome.backend.model.NodeData;
import click.snekhome.backend.service.NodeService;
import click.snekhome.backend.util.ActionType;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nodes")
public class NodeController {

    private final NodeService nodeService;

    public NodeController(NodeService nodeService) {
        this.nodeService = nodeService;
    }

    @GetMapping
    public List<Node> list() {
        return this.nodeService.list();
    }

    @PostMapping
    public Node add(@Valid @RequestBody NodeData nodeData) {
        return this.nodeService.add(nodeData);
    }

    @PutMapping("{id}")
    public Node edit(@PathVariable String id, @RequestBody String actionType) {
        return this.nodeService.edit(id, ActionType.valueOf(actionType));
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable String id) {
        this.nodeService.delete(id);
    }
}
