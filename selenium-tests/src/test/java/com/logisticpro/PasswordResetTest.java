package com.logisticpro;

import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.Test;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class PasswordResetTest extends BaseTest {

    private final String TEST_EMAIL = "selenium_reset_" + System.currentTimeMillis() + "@mailtest.com";
    private final String ORIGINAL_PASSWORD = "Test@1234";
    private final String NEW_PASSWORD = "NewPass@1234";

    @Test
    public void testPasswordResetFlow() throws InterruptedException {
        // Register user
        driver.get(FRONTEND_URL + "/register");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name='email']"))).sendKeys(TEST_EMAIL);
        driver.findElement(By.cssSelector("input[name='password']")).sendKeys(ORIGINAL_PASSWORD);
        wait.until(ExpectedConditions.elementToBeClickable(By.id("register-btn"))).click();
        wait.until(ExpectedConditions.urlContains("/profileSetup"));
        scrollIntoViewAndClick(By.id("profile-submit"));

        // Go to Forgot Password
        driver.get(FRONTEND_URL + "/forgot-password");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[type='email']"))).sendKeys(TEST_EMAIL);
        driver.findElement(By.xpath("//button[normalize-space(text())='Send Reset Link']")).click();

        // Wait for reset token UI
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h2[contains(.,'Reset Code Generated')]") ));
        String token = driver.findElement(By.xpath("//p[contains(.,'Your reset code is')]/strong")).getText().trim();
        Assert.assertFalse(token.isEmpty(), "Reset token should be shown in UI");

        // Navigate to reset page via URL
        driver.get(FRONTEND_URL + "/reset-password?email=" + URLEncoder.encode(TEST_EMAIL, StandardCharsets.UTF_8) + "&token=" + URLEncoder.encode(token, StandardCharsets.UTF_8));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[type='password']")));
        var pwFields = driver.findElements(By.cssSelector("input[type='password']"));
        pwFields.get(0).sendKeys(NEW_PASSWORD);
        pwFields.get(1).sendKeys(NEW_PASSWORD);
        driver.findElement(By.xpath("//button[normalize-space(text())='Reset Password']")).click();

        // Confirm success text and then login with new password
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(.,'Password Reset Successfully') or contains(.,'success')]")));
        driver.get(FRONTEND_URL + "/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name='email']"))).sendKeys(TEST_EMAIL);
        driver.findElement(By.cssSelector("input[name='password']")).sendKeys(NEW_PASSWORD);
        driver.findElement(By.id("login-btn")).click();
        wait.until(ExpectedConditions.urlContains("/home"));
        Assert.assertTrue(driver.getCurrentUrl().contains("/home"), "Login after reset should redirect to /home");
    }
}
