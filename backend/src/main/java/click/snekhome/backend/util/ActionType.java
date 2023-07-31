package click.snekhome.backend.util;

public enum ActionType {
    HACK("HACK"),
    ABANDON("ABANDON");

    final String action;

    ActionType(String actionType) {
        this.action = actionType;
    }
}
