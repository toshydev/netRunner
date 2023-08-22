package click.snekhome.backend.service;

import click.snekhome.backend.model.CustomPlacesResponse;
import click.snekhome.backend.model.CustomPlacesResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.maps.model.LatLng;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Stream;

@Service
public class GooglePlacesService {

    @Value("${google.api.key}")
    private String apiKey;

    @Value("${google.api.url}")
    private String baseUrl;
    private static final String RADIUS = "radius=5000";
    private final OkHttpClient client;

    public GooglePlacesService() {
        this.client = new OkHttpClient().newBuilder().build();
    }

    public List<CustomPlacesResult> getUniquePlaces(String latitude, String longitude) throws IOException {
        CustomPlacesResponse atmResponse = this.getPlaces(latitude, longitude, "atm");
        CustomPlacesResponse universityResponse = this.getPlaces(latitude, longitude, "university");
        CustomPlacesResponse shoppingResponse = this.getPlaces(latitude, longitude, "shopping_mall");
        List<CustomPlacesResult> allPlaces = Stream.concat(shoppingResponse.results().stream(), Stream.concat(atmResponse.results().stream(), universityResponse.results().stream()))
                .toList();
        return removeDuplicateLocations(allPlaces);
    }

    public CustomPlacesResponse getPlaces (String latitude, String longitude, String type) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        Request request = new Request.Builder()
                .url(baseUrl + "/json?location=" + latitude + "%2C" + longitude + "&" + RADIUS + "&type=" + type + "&key=" + apiKey)
                .method("GET", null)
                .build();

        String responseBody;
        try (Response response = client.newCall(request).execute()) {
            responseBody = Objects.requireNonNull(response.body()).string();
        }
        return objectMapper.readValue(responseBody, CustomPlacesResponse.class);
    }


    private static List<CustomPlacesResult> removeDuplicateLocations(List<CustomPlacesResult> places) {
        Map<String, CustomPlacesResult> groupedPlaces = new HashMap<>();

        places.stream().filter(place -> place.geometry() != null).forEach(place -> {
            String location = getLocationString(place.geometry().location());
            groupedPlaces.putIfAbsent(location, place);
        });

        return new ArrayList<>(groupedPlaces.values());
    }

    private static String getLocationString(LatLng location) {
        return location.lat + "," + location.lng;
    }
}
