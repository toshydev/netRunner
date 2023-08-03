package click.snekhome.backend.security;

public enum Role {
    ADMIN("ADMIN"),
    PLAYER("PLAYER");

    final String type;

    Role(String type) {
        this.type = type;
    }
}
