package com.logisticpro;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;

import java.time.Duration;

public class BaseTest {

    protected static final String FRONTEND_URL = "http://localhost:5173";
    protected static final int WAIT_SECONDS = 15;

    protected WebDriver driver;
    protected WebDriverWait wait;

    @BeforeClass
    public void setUpBase() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--window-size=1280,900");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(WAIT_SECONDS));
    }

    @AfterClass
    public void tearDownBase() {
        if (driver != null) driver.quit();
    }

    protected void scrollIntoViewAndClick(org.openqa.selenium.By locator) {
        var el = wait.until(driver1 -> driver1.findElement(locator));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'})", el);

        // Wait until the element is likely not covered by another element at its center.
        long end = System.currentTimeMillis() + (WAIT_SECONDS * 1000L);
        boolean clicked = false;
        while (System.currentTimeMillis() < end && !clicked) {
            try {
                // Check if element is top-most at its center point
                Boolean topMost = (Boolean) ((JavascriptExecutor) driver).executeScript(
                        "var el=arguments[0]; var r=el.getBoundingClientRect(); var x=(r.left+r.right)/2; var y=(r.top+r.bottom)/2; var top=document.elementFromPoint(x,y); return (el===top || el.contains(top));",
                        el);

                if (topMost != null && topMost) {
                    try {
                        el.click();
                        clicked = true;
                        break;
                    } catch (org.openqa.selenium.ElementClickInterceptedException ex) {
                        // fall through to JS click fallback below
                    }
                }

                // Fallback: try a JS click (works even if overlay briefly present)
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", el);
                clicked = true;
                break;
            } catch (Exception e) {
                try { Thread.sleep(200); } catch (InterruptedException ie) { /* ignore */ }
            }
        }

        if (!clicked) {
            // Last resort: attempt JS click once more and let exception propagate if it fails
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", el);
        }
    }
}
