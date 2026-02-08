package kev.gamedb;

import jakarta.persistence.Id;

public record User(String username, @Id Long id) {
}
