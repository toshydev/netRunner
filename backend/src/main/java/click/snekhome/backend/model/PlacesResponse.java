package click.snekhome.backend.model;

import java.util.List;

public record PlacesResponse(
        List<CustomPlacesResult> results,
        String status
) {
}
