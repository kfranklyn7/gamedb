package kev.gamedb;

import org.springframework.data.annotation.Id;

import java.util.List;

public record User(String username, @Id Long id, List<Game> library) {
}
