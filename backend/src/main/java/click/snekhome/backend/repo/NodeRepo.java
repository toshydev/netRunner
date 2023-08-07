package click.snekhome.backend.repo;

import click.snekhome.backend.model.Node;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NodeRepo extends MongoRepository<Node, String> {

    List<Node> findAllByOwnerId(String ownerId);
}
