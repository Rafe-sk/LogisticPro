package com.logisticpro;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CreateOrderTest extends BaseTest {

    private final String TEST_EMAIL = "selenium_order_" + System.currentTimeMillis() + "@mailtest.com";
    private final String TEST_PASSWORD = "Test@1234";

    @Test
    public void testCreateOrderFullFlow() throws InterruptedException {
        // Register user and complete profile using same steps as AuthTest
        driver.get(FRONTEND_URL + "/register");

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name='email']"))).sendKeys(TEST_EMAIL);
        driver.findElement(By.cssSelector("input[name='password']")).sendKeys(TEST_PASSWORD);
        wait.until(ExpectedConditions.elementToBeClickable(By.id("register-btn"))).click();
        wait.until(ExpectedConditions.urlContains("/profileSetup"));

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name='name']"))).sendKeys("Selenium Orderer");
        driver.findElement(By.cssSelector("input[name='phone']")).sendKeys("9009009000");
        driver.findElement(By.cssSelector("select[name='role']")).sendKeys("user");
        driver.findElement(By.cssSelector("textarea[name='address']")).sendKeys("1 Selenium St");
        driver.findElement(By.cssSelector("input[name='city']")).sendKeys("Mumbai");
        driver.findElement(By.cssSelector("input[name='pincode']")).sendKeys("400001");
        driver.findElement(By.cssSelector("input[name='state']")).sendKeys("Maharashtra");

        var submit = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("profile-submit")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'})", submit);
        Thread.sleep(300);
        wait.until(ExpectedConditions.elementToBeClickable(submit)).click();

        // Should be on /home and be able to create order
        wait.until(ExpectedConditions.urlContains("/home"));
        // Use helper to scroll into view then click to avoid intercepts
        scrollIntoViewAndClick(By.id("hero-create-order"));
        wait.until(ExpectedConditions.urlContains("/pickup"));

        // Fill pickup
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("pickup-contact"))).sendKeys("9001110001");
        driver.findElement(By.id("pickup-address")).sendKeys("1 Cancel St");
        driver.findElement(By.id("pickup-city")).sendKeys("City");
        driver.findElement(By.id("pickup-pincode")).sendKeys("400001");
        driver.findElement(By.id("pickup-state")).sendKeys("State");
        scrollIntoViewAndClick(By.id("pickup-next-btn"));

        // Delivery
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("delivery-contact"))).sendKeys("9001110002");
        driver.findElement(By.id("delivery-address")).sendKeys("2 Cancel Ave");
        driver.findElement(By.id("delivery-city")).sendKeys("City");
        driver.findElement(By.id("delivery-pincode")).sendKeys("400002");
        driver.findElement(By.id("delivery-state")).sendKeys("State");
        scrollIntoViewAndClick(By.id("delivery-next-btn"));

        // Parcel
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("parcel-weight"))).sendKeys("1");
        scrollIntoViewAndClick(By.id("parcel-next-btn"));

        // Payment
        // final submit
        scrollIntoViewAndClick(By.id("submit-payment-btn"));

        // Assert success message
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h2[contains(text(),'Order Placed') or contains(text(),'Order Placed!')]")));
        Assert.assertTrue(driver.getPageSource().contains("Order Placed"), "Order success message not found");
    }
}
