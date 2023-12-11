import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class ConfigLoader {
    public static String loadProperty(String filePath, String propertyName) {
        Properties properties = new Properties();
        String propertyValue = null;

        try (FileInputStream fis = new FileInputStream(filePath)) {
            properties.load(fis);
            propertyValue = properties.getProperty(propertyName);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return propertyValue;
    }
}