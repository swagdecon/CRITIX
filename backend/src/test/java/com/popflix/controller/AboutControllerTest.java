package com.popflix.controller;

import com.popflix.repository.UserRepository;
import com.popflix.repository.WatchlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.ui.ModelMap;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class AboutControllerTest {

    private AboutController aboutController;

    @Mock
    private WatchlistRepository watchlistRepository;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        aboutController = new AboutController();
        aboutController.watchlistRepository = watchlistRepository;
        aboutController.userRepository = userRepository;
    }

    @Test
    public void testGetAboutPage() {
        ModelMap model = new ModelMap();
        String viewName = aboutController.getAboutPage(model);
        assertEquals("about", viewName);
    }

    @Test
    public void testGetCreditPage() {
        ModelMap model = new ModelMap();
        String viewName = aboutController.getCreditPage(model);
        assertEquals("credits", viewName);
    }
}
