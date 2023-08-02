package click.snekhome.backend.controller;

import click.snekhome.backend.model.Coordinates;
import click.snekhome.backend.model.Node;
import click.snekhome.backend.repo.NodeRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
class NodeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NodeRepo nodeRepo;

    @Test
    @DirtiesContext
    void returnsAllNodesInList_whenGettingNodes() throws Exception {
        Node node1 = new Node("abc", "123", "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        Node node2 = new Node("def", "456", "Office", 2, 100, new Coordinates(0, 0, 0), 0, 0);
        nodeRepo.save(node1);
        nodeRepo.save(node2);
        String expected = """
                [
                    {
                        "id":"abc",
                        "name":"Home",
                        "level":1,
                        "health":100,
                        "ownerId": "123",
                        "coordinates": {
                            "latitude": 0,
                            "longitude": 0
                            },
                        "lastUpdate":0,
                        "lastAttack":0
                        },
                    {
                        "id":"def",
                        "name":"Office",
                        "level":2,
                        "health":100,
                        "ownerId": "456",
                        "coordinates": {
                            "latitude": 0,
                            "longitude": 0
                            },
                        "lastUpdate":0,
                        "lastAttack":0
                        }
                ]
                """;
        mockMvc.perform(MockMvcRequestBuilders.get("/api/nodes"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void returnsNode_whenAddingNode() throws Exception {
        String requestBody = """
                {
                    "name":"Home",
                    "coordinates": {
                        "latitude": 0,
                        "longitude": 0
                        }
                }
                """;
        String expected = """
                {
                    "name":"Home",
                    "level":0,
                    "health":100,
                    "coordinates": {
                        "latitude": 0,
                        "longitude": 0
                        },
                    "lastAttack":0
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.post("/api/nodes")
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void returnsUpgradedNode_whenHackingOwnedNode() throws Exception {
        Node node = new Node("abc", "123", "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        nodeRepo.save(node);
        String expected = """
                {
                    "id":"abc",
                    "name":"Home",
                    "level":2,
                    "health":100,
                    "ownerId": "123",
                    "coordinates": {
                        "latitude": 0,
                        "longitude": 0
                        },
                    "lastAttack":0
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.put("/api/nodes/abc")
                        .content("HACK"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void returnsDowngradedNode_whenAbandoningOwnedNode() throws Exception {
        Node node = new Node("abc", "123", "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        nodeRepo.save(node);
        String expected = """
                {
                    "id":"abc",
                    "name":"Home",
                    "level":0,
                    "health":100,
                    "coordinates": {
                        "latitude": 0,
                        "longitude": 0
                        },
                    "lastAttack":0
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.put("/api/nodes/abc")
                        .content("ABANDON"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void returnNodeWithOwner_whenHackingUnownedNode() throws Exception {
        Node node = new Node("abc", null, "Home", 0, 100, new Coordinates(0, 0, 0), 0, 0);
        nodeRepo.save(node);
        String expected = """
                {
                    "id":"abc",
                    "name":"Home",
                    "ownerId":"playerUnknown",
                    "level":1,
                    "health":100,
                    "coordinates": {
                        "latitude": 0,
                        "longitude": 0
                        },
                    "lastAttack":0
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.put("/api/nodes/abc")
                        .content("HACK"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void returnUnchangedNode_whenAbandoningUnownedNode() throws Exception {
        Node node = new Node("abc", null, "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        nodeRepo.save(node);
        String expected = """
                {
                    "id":"abc",
                    "name":"Home",
                    "level":1,
                    "health":100,
                    "coordinates": {
                        "latitude": 0,
                        "longitude": 0
                        },
                    "lastAttack":0
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.put("/api/nodes/abc")
                        .content("ABANDON"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void returnListWithoutDeletedNode_whenDeletingNode() throws Exception {
        Node node1 = new Node("abc", "123", "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        Node node2 = new Node("def", "456", "Office", 2, 100, new Coordinates(0, 0, 0), 0, 0);
        nodeRepo.save(node1);
        nodeRepo.save(node2);
        String expected = """
                [
                    {
                        "id":"def",
                        "name":"Office",
                        "level":2,
                        "health":100,
                        "ownerId": "456",
                        "coordinates": {
                            "latitude": 0,
                            "longitude": 0
                            },
                        "lastUpdate":0,
                        "lastAttack":0
                        }
                ]
                """;
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/nodes/abc"))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/nodes"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }
}
