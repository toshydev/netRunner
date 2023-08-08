package click.snekhome.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mapbox")
public class MapboxController {

    @Value("${mapbox.api.token}")
    private String mapboxApiToken;

    @GetMapping("/token")
    public String getMapboxApiToken() {
        return mapboxApiToken;
    }
}
