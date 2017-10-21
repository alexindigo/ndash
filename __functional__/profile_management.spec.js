describe('Profile management', () => {
  it('can add a profile, by name', async () => {
    await browser.waitForExist('~Home button');
    await browser.click('~Home button');
    await browser.waitForExist('~Add profile button');
    await browser.click('~Add profile button');
    await browser.keys('jdalton');
    await browser.click('~ok');
    await browser.waitForExist('~Profile: jdalton');
  });
});