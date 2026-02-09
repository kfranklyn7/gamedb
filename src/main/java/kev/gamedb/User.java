package kev.gamedb;

import jakarta.persistence.Id;

import java.util.List;

public record User(String username, @Id Long id, List<Game> library) {
}
