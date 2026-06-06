"""
LogisticPro - Selenium Auth Tests (JWT-based, no Firebase)
============================================================
Tests:
  1. test_01_signup_and_profile_setup  – Registers via email/password,
                                         completes ProfileSetup, verifies
                                         the record exists in MongoDB.
  2. test_02_login                     – Logs in with the same credentials,
                                         verifies redirect to /home.

Prerequisites (run once):
  pip3 install selenium webdriver-manager pymongo

Make sure before running:
  Frontend : cd Frontend && npm run dev     (http://localhost:5173)
  Backend  : cd Backend  && node index.js   (http://localhost:8000)
  MongoDB  : running on mongodb://localhost:27017
"""

import time
import uuid
import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from pymongo import MongoClient

# ─── Configuration ────────────────────────────────────────────────────────────

FRONTEND_URL  = "http://localhost:5173"
MONGO_URI     = "mongodb://localhost:27017"
MONGO_DB      = "Logistics"
MONGO_COLL    = "users"

# Unique email per run — no "already registered" conflicts
TEST_EMAIL    = f"testuser_{uuid.uuid4().hex[:6]}@mailtest.com"
TEST_PASSWORD = "Test@1234"

PROFILE_NAME    = "Selenium Tester"
PROFILE_PHONE   = "9876543210"
PROFILE_ROLE    = "user"
PROFILE_ADDRESS = "123 Test Lane, Selenium Nagar"
PROFILE_CITY    = "Mumbai"
PROFILE_PINCODE = "400001"
PROFILE_STATE   = "Maharashtra"

WAIT = 15   # seconds

# ─── Driver factory ───────────────────────────────────────────────────────────

def make_driver():
    opts = webdriver.ChromeOptions()
    opts.add_argument("--window-size=1280,900")
    # opts.add_argument("--headless=new")  # uncomment to run headless
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=opts)

# ─── Tests ────────────────────────────────────────────────────────────────────

class TestAuth(unittest.TestCase):

    # ── Test 1: Signup + ProfileSetup ─────────────────────────────────────────
    def test_01_signup_and_profile_setup(self):
        """Register with email/password, complete ProfileSetup, verify MongoDB."""
        driver = make_driver()
        wait   = WebDriverWait(driver, WAIT)

        try:
            # 1. Open Register page
            driver.get(f"{FRONTEND_URL}/register")
            print(f"\n[SIGNUP] {TEST_EMAIL}")

            # 2. Fill email + password, click Sign Up
            wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[name='email']"))).send_keys(TEST_EMAIL)
            driver.find_element(By.CSS_SELECTOR, "input[name='password']").send_keys(TEST_PASSWORD)
            driver.find_element(By.XPATH, "//button[normalize-space(text())='Sign Up']").click()
            print("[SIGNUP] Clicked Sign Up ✓")

            # 3. Wait for ProfileSetup (JWT auth is synchronous — no loading delay)
            wait.until(EC.url_contains("/profileSetup"))
            print("[SIGNUP] Redirected to /profileSetup ✓")

            # 4. Fill profile form
            wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[name='name']"))).send_keys(PROFILE_NAME)
            driver.find_element(By.CSS_SELECTOR, "input[name='phone']").send_keys(PROFILE_PHONE)
            Select(driver.find_element(By.CSS_SELECTOR, "select[name='role']")).select_by_value(PROFILE_ROLE)
            driver.find_element(By.CSS_SELECTOR, "textarea[name='address']").send_keys(PROFILE_ADDRESS)
            driver.find_element(By.CSS_SELECTOR, "input[name='city']").send_keys(PROFILE_CITY)
            driver.find_element(By.CSS_SELECTOR, "input[name='pincode']").send_keys(PROFILE_PINCODE)
            driver.find_element(By.CSS_SELECTOR, "input[name='state']").send_keys(PROFILE_STATE)
            print("[SIGNUP] Profile form filled ✓")

            # 5. Submit ProfileSetup
            driver.find_element(By.XPATH, "//button[normalize-space(text())='Submit']").click()
            print("[SIGNUP] Submitted profile ✓")

            # 6. Give the backend a moment to write to MongoDB
            time.sleep(2)

            # 7. Verify the record in MongoDB
            client = MongoClient(MONGO_URI)
            user   = client[MONGO_DB][MONGO_COLL].find_one({"email": TEST_EMAIL})
            client.close()

            self.assertIsNotNone(user, f"[FAIL] No user found in MongoDB for {TEST_EMAIL}")
            self.assertEqual(user.get("name"),    PROFILE_NAME,    "Name mismatch in DB")
            self.assertEqual(user.get("phone"),   PROFILE_PHONE,   "Phone mismatch in DB")
            self.assertEqual(user.get("city"),    PROFILE_CITY,    "City mismatch in DB")
            self.assertEqual(user.get("pincode"), PROFILE_PINCODE, "Pincode mismatch in DB")
            self.assertEqual(user.get("state"),   PROFILE_STATE,   "State mismatch in DB")

            print(f"[SIGNUP] MongoDB record verified ✓  _id={user['_id']}")

        finally:
            time.sleep(1)
            driver.quit()

    # ── Test 2: Login ─────────────────────────────────────────────────────────
    def test_02_login(self):
        """Login with email/password and verify redirect to /home."""
        driver = make_driver()
        wait   = WebDriverWait(driver, WAIT)

        try:
            # 1. Open Login page
            driver.get(f"{FRONTEND_URL}/")
            print(f"\n[LOGIN] {TEST_EMAIL}")

            # 2. Fill email + password, click Login
            wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[name='email']"))).send_keys(TEST_EMAIL)
            driver.find_element(By.CSS_SELECTOR, "input[name='password']").send_keys(TEST_PASSWORD)
            driver.find_element(By.XPATH, "//button[normalize-space(text())='Login']").click()
            print("[LOGIN] Clicked Login ✓")

            # 3. Assert redirect to /home
            wait.until(EC.url_contains("/home"))
            self.assertIn("/home", driver.current_url, "Did not redirect to /home")
            print(f"[LOGIN] Redirected to {driver.current_url} ✓")

        finally:
            time.sleep(1)
            driver.quit()


if __name__ == "__main__":
    unittest.main(verbosity=2)
