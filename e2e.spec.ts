import { test, expect } from '@playwright/test';

// Simple E2E test to ensure the Papa Quest flow works without breaking.
test('Full User Flow - Setup to Dashboard', async ({ page }) => {
    // Go to homepage
    await page.goto('http://localhost:3000/');

    // Should see setup screen initially since localStorage is empty
    await expect(page.getByText('パパとママのための育児支援アプリ')).toBeVisible();

    // Click 'Next' on welcome screen
    await page.getByRole('button', { name: '次へ進む' }).click();

    // Enter Child's Birthdate input
    const dateInput = page.locator('input[type="date"]');

    // Set date to 3 months ago to get some valid missions
    const dateObj = new Date();
    dateObj.setMonth(dateObj.getMonth() - 3);
    const dateStr = dateObj.toISOString().split('T')[0];
    await dateInput.fill(dateStr);

    // Select participation
    await page.getByText('そこそこ・部分的に参加してきた').click();

    // Click start
    await page.getByRole('button', { name: 'クエストを開始する' }).click();

    // Expect to see the Initial Bonus Celebration
    await expect(page.getByText('WELCOME BONUS!')).toBeVisible();

    // Close the bonus celebration
    await page.getByRole('button', { name: '冒険をはじめる' }).click();

    // Now we should be on the main page with a mission
    await expect(page.getByText('今日のミッション', { exact: true })).toBeVisible();

    // Agree to safety
    await page.getByText('⚠️ 周囲の安全を確保しました').click();

    // Complete mission
    await page.getByRole('button', { name: '安全を確認して完了（EXP獲得）' }).click();

    // Wait for the Completed Dashboard to appear
    await expect(page.getByText('本日のミッション完了')).toBeVisible();

    // Verify infinite quests section exists
    await expect(page.getByText('もっと頑張るパパへ')).toBeVisible();

    // Click an infinite quest
    await page.getByRole('button', { name: /ミルク・おむつ替え/ }).click();

    // Verify floating EXP shows up
    await expect(page.getByText('+2 EXP!')).toBeVisible();

    // Open settings
    await page.getByRole('button', { name: 'Settings' }).click();

    // Verify settings modal opens
    await expect(page.getByRole('heading', { name: 'お子さんの成長設定' })).toBeVisible();

    // Close settings
    await page.getByRole('button', { name: '設定を更新する' }).click();

    console.log('✅ All steps completed perfectly!');
});
