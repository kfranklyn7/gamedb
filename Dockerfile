# --- Stage 1: Build the backend ---
FROM eclipse-temurin:25-jdk-alpine AS builder

WORKDIR /app

# Copy gradle wrapper and related files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Copy the source code
COPY src src

# Make gradlew executable and build the jar
RUN chmod +x ./gradlew
RUN ./gradlew bootJar -x test

# --- Stage 2: Run the application ---
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-Xmx768m", "-jar", "app.jar"]
