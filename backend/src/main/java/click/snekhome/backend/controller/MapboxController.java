package click.snekhome.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/map")
public class MapboxController {

    @Value("${mapbox.access.token}")
    private String mapboxAccessToken;

    @GetMapping("/{z}/{x}/{y}")
    public ResponseEntity<byte[]> getImageWithResponseEntity(@PathVariable int z, @PathVariable int x, @PathVariable int y) {

        String mapboxApiUrl = "https://api.mapbox.com/styles/v1/antonroters/cll3ohya000fg01pl7cc9fuu8";
        String fullUrl = mapboxApiUrl + "/tiles/256/" + z + "/" + x + "/" + y + "@2x?access_token=" + mapboxAccessToken;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        return restTemplate.getForEntity(fullUrl, byte[].class, entity);
    }
}
