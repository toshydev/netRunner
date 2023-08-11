package click.snekhome.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.maps.model.LatLng;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Geometry (
        LatLng location
) {
}
