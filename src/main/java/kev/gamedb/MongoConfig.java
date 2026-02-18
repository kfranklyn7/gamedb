package kev.gamedb;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.time.Instant;
import java.util.List;

@Configuration
public class MongoConfig {

    @Bean
    public MongoCustomConversions customConversions() {
        return new MongoCustomConversions(List.of(new StringToInstantConverter()));
    }

    private static class StringToInstantConverter implements Converter<String, Instant> {
        @Override
        public Instant convert(String source) {
            if (source == null || source.trim().isEmpty()) {
                return null;
            }
            try {
                return Instant.parse(source);
            } catch (Exception e) {
                // If it's not a valid Instant format, we return null to avoid crashing
                return null;
            }
        }
    }
}
