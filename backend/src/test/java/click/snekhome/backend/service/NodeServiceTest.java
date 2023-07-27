package click.snekhome.backend.service;

import click.snekhome.backend.model.Node;
import click.snekhome.backend.repo.NodeRepo;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class NodeServiceTest {

    private final NodeRepo nodeRepo = mock(NodeRepo.class);

    @Test
    void expectAllNodesInList() {
        //given
        Node node1 = new Node("abc", "123", "Home", 1, 100, null, 0, 0);
        Node node2 = new Node("def", "456", "Office", 2, 100, null, 0, 0);
        List<Node> expected = List.of(node1, node2);
        //when
        when(nodeRepo.findAll()).thenReturn(expected);
        NodeService nodeService = new NodeService(nodeRepo);
        List<Node> actual = nodeService.list();
        //then
        assertEquals(expected, actual);
        verify(nodeRepo).findAll();
    }
}
