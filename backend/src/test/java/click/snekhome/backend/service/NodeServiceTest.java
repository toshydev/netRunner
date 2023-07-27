package click.snekhome.backend.service;

import click.snekhome.backend.model.Coordinates;
import click.snekhome.backend.model.Node;
import click.snekhome.backend.model.NodeData;
import click.snekhome.backend.repo.NodeRepo;
import click.snekhome.backend.util.IdService;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class NodeServiceTest {

    private final NodeRepo nodeRepo = mock(NodeRepo.class);
    private final IdService idService = mock(IdService.class);

    @Test
    void expectAllNodesInList() {
        //given
        Node node1 = new Node("abc", "123", "Home", 1, 100, null, 0, 0);
        Node node2 = new Node("def", "456", "Office", 2, 100, null, 0, 0);
        List<Node> expected = List.of(node1, node2);
        //when
        when(nodeRepo.findAll()).thenReturn(expected);
        NodeService nodeService = new NodeService(nodeRepo, idService);
        List<Node> actual = nodeService.list();
        //then
        assertEquals(expected, actual);
        verify(nodeRepo).findAll();
    }
  
    @Test
    void expectNodeWhenNodeDataIsAdded() {
        //given;
        NodeData nodeData = new NodeData("Home", new Coordinates(1, 1, 1));
        Node expected = new Node("abc", null, "Home", 0, 100, new Coordinates(1, 1, 1), Instant.now().getEpochSecond(), 0);
        //when
        when(idService.generateId()).thenReturn("abc");
        when(nodeRepo.insert(expected)).thenReturn(expected);
        NodeService nodeService = new NodeService(nodeRepo, idService);
        Node actual = nodeService.add(nodeData);
        //then
        assertEquals(expected, actual);
        verify(idService).generateId();
        verify(nodeRepo).insert(expected);
    }
}
