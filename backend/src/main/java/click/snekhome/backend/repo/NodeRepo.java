package click.snekhome.backend.repo;

import click.snekhome.backend.model.Node;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NodeRepo extends MongoRepository<Node, String> {
}
