package click.snekhome.backend.util;

import java.math.BigDecimal;

public class CalculateSpeed {
    public static BigDecimal calculateSpeed(BigDecimal distance, long oldTimestamp, long newTimestamp) {
        BigDecimal oldTimestampDecimal = BigDecimal.valueOf(oldTimestamp);
        BigDecimal newTimestampDecimal = BigDecimal.valueOf(newTimestamp);
        BigDecimal timeDifferenceInSeconds = newTimestampDecimal.subtract(oldTimestampDecimal);

        if (timeDifferenceInSeconds.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal timeDifferenceInHours = timeDifferenceInSeconds.divide(BigDecimal.valueOf(3600), 2, BigDecimal.ROUND_HALF_UP);
        BigDecimal speed = distance.divide(timeDifferenceInHours, 2, BigDecimal.ROUND_HALF_UP);

        return speed;
    }
}

