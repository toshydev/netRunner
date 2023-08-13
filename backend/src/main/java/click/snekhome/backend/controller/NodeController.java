package click.snekhome.backend.controller;

import click.snekhome.backend.model.*;
import click.snekhome.backend.service.NodeService;
import click.snekhome.backend.util.ActionType;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/nodes")
public class NodeController {

    private final NodeService nodeService;

    public NodeController(NodeService nodeService) {
        this.nodeService = nodeService;
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public List<Node> getNodes() {
        return this.nodeService.list();
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("{id}")
    public List<Node> getNodesByOwner(@PathVariable String id) {
        return this.nodeService.getNodesByOwner(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public Node add(@Valid @RequestBody NodeData nodeData) {
        return this.nodeService.add(nodeData);
    }

    @ResponseStatus(HttpStatus.ACCEPTED)
    @PutMapping("{id}")
    public Node edit(@PathVariable String id, @RequestBody String actionType) {
        return this.nodeService.edit(id, ActionType.valueOf(actionType));
    }

    @ResponseStatus(HttpStatus.ACCEPTED)
    @DeleteMapping("{id}")
    public void delete(@PathVariable String id) {
        this.nodeService.delete(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("scan")
    public List<Node> scan(@RequestBody Coordinates coordinates) throws IOException {
        return this.nodeService.scan(coordinates);
    }
}
