package click.snekhome.backend.util;

import java.math.BigDecimal;

public class CalculateDistance {
    private static final BigDecimal EARTH_RADIUS_KM = BigDecimal.valueOf(6371);

    public static BigDecimal calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        BigDecimal lat1Rad = BigDecimal.valueOf(Math.toRadians(lat1));
        BigDecimal lon1Rad = BigDecimal.valueOf(Math.toRadians(lon1));
        BigDecimal lat2Rad = BigDecimal.valueOf(Math.toRadians(lat2));
        BigDecimal lon2Rad = BigDecimal.valueOf(Math.toRadians(lon2));

        BigDecimal deltaLat = lat2Rad.subtract(lat1Rad);
        BigDecimal deltaLon = lon2Rad.subtract(lon1Rad);

        BigDecimal a = BigDecimal.valueOf(Math.sin(deltaLat.doubleValue() / 2))
                .multiply(BigDecimal.valueOf(Math.sin(deltaLat.doubleValue() / 2)))
                .add(BigDecimal.valueOf(Math.cos(lat1Rad.doubleValue()))
                        .multiply(BigDecimal.valueOf(Math.cos(lat2Rad.doubleValue())))
                        .multiply(BigDecimal.valueOf(Math.sin(deltaLon.doubleValue() / 2)))
                        .multiply(BigDecimal.valueOf(Math.sin(deltaLon.doubleValue() / 2))));

        BigDecimal c = BigDecimal.valueOf(2).multiply(BigDecimal.valueOf(Math.atan2(Math.sqrt(a.doubleValue()), Math.sqrt(1 - a.doubleValue()))));
        BigDecimal distance = EARTH_RADIUS_KM.multiply(c);

        distance = distance.setScale(2, BigDecimal.ROUND_HALF_UP);
        return distance;
    }
}
