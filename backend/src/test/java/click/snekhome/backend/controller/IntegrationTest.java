package click.snekhome.backend.controller;

import click.snekhome.backend.model.Coordinates;
import click.snekhome.backend.model.Node;
import click.snekhome.backend.model.Player;
import click.snekhome.backend.repo.NodeRepo;
import click.snekhome.backend.repo.PlayerRepo;
import click.snekhome.backend.security.MongoUser;
import click.snekhome.backend.security.MongoUserRepository;
import click.snekhome.backend.security.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;

@SpringBootTest
@AutoConfigureMockMvc
class IntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NodeRepo nodeRepo;

    @Autowired
    private MongoUserRepository mongoUserRepository;

    @Autowired
    private PlayerRepo playerRepo;

    @BeforeEach
    void setUp() {
        PasswordEncoder passwordEncoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
        MongoUser admin = new MongoUser("1", "admin", "admin@test.net", passwordEncoder.encode("admin"), Role.ADMIN);
        mongoUserRepository.save(admin);
    }

    @Test
    @DirtiesContext
    void expectUserData_afterSuccessfullRegisterAndSuccessfullLogin() throws Exception {
        //given
        String requestBody = """
                {
                    "username":"test",
                    "email":"test@test.com",
                    "password":"test"
                }
                """;
        //when
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("test", "test")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        //then
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                        .with(httpBasic("test", "test")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("test"));
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "test")
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
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("admin", "admin")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                        .with(httpBasic("admin", "admin")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("admin"));
        mockMvc.perform(MockMvcRequestBuilders.post("/api/nodes")
                        .contentType("application/json")
                        .content(requestBody)
                        .with(httpBasic("admin", "admin"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void returnsUpgradedNode_whenHackingOwnedNode() throws Exception {
        String requestBody = """
                {
                    "username":"playerunknown",
                    "email":"player@test.net",
                    "password":"password"
                }
                """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .contentType("application/json")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("playerunknown", "password")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                        .with(httpBasic("playerunknown", "password")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("playerunknown"));

        Optional<Player> player = playerRepo.findPlayerByName("playerunknown");
        assert player.isPresent();
        String playerId = player.get().id();
        Node node = new Node("abc", playerId, "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        nodeRepo.save(node);

        String expected = """
                {
                    "id":"abc",
                    "name":"Home",
                    "ownerId":"%s",
                    "level":2,
                    "health":100,
                    "coordinates": {
                        "latitude": 0,
                        "longitude": 0
                        },
                    "lastAttack":0
                }
                """.formatted(playerId);

        String coordinates = """
                {
                    "latitude": 0,
                    "longitude": 0,
                    "timestamp": 0
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.put("/api/player/location")
                        .content(coordinates).contentType(MediaType.APPLICATION_JSON)
                        .with(httpBasic("playerunknown", "password"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted());
        mockMvc.perform(MockMvcRequestBuilders.put("/api/nodes/abc")
                        .content("HACK")
                        .with(httpBasic("playerunknown", "password"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void returnsUnownedNode_whenAbandoningOwnedNodeWithLvl1() throws Exception {
        String requestBody = """
                {
                    "username":"playerunknown",
                    "email":"player@test.net",
                    "password":"password"
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .contentType("application/json")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("playerunknown", "password")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        String coordinates = """
                {
                    "latitude": 0,
                    "longitude": 0,
                    "timestamp": 0
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.put("/api/player/location")
                        .content(coordinates).contentType(MediaType.APPLICATION_JSON)
                        .with(httpBasic("playerunknown", "password"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                        .with(httpBasic("playerunknown", "password")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("playerunknown"));

        Optional<Player> player = playerRepo.findPlayerByName("playerunknown");
        assert player.isPresent();
        String playerId = player.get().id();
        Node node = new Node("abc", playerId, "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        nodeRepo.save(node);

        String expected = """
                {
                    "id":"abc",
                    "name":"Home",
                    "ownerId": null,
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
                        .content("ABANDON")
                        .with(httpBasic("playerunknown", "password"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void returnNodeWithOwner_whenHackingUnownedNode() throws Exception {
        Node node = new Node("abc", null, "Home", 0, 100, new Coordinates(0, 0, 0), 0, 0);
        nodeRepo.save(node);

        String requestBody = """
                {
                    "username":"playerunknown",
                    "email":"player@test.net",
                    "password":"password"
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .contentType("application/json")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("playerunknown", "password")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                        .with(httpBasic("playerunknown", "password")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("playerunknown"));

        Optional<Player> player = playerRepo.findPlayerByName("playerunknown");
        assert player.isPresent();
        String playerId = player.get().id();

        String expected = """
                {
                    "id":"abc",
                    "name":"Home",
                    "ownerId": "%s",
                    "level":1,
                    "health":100,
                    "coordinates": {
                        "latitude": 0,
                        "longitude": 0
                        },
                    "lastAttack":0
                }
                """.formatted(playerId);
        String coordinates = """
                {
                    "latitude": 0,
                    "longitude": 0,
                    "timestamp": 0
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.put("/api/player/location")
                        .content(coordinates).contentType(MediaType.APPLICATION_JSON)
                        .with(httpBasic("playerunknown", "password"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted());
        mockMvc.perform(MockMvcRequestBuilders.put("/api/nodes/abc")
                        .content("HACK")
                        .with(httpBasic("playerunknown", "password"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted())
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
        String requestBody = """
                {
                    "username":"playerunknown",
                    "email":"player@test.net",
                    "password":"password"
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .contentType("application/json")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("playerunknown", "password")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                        .with(httpBasic("playerunknown", "password")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("playerunknown"));
        String coordinates = """
                {
                    "latitude": 0,
                    "longitude": 0,
                    "timestamp": 0
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.put("/api/player/location")
                        .content(coordinates).contentType(MediaType.APPLICATION_JSON)
                        .with(httpBasic("playerunknown", "password"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted());
        mockMvc.perform(MockMvcRequestBuilders.put("/api/nodes/abc")
                        .content("ABANDON")
                        .with(httpBasic("playerunknown", "password"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void returnDamagedNodeWhenHackingNodeOfOtherPlayer() throws Exception {
        Node node = new Node("abc", "123", "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        nodeRepo.save(node);
        String expected = """
                {
                    "id":"abc",
                    "ownerId":"123",
                    "name":"Home",
                    "level":1,
                    "health":90,
                    "coordinates": {
                        "latitude": 0,
                        "longitude": 0
                        }
                }
                """;
        String requestBody = """
                {
                    "username":"playerunknown",
                    "email":"player@test.net",
                    "password":"password"
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .contentType("application/json")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("playerunknown", "password")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                        .with(httpBasic("playerunknown", "password")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("playerunknown"));
        String coordinates = """
                {
                    "latitude": 0,
                    "longitude": 0,
                    "timestamp": 0
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.put("/api/player/location")
                        .content(coordinates).contentType(MediaType.APPLICATION_JSON)
                        .with(httpBasic("playerunknown", "password"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted());
        mockMvc.perform(MockMvcRequestBuilders.put("/api/nodes/abc")
                        .content("HACK")
                        .with(httpBasic("playerunknown", "password"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted())
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
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/nodes/abc")
                        .with(httpBasic("admin", "admin"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/nodes")
                        .with(httpBasic("admin", "admin")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void expectOwnPlayerWhenLoggedInAfterRegister() throws Exception {
        String requestBody = """
                {
                    "username":"testPlayer",
                    "email":"test@test.com",
                    "password":"test"
                }
                """;
        String expectedPlayer = """
                    {
                       "name": "testPlayer",
                       "level": 1,
                       "experience": 0,
                       "experienceToNextLevel": 100,
                       "health": 100,
                       "maxHealth": 100,
                       "attack": 5,
                       "maxAttack": 10,
                       "credits": 0
                     }
                """;
        //when
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("testPlayer", "test")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                        .with(httpBasic("testPlayer", "test")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("testPlayer"));
        //then
        mockMvc.perform(MockMvcRequestBuilders.get("/api/player")
                        .with(httpBasic("testPlayer", "test")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expectedPlayer));
    }

    @Test
    @DirtiesContext
    void expect405WhenTryingToRegisterWithExistingUsername() throws Exception {
        String requestBody = """
                {
                    "username":"admin",
                    "email":"fake@email.net",
                    "password":"123456"
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    @DirtiesContext
    void expectLoggedOutUserWhenLoggingOut() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("admin", "admin")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                        .with(httpBasic("admin", "admin")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("admin"));
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/logout")
                        .with(httpBasic("admin", "admin")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("anonymousUser"));

    }

    @Test
    @DirtiesContext
    void expect400WhenTryingToRegisterWithInvalidEmail() throws Exception {
        String requestBody = """
                {
                    "username":"testPlayer",
                    "email":"test",
                    "password":"test"
                }
                """;
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    @DirtiesContext
    void expectPlayerNameWhenLoggedIn() throws Exception {
        String requestBody = """
                {
                    "username":"playerunknown",
                    "email":"player@test.net",
                    "password":"password"
                }
                """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .contentType("application/json")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("playerunknown", "password")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                        .with(httpBasic("playerunknown", "password")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("playerunknown"));

        Optional<Player> player = playerRepo.findPlayerByName("playerunknown");
        assert player.isPresent();
        String playerId = player.get().id();

        mockMvc.perform(MockMvcRequestBuilders.get("/api/player/" + playerId)
                        .with(httpBasic("playerunknown", "password")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("playerunknown"));
    }

    @Test
    @DirtiesContext
    void expect404whenPlayerIsNonExistent() throws Exception {
        String requestBody = """
                {
                    "username":"playerunknown",
                    "email":"player@test.net",
                    "password":"password"
                }
                """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .contentType("application/json")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("playerunknown", "password")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                        .with(httpBasic("playerunknown", "password")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("playerunknown"));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/player/abc")
                        .with(httpBasic("playerunknown", "password")))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    @DirtiesContext
    void expectPlayerWithUpdatedCoordinates() throws Exception {
        String expected = """
                    {
                        "name": "playerunknown",
                        "coordinates": {
                            "latitude": 48.1232052,
                            "longitude": 11.5485363,
                            "timestamp": 1690997725514
                        }
                    }
                """;
        String userData = """
                {
                    "username":"playerunknown",
                    "email":"player@test.net",
                    "password":"password"
                }
                """;
        String requestBody = """
                    {
                        "latitude": 48.1232052,
                        "longitude": 11.5485363,
                        "timestamp": 1690997725514
                    }
                """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .contentType("application/json")
                        .content(userData)
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("playerunknown", "password")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                        .with(httpBasic("playerunknown", "password")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("playerunknown"));

        mockMvc.perform(MockMvcRequestBuilders.put("/api/player/location")
                        .content(requestBody).contentType(MediaType.APPLICATION_JSON)
                        .with(httpBasic("playerunknown", "password")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isAccepted())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void expectForbiddenWhenTryingToAddNodeWithWrongRole() throws Exception {
        PasswordEncoder passwordEncoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
        MongoUser player = new MongoUser("123", "playerunknown", "player@player.net", passwordEncoder.encode("password"), Role.PLAYER);
        mongoUserRepository.save(player);
        Player playerunknown = new Player("abc", "123", "playerunknown", null, 1, 0, 100, 100, 100, 5, 15, 0);
        String nodeData = """
                {
                    "name": "testNode",
                    "coordinates": {
                        "latitude": 48.1232052,
                        "longitude": 11.5485363,
                        "timestamp": 1690997725514
                    }
                }
                """;

        playerRepo.save(playerunknown);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("playerunknown", "password")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/nodes")
                        .contentType("application/json")
                        .content(nodeData)
                        .with(httpBasic("playerunknown", "password"))
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    @DirtiesContext
    void expectPlayerWhenGettingPlayerByName() throws Exception {
        Player playerunknown = new Player("abc", "123", "playerunknown", new Coordinates(0, 0, 0), 1, 0, 100, 100, 100, 5, 15, 0);
        playerRepo.save(playerunknown);

        String userData = """
                {
                    "username":"testPlayer",
                    "email":"testPlayer@test.net",
                    "password":"12345678"
                }
                """;
        String expected = """
                    {
                        "name": "playerunknown",
                        "coordinates": {
                            "latitude": 0,
                            "longitude": 0,
                            "timestamp": 0
                        },
                        "level": 1,
                        "experience": 0,
                        "health": 100,
                        "maxHealth": 100,
                        "credits": 0,
                        "attack": 5
                    }
                """;
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .contentType("application/json")
                        .content(userData)
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(httpBasic("testPlayer", "12345678")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                .with(httpBasic("testPlayer", "12345678")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("testPlayer"));
        mockMvc.perform(MockMvcRequestBuilders.get("/api/player/info/playerunknown")
                        .with(httpBasic("testPlayer", "12345678")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void expectUnauthorizedWhenLoginWithBadCredentials() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login").with(httpBasic("unregistered", "12345678")).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn();

        String errorMessage = mvcResult.getResponse().getErrorMessage();
        assertEquals("Invalid username or password", errorMessage);
    }

    @Test
    @DirtiesContext
    void expectUnauthorizedWhenLoginWithoutUser() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login").with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn();
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "test")
    void expectNodesOfOwnerWhenGettingNodesByOwnerId() throws Exception {
        Node node1 = new Node("abc", "123", "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        Node node2 = new Node("def", "123", "Office", 2, 100, new Coordinates(0, 0, 0), 0, 0);
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
                        "ownerId": "123",
                        "coordinates": {
                            "latitude": 0,
                            "longitude": 0
                            },
                        "lastUpdate":0,
                        "lastAttack":0
                        }
                ]
                """;
        mockMvc.perform(MockMvcRequestBuilders.get("/api/nodes/123"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }
}
