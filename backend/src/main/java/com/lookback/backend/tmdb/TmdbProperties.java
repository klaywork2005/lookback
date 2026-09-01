package com.lookback.backend.tmdb;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;

@Validated
@ConfigurationProperties(prefix = "tmdb")
public record TmdbProperties(@NotBlank String accessToken) {
}
