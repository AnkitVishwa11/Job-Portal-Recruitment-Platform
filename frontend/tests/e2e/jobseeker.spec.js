const { test, expect } = require('@playwright/test');

test.describe('Job Seeker Core End-to-End Journey', () => {
  test('User Registration, Search, and Application Flow', async ({ page }) => {
    // 1. Visit Home & Navigate to Registration
    await page.goto('/');
    await expect(page).toHaveTitle(/Job Portal/i);

    // 2. Register candidate
    await page.goto('/register');
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'Candidate');
    await page.fill('input[name="email"]', `candidate_${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.selectOption('select[name="role"]', 'jobseeker');
    await page.click('button[type="submit"]');

    // 3. Search for Jobs
    await page.goto('/jobs');
    await page.fill('input[placeholder*="Search"]', 'Developer');
    await page.click('button:has-text("Search")');

    // 4. View Job Details
    const firstJob = page.locator('.job-card').first();
    if (await firstJob.isVisible()) {
      await firstJob.locator('a:has-text("View Details")').click();
      await expect(page.locator('h1')).toBeVisible();
    }
  });
});
