package com.critix.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecaptchaResponse {
    private boolean success;
    private String challengeTs;
    private String hostname;
}
