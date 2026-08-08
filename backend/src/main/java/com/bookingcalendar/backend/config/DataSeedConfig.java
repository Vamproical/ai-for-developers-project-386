package com.bookingcalendar.backend.config;

import com.bookingcalendar.backend.entity.EventType;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeedConfig {

    @Bean
    CommandLineRunner seedEventTypes(EventTypeRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new EventType("30-min Consultation", "A quick 30-minute consultation call", 30));
                repository.save(new EventType("1-hour Workshop", "An in-depth 1-hour workshop session", 60));
            }
        };
    }
}
