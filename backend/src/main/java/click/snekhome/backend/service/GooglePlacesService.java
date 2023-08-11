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

@Service
public class GooglePlacesService {

    @Value("${google.api.key}")
    private String apiKey;
    private static final String BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch";
    private static final String RADIUS = "radius=500";
    private final OkHttpClient client;

    public GooglePlacesService() {
        this.client = new OkHttpClient().newBuilder().build();
    }

    public List<CustomPlacesResult> getUniquePlaces(String latitude, String longitude) throws IOException {
        CustomPlacesResponse atmResponse = this.getPlaces(latitude, longitude, "atm");
        CustomPlacesResponse universityResponse = this.getPlaces(latitude, longitude, "university");
        CustomPlacesResponse policeResponse = this.getPlaces(latitude, longitude, "police");
        CustomPlacesResponse trainStationResponse = this.getPlaces(latitude, longitude, "train_station");
        List<CustomPlacesResult> allPlaces = combineArrays(
                atmResponse.results(),
                universityResponse.results(),
                policeResponse.results(),
                trainStationResponse.results()
        );
        return removeDuplicateLocations(allPlaces);
    }

    public CustomPlacesResponse getPlaces (String latitude, String longitude, String type) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        Request request = new Request.Builder()
                .url(BASE_URL + "/json?location=" + latitude + "%2C" + longitude + "&" + RADIUS + "&type=" + type + "&key=" + apiKey)
                .method("GET", null)
                .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = Objects.requireNonNull(response.body()).string();
            return objectMapper.readValue(responseBody, CustomPlacesResponse.class);
        } catch (IOException e) {
            throw new IOException("Error while fetching " + type , e);
        }
    }

    private static List<CustomPlacesResult> combineArrays(CustomPlacesResult[]... arrays) {
        return Arrays.stream(arrays)
                .flatMap(Arrays::stream).toList();
    }

    private static List<CustomPlacesResult> removeDuplicateLocations(List<CustomPlacesResult> places) {
        Map<String, CustomPlacesResult> groupedPlaces = new HashMap<>();

        for (CustomPlacesResult place : places) {
            String location = getLocationString(place.geometry().location());
            groupedPlaces.putIfAbsent(location, place);
        }
        return new ArrayList<>(groupedPlaces.values());
    }

    private static String getLocationString(LatLng location) {
        return location.lat + "," + location.lng;
    }
}
