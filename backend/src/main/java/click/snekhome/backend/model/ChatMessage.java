package click.snekhome.backend.model;

public record ChatMessage(String username, String message, long timestamp) {
    @Override
    public String toString() {
        return "{\"username\":\"" + username + "\",\"message\":\"" + message + "\",\"timestamp\":" + timestamp + "}";
    }
}
