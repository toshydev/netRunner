package click.snekhome.backend.exception;

public class NoSuchPlayerException extends RuntimeException{
    public NoSuchPlayerException(String message) {
        super("Player " + message + " not found!");
    }
}
