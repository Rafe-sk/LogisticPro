package com.logisticpro;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.bson.Document;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.*;

import java.time.Duration;
import java.util.UUID;

/**
 * LogisticPro — Selenium Auth Tests (Java + TestNG + Maven)
 * ===========================================================
 * Tests:
 *   1. testSignupAndProfileSetup  – Registers via email/password,
 *                                    completes ProfileSetup, verifies MongoDB.
 *   2. testLogin                  – Logs in with same credentials,
 *                                    verifies redirect to /home.
 *
 * Prerequisites:
 *   Frontend : npm run dev     → http://localhost:5173
 *   Backend  : npm start       → http://localhost:8000
 *   MongoDB  : localhost:27017
 *
 * Run:
 *   cd selenium-tests && mvn test
 */
public class AuthTest {

    // ── Config ────────────────────────────────────────────────────────────────
    private static final String FRONTEND_URL = "http://localhost:5173";
    private static final String MONGO_URI    = "mongodb://localhost:27017";
    private static final String MONGO_DB     = "Logistics";
    private static final String MONGO_COLL   = "users";

    // Unique email per test run — no duplicate conflicts
    private static final String TEST_EMAIL    = "java_" + UUID.randomUUID().toString().substring(0, 6) + "@mailtest.com";
    private static final String TEST_PASSWORD = "Test@1234";

    // Profile Setup data
    private static final String PROFILE_NAME    = "Java Tester";
    private static final String PROFILE_PHONE   = "9988776655";
    private static final String PROFILE_ROLE    = "user";
    private static final String PROFILE_ADDRESS = "789 Java Street, Maven Nagar";
    private static final String PROFILE_CITY    = "Bengaluru";
    private static final String PROFILE_PINCODE = "560001";
    private static final String PROFILE_STATE   = "Karnataka";

    private static final int WAIT_SECONDS = 15;

    // ── Driver ────────────────────────────────────────────────────────────────
    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeClass
    public void setUp() {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        // options.addArguments("--headless=new");  // uncomment for headless
        options.addArguments("--window-size=1280,900");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        driver = new ChromeDriver(options);
        wait   = new WebDriverWait(driver, Duration.ofSeconds(WAIT_SECONDS));
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    // ── Test 1: Signup + ProfileSetup ─────────────────────────────────────────
    @Test(priority = 1, description = "Register with email/password, complete ProfileSetup, verify MongoDB")
    public void testSignupAndProfileSetup() throws InterruptedException {

        // 1. Open Register page
        driver.get(FRONTEND_URL + "/register");
        System.out.println("\n[SIGNUP] Email: " + TEST_EMAIL);

        // 2. Fill email + password
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name='email']")))
            .sendKeys(TEST_EMAIL);
        driver.findElement(By.cssSelector("input[name='password']"))
            .sendKeys(TEST_PASSWORD);

        // 3. Click Create Account button (id=register-btn, text='Create Account')
        wait.until(ExpectedConditions.elementToBeClickable(By.id("register-btn"))).click();
        System.out.println("[SIGNUP] Clicked Create Account ✓");

        // 4. Wait for redirect to /profileSetup
        wait.until(ExpectedConditions.urlContains("/profileSetup"));
        System.out.println("[SIGNUP] Redirected to /profileSetup ✓");

        // 5. Fill profile form
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name='name']")))
            .sendKeys(PROFILE_NAME);

        driver.findElement(By.cssSelector("input[name='phone']")).sendKeys(PROFILE_PHONE);

        new Select(driver.findElement(By.cssSelector("select[name='role']")))
            .selectByValue(PROFILE_ROLE);

        driver.findElement(By.cssSelector("textarea[name='address']")).sendKeys(PROFILE_ADDRESS);
        driver.findElement(By.cssSelector("input[name='city']")).sendKeys(PROFILE_CITY);
        driver.findElement(By.cssSelector("input[name='pincode']")).sendKeys(PROFILE_PINCODE);
        driver.findElement(By.cssSelector("input[name='state']")).sendKeys(PROFILE_STATE);
        System.out.println("[SIGNUP] Profile form filled ✓");

        // 6. Submit (id=profile-submit, text='Save & Continue →')
        // Scroll into view first — fixed navbar can intercept the click otherwise
        WebElement submitBtn = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("profile-submit")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'});", submitBtn);
        Thread.sleep(300); // brief pause for scroll to complete
        wait.until(ExpectedConditions.elementToBeClickable(submitBtn)).click();
        System.out.println("[SIGNUP] Submitted profile ✓");

        // 7. Give backend time to write to MongoDB
        Thread.sleep(2000);

        // 8. Verify record in MongoDB
        try (MongoClient mongoClient = MongoClients.create(MONGO_URI)) {
            MongoDatabase db         = mongoClient.getDatabase(MONGO_DB);
            MongoCollection<Document> col = db.getCollection(MONGO_COLL);

            Document user = col.find(new Document("email", TEST_EMAIL)).first();

            Assert.assertNotNull(user, "[FAIL] No user found in MongoDB for: " + TEST_EMAIL);
            Assert.assertEquals(user.getString("name"),    PROFILE_NAME,    "Name mismatch");
            Assert.assertEquals(user.getString("phone"),   PROFILE_PHONE,   "Phone mismatch");
            Assert.assertEquals(user.getString("city"),    PROFILE_CITY,    "City mismatch");
            Assert.assertEquals(user.getString("pincode"), PROFILE_PINCODE, "Pincode mismatch");
            Assert.assertEquals(user.getString("state"),   PROFILE_STATE,   "State mismatch");

            System.out.println("[SIGNUP] MongoDB verified ✓  _id=" + user.getObjectId("_id"));
        }
    }

    // ── Test 2: Login ──────────────────────────────────────────────────────────
    @Test(priority = 2,
          description = "Login with email/password and verify redirect to /home",
          dependsOnMethods = "testSignupAndProfileSetup")
    public void testLogin() {

        // 1. Open Login page (now at /login — home page is public landing)
        driver.get(FRONTEND_URL + "/login");
        System.out.println("\n[LOGIN] Email: " + TEST_EMAIL);

        // 2. Fill credentials
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name='email']")))
            .sendKeys(TEST_EMAIL);
        driver.findElement(By.cssSelector("input[name='password']"))
            .sendKeys(TEST_PASSWORD);

        // 3. Click Sign In (button text changed from 'Login' to 'Sign In')
        driver.findElement(By.xpath("//button[normalize-space(text())='Sign In']")).click();
        System.out.println("[LOGIN] Clicked Sign In ✓");

        // 4. Wait for /home
        wait.until(ExpectedConditions.urlContains("/home"));

        Assert.assertTrue(driver.getCurrentUrl().contains("/home"),
                "[FAIL] Did not redirect to /home after login");

        System.out.println("[LOGIN] Redirected to " + driver.getCurrentUrl() + " ✓");
    }
}
