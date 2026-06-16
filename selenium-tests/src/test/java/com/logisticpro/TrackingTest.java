package com.logisticpro;

import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.Test;

public class TrackingTest extends BaseTest {

    private final String TEST_EMAIL = "selenium_track_" + System.currentTimeMillis() + "@mailtest.com";
    private final String TEST_PASSWORD = "Test@1234";

    @Test
    public void testTrackingFlow() throws InterruptedException {
        // Register and quick profile
        driver.get(FRONTEND_URL + "/register");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name='email']"))).sendKeys(TEST_EMAIL);
        driver.findElement(By.cssSelector("input[name='password']")).sendKeys(TEST_PASSWORD);
        wait.until(ExpectedConditions.elementToBeClickable(By.id("register-btn"))).click();
        wait.until(ExpectedConditions.urlContains("/profileSetup"));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name='name']"))).sendKeys("Tracker");
        driver.findElement(By.cssSelector("input[name='phone']")).sendKeys("9009009000");
        // select role so profile submit proceeds and navigates to /home
        driver.findElement(By.id("profile-role")).sendKeys("user");
        scrollIntoViewAndClick(By.id("profile-submit"));

        // Create order
        scrollIntoViewAndClick(By.id("hero-create-order"));
        wait.until(ExpectedConditions.urlContains("/pickup"));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("pickup-contact"))).sendKeys("9000000001");
        driver.findElement(By.id("pickup-address")).sendKeys("1 Track Ln");
        driver.findElement(By.id("pickup-city")).sendKeys("City");
        driver.findElement(By.id("pickup-pincode")).sendKeys("400001");
        driver.findElement(By.id("pickup-state")).sendKeys("State");
        scrollIntoViewAndClick(By.id("pickup-next-btn"));

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("delivery-contact"))).sendKeys("9000000002");
        driver.findElement(By.id("delivery-address")).sendKeys("2 Track Ave");
        driver.findElement(By.id("delivery-city")).sendKeys("City");
        driver.findElement(By.id("delivery-pincode")).sendKeys("400002");
        driver.findElement(By.id("delivery-state")).sendKeys("State");
        scrollIntoViewAndClick(By.id("delivery-next-btn"));

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("parcel-weight"))).sendKeys("0.5");
        scrollIntoViewAndClick(By.id("parcel-next-btn"));

        // On payment page, capture Order ID from summary row
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[contains(.,'Order ID')]/following-sibling::span")));
        String orderId = driver.findElement(By.xpath("//span[contains(.,'Order ID')]/following-sibling::span")).getText().trim();
        Assert.assertFalse(orderId.isEmpty(), "Order ID should be present");

        // Use tracking on home page
        driver.get(FRONTEND_URL + "/home");
        var input = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[placeholder='Order ID']")));
        input.sendKeys(orderId);
        driver.findElement(By.xpath("//button[normalize-space(text())='TRACK']")).click();
        wait.until(ExpectedConditions.urlContains("/tracking"));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), orderId));
        Assert.assertTrue(driver.getPageSource().contains(orderId), "Tracking page should show the orderId");
    }
}
