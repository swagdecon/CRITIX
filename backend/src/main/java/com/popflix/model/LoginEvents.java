package com.popflix.model;

import java.util.Date;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginEvents {
    private List<Date> timestamps;
    private Map<Integer, Integer> yearlyLoginCounts;
    private Map<String, Integer> monthlyLoginCounts;
    private Map<String, Integer> weeklyLoginCounts;
}
