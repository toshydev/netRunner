package click.snekhome.backend.service;

import click.snekhome.backend.exception.WrongRoleException;
import click.snekhome.backend.model.*;
import click.snekhome.backend.repo.NodeRepo;
import click.snekhome.backend.security.MongoUser;
import click.snekhome.backend.security.MongoUserService;
import click.snekhome.backend.security.Role;
import click.snekhome.backend.util.ActionType;
import click.snekhome.backend.util.IdService;
import com.google.maps.model.LatLng;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class NodeServiceTest {

    private final NodeRepo nodeRepo = mock(NodeRepo.class);
    private final IdService idService = mock(IdService.class);
    private final MongoUserService mongoUserService = mock(MongoUserService.class);
    private final PlayerService playerService = mock(PlayerService.class);
    private final Authentication authentication = mock(Authentication.class);
    private final SecurityContext securityContext = mock(SecurityContext.class);
    private final GooglePlacesService googlePlacesService = mock(GooglePlacesService.class);
    private final NodeService nodeService = new NodeService(nodeRepo, idService, mongoUserService, playerService, googlePlacesService);
    String playerName = "playerunknown";
    String adminName = "admin";
    MongoUser player = new MongoUser("abc", playerName, "player@test.net", "password", Role.PLAYER);
    MongoUser admin = new MongoUser("1", adminName, "admin@test.net", "admin", Role.ADMIN);
    Player playerunknown = new Player("123", "abc", "playerunknown", new Coordinates(0, 0, Instant.now().getEpochSecond()), 1, 0, 100, 100, 100, 5, 10, 0, 0);

    @Test
    void expectAllNodesInList() {
        //given
        Node node1 = new Node("abc", "123", "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        Node node2 = new Node("def", "456", "Office", 2, 100, new Coordinates(0, 0, 0), 0, 0);
        List<Node> expected = List.of(node1, node2);
        //when
        when(nodeRepo.findAll()).thenReturn(expected);
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
        when(authentication.getName()).thenReturn(adminName);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(idService.generateId()).thenReturn("abc");
        when(nodeRepo.insert(expected)).thenReturn(expected);
        when(mongoUserService.getUserByUsername(adminName)).thenReturn(admin);
        Node actual = nodeService.add(nodeData);
        //then
        assertEquals(expected, actual);
        verify(idService).generateId();
        verify(nodeRepo).insert(expected);
        verify(mongoUserService).getUserByUsername(adminName);
    }

    @Test
    void expectNodeWithIncreasedLevelWhenNodeIsHacked() {
        //given
        Node node = new Node("abc", "123", "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        Node expected = new Node("abc", "123", "Home", 2, 100, new Coordinates(0, 0, 0), Instant.now().getEpochSecond(), 0);
        //when
        when(authentication.getName()).thenReturn(playerName);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(nodeRepo.findById("abc")).thenReturn(Optional.of(node));
        when(nodeRepo.save(expected)).thenReturn(expected);
        when(playerService.getPlayer(playerName)).thenReturn(playerunknown);
        Node actual = nodeService.edit("abc", ActionType.HACK);
        //then
        assertEquals(expected, actual);
        verify(nodeRepo).findById("abc");
        verify(nodeRepo).save(expected);
        verify(playerService).getPlayer(playerName);
    }

    @Test
    void expectNodeWithDecreasedLevelWhenNodeIsAbandoned() {
        //given
        Node node = new Node("abc", "123", "Home", 2, 100, new Coordinates(0, 0, 0), 0, 0);
        Node expected = new Node("abc", "123", "Home", 1, 100, new Coordinates(0, 0, 0), Instant.now().getEpochSecond(), 0);
        //when
        when(authentication.getName()).thenReturn(playerName);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(nodeRepo.findById("abc")).thenReturn(Optional.of(node));
        when(nodeRepo.save(any())).thenReturn(expected);
        when(playerService.getPlayer(playerName)).thenReturn(playerunknown);
        Node actual = nodeService.edit("abc", ActionType.ABANDON);
        //then
        assertEquals(expected, actual);
        verify(nodeRepo).findById("abc");
        verify(nodeRepo).save(expected);
        verify(playerService).getPlayer(playerName);
    }

    @Test
    void expectUnchangedNodeWhenNodeIsAbandonedAndHasNoOwner() {
        //given
        Node node = new Node("abc", null, "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        //when
        when(authentication.getName()).thenReturn(playerName);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(nodeRepo.findById("abc")).thenReturn(Optional.of(node));
        when(nodeRepo.save(node)).thenReturn(node);
        when(playerService.getPlayer(playerName)).thenReturn(playerunknown);
        Node actual = nodeService.edit("abc", ActionType.ABANDON);
        //then
        assertEquals(node, actual);
        verify(nodeRepo).findById("abc");
        verify(playerService).getPlayer(playerName);

    }

    @Test
    void expectNodeWithoutOwnerWhenNodeIsAbandonedAtLevel1() {
        //given
        Node node = new Node("abc", "123", "Home", 1, 100, new Coordinates(0, 0, 0), 0, 0);
        Node expected = new Node("abc", null, "Home", 0, 100, new Coordinates(0, 0, 0), Instant.now().getEpochSecond(), 0);
        //when
        when(authentication.getName()).thenReturn(playerName);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(nodeRepo.findById("abc")).thenReturn(Optional.of(node));
        when(nodeRepo.save(expected)).thenReturn(expected);
        when(playerService.getPlayer(playerName)).thenReturn(playerunknown);
        Node actual = nodeService.edit("abc", ActionType.ABANDON);
        //then
        assertEquals(expected, actual);
        verify(nodeRepo).findById("abc");
        verify(nodeRepo).save(expected);
        verify(playerService).getPlayer(playerName);
    }

    @Test
    void expectNodeWithOwnerWhenNodeWithoutOwnerIsHacked() {
        //given
        Node node = new Node("abc", null, "Home", 0, 100, new Coordinates(0, 0, 0), 0, 0);
        Node expected = new Node("abc", "123", "Home", 1, 100, new Coordinates(0, 0, 0), Instant.now().getEpochSecond(), 0);
        //when
        when(authentication.getName()).thenReturn(playerName);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(nodeRepo.findById("abc")).thenReturn(Optional.of(node));
        when(nodeRepo.save(expected)).thenReturn(expected);
        when(playerService.getPlayer(playerName)).thenReturn(playerunknown);
        Node actual = nodeService.edit("abc", ActionType.HACK);
        //then
        assertEquals(expected, actual);
        verify(nodeRepo).findById("abc");
        verify(nodeRepo).save(expected);
        verify(playerService).getPlayer(playerName);
    }

    @Test
    void expectListWithoutNodeWhenNodeIsDeleted() {
        //given
        Node node1 = new Node("def", "456", "Office", 2, 100, new Coordinates(0, 0, 0), 0, 0);
        List<Node> expected = List.of(node1);
        //when
        when(authentication.getName()).thenReturn(adminName);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(nodeRepo.findAll()).thenReturn(List.of(node1));
        when(mongoUserService.getUserByUsername(adminName)).thenReturn(admin);
        nodeService.delete("abc");
        List<Node> actual = nodeService.list();
        //then
        assertEquals(expected, actual);
        verify(nodeRepo).deleteById("abc");
        verify(nodeRepo).findAll();
        verify(mongoUserService).getUserByUsername(adminName);
    }

    @Test
    void expectWrongRoleException_whenNodeIsAddedWithPlayer() {
        //given
        NodeData nodeData = new NodeData("abc", new Coordinates(0, 0, Instant.now().getEpochSecond()));
        //when
        when(authentication.getName()).thenReturn(playerName);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(mongoUserService.getUserByUsername(playerName)).thenReturn(player);
        //then
        assertThrows(WrongRoleException.class, () -> nodeService.add(nodeData));
    }

    @Test
    void expectWrongRoleException_whenNodeIsDeletedWithPlayer() {
        //given
        Node node1 = new Node("def", "456", "Office", 2, 100, new Coordinates(0, 0, 0), 0, 0);
        //when
        when(authentication.getName()).thenReturn(playerName);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(nodeRepo.findAll()).thenReturn(List.of(node1));
        when(mongoUserService.getUserByUsername(playerName)).thenReturn(player);
        //then
        assertThrows(WrongRoleException.class, () -> nodeService.delete("def"));
    }

    @Test
    void returnNodeNamesBasedOnPlaceType() {
        CustomPlacesResult atm = new CustomPlacesResult("abc", new Geometry(new LatLng(0, 0)), "Evil Bank", List.of("atm", "bank"));
        CustomPlacesResult store = new CustomPlacesResult("abc", new Geometry(new LatLng(0, 0)), "Conrad Electronics", List.of("store", "electronics_store"));
        CustomPlacesResult official = new CustomPlacesResult("abc", new Geometry(new LatLng(0, 0)), "Arithmetikum", List.of("museum", "university"));
        CustomPlacesResult hospital = new CustomPlacesResult("abc", new Geometry(new LatLng(0, 0)), "Charite", List.of("hospital", "pharmacy"));

        assertEquals("Trading interface", NodeService.getNodeName(atm));
        assertEquals("Server farm", NodeService.getNodeName(store));
        assertEquals("CCTV control", NodeService.getNodeName(official));
        assertEquals("Database access", NodeService.getNodeName(hospital));
    }
}
