package com.logisticpro;

import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.Test;

public class OrderCancellationTest extends BaseTest {

    private final String TEST_EMAIL = "selenium_cancel_" + System.currentTimeMillis() + "@mailtest.com";
    private final String TEST_PASSWORD = "Test@1234";

    @Test
    public void testCancelOrderFromProfile() throws InterruptedException {
        // Register + profile
        driver.get(FRONTEND_URL + "/register");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name='email']"))).sendKeys(TEST_EMAIL);
        driver.findElement(By.cssSelector("input[name='password']")).sendKeys(TEST_PASSWORD);
        wait.until(ExpectedConditions.elementToBeClickable(By.id("register-btn"))).click();
        wait.until(ExpectedConditions.urlContains("/profileSetup"));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name='name']"))).sendKeys("Canceller");
        driver.findElement(By.cssSelector("input[name='phone']")).sendKeys("9009009000");
        driver.findElement(By.id("profile-role")).sendKeys("user");
        scrollIntoViewAndClick(By.id("profile-submit"));

        // Create order
        scrollIntoViewAndClick(By.id("hero-create-order"));
        wait.until(ExpectedConditions.urlContains("/pickup"));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("pickup-contact"))).sendKeys("9001110001");
        driver.findElement(By.id("pickup-address")).sendKeys("Cancel St 1");
        driver.findElement(By.id("pickup-city")).sendKeys("City");
        driver.findElement(By.id("pickup-pincode")).sendKeys("400001");
        driver.findElement(By.id("pickup-state")).sendKeys("State");
        scrollIntoViewAndClick(By.id("pickup-next-btn"));

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("delivery-contact"))).sendKeys("9001110002");
        driver.findElement(By.id("delivery-address")).sendKeys("Cancel Ave 2");
        driver.findElement(By.id("delivery-city")).sendKeys("City");
        driver.findElement(By.id("delivery-pincode")).sendKeys("400002");
        driver.findElement(By.id("delivery-state")).sendKeys("State");
        scrollIntoViewAndClick(By.id("delivery-next-btn"));

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("parcel-weight"))).sendKeys("1");
        scrollIntoViewAndClick(By.id("parcel-next-btn"));

        // On payment page, capture Order ID
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[contains(.,'Order ID')]/following-sibling::span")));
        String orderId = driver.findElement(By.xpath("//span[contains(.,'Order ID')]/following-sibling::span")).getText().trim();
        Assert.assertFalse(orderId.isEmpty(), "Order ID should be present");

        // Place order
        scrollIntoViewAndClick(By.id("submit-payment-btn"));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h2[contains(.,'Order Placed') or contains(.,'Order Placed!')]")));

        // Open profile -> orders
        driver.get(FRONTEND_URL + "/profile");
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(.,'Orders')]"))).click();

        // Find the order card with the orderId and click it
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[contains(.,'" + orderId + "')]/ancestor::div[contains(@class,'orderCard') or contains(@class,'order-card')]")));
        driver.findElement(By.xpath("//span[contains(.,'" + orderId + "')]")).click();

        // Click Cancel Order button in modal
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(.,'Cancel Order') or contains(.,'Cancelling')]") )).click();

        // Accept the confirm alert
        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();

        // Accept the success alert
        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();

        // Verify Cancelled status shows
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(.,'Cancelled') or contains(.,'cancelled')]") ));
        Assert.assertTrue(driver.getPageSource().toLowerCase().contains("cancelled"), "Order should be marked as Cancelled");
    }
}
