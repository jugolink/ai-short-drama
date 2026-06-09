const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to director.tree456.com...');
    await page.goto('https://director.tree456.com/', { waitUntil: 'networkidle' });

    // Wait for the page to load and find login link
    // It might be an a tag with href containing login or text "登录"
    
    // Check if there is a login form directly or if we need to click "登录"
    const loginLink = await page.$('text="登录"');
    if (loginLink) {
        console.log('Clicking login link...');
        await loginLink.click();
        await page.waitForTimeout(2000);
    }
    
    // Fill credentials
    console.log('Filling credentials...');
    // We try generic selectors for email and password
    await page.fill('input[type="email"], input[placeholder*="邮箱"], input[name*="mail"]', 'flarum.cocodemo@gmail.com').catch(() => console.log('Email input not found with generic selector'));
    await page.fill('input[type="password"], input[placeholder*="密码"]', 'yb6nJ.RDqt42p9B').catch(() => console.log('Password input not found with generic selector'));
    
    // Click submit
    console.log('Submitting...');
    const submitBtn = await page.$('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    if (submitBtn) {
        await submitBtn.click();
    } else {
        await page.keyboard.press('Enter');
    }

    console.log('Waiting for navigation...');
    await page.waitForTimeout(5000); // wait for login to complete

    // Extract page content
    const url = page.url();
    console.log('Current URL after login:', url);

    // Get all text content or link structures
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a, button')).map(el => ({
        tag: el.tagName,
        text: el.innerText.trim(),
        href: el.getAttribute('href')
      })).filter(item => item.text.length > 0);
    });

    const pageText = await page.evaluate(() => document.body.innerText);

    fs.writeFileSync('/home/xiaozhu/Documents/Github/drama/ai-short-drama/scrape_result.json', JSON.stringify({
      url,
      links: links.slice(0, 50), // first 50 to avoid clutter
      pageText: pageText.substring(0, 2000) // first 2000 chars
    }, null, 2));

    console.log('Scrape completed. Saved to scrape_result.json');

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
})();
