package com.popflix.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.popflix.model.LoginEvents;
import com.popflix.model.User;
import com.popflix.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void updateUserProfilePic(String profilePic, String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setAvatar(profilePic);
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
    }

    public void updateUserBannerImg(String bannerImg, String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setBannerPicture(bannerImg);
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
    }

    public LoginEvents retrieveLoginInfo(String userId) {
        LoginEvents loginInfo = userRepository.findById(userId).get().getLoginEvents();
        return loginInfo;
    }

    public void updateLoginCounts(LoginEvents loginEvents, Date loginTime) {
        try {
            // Initialize calendar and formats
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(loginTime);
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat monthFormat = new SimpleDateFormat("yyyy-MM");
            String dateKey = dateFormat.format(loginTime);
            String monthKey = monthFormat.format(loginTime);
            int year = calendar.get(Calendar.YEAR);

            // Initialize maps if they are null
            loginEvents.setYearlyLoginCounts(
                    Optional.ofNullable(loginEvents.getYearlyLoginCounts()).orElse(new HashMap<>()));
            loginEvents.setMonthlyLoginCounts(
                    Optional.ofNullable(loginEvents.getMonthlyLoginCounts()).orElse(new HashMap<>()));
            loginEvents.setWeeklyLoginCounts(
                    Optional.ofNullable(loginEvents.getWeeklyLoginCounts()).orElse(new HashMap<>()));

            // Update counts
            loginEvents.getYearlyLoginCounts().merge(year, 1, Integer::sum);
            loginEvents.getMonthlyLoginCounts().merge(monthKey, 1, Integer::sum);
            loginEvents.getWeeklyLoginCounts().merge(dateKey, 1, Integer::sum);

            // Add timestamp
            if (loginEvents.getTimestamps() == null) {
                loginEvents.setTimestamps(new ArrayList<>());
            }
            loginEvents.getTimestamps().add(loginTime);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
