import { expect, test } from '@playwright/test';

test('create and delete article', async ({ browser }) => {

    const context = await browser.newContext({
        recordHar: { path: 'output.har', mode: 'minimal' }
    })
    const page = await context.newPage();

    await page.goto('https://conduit.bondaracademy.com/');

    //Sign in
    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('itkhanz@test.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('test1234');
    await page.getByRole('button', { name: 'Sign in' }).click();

    //Add new article
    await page.getByRole('link', { name: 'New Article' }).click();
    await page.getByRole('textbox', { name: 'Article Title' }).click();
    await page.getByRole('textbox', { name: 'Article Title' }).fill('this is a test article');
    await page.getByRole('textbox', { name: 'What\'s this article about?' }).click();
    await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('short info about article');
    await page.getByRole('textbox', { name: 'Write your article (in' }).click();
    await page.getByRole('textbox', { name: 'Write your article (in' }).fill('long description of article');
    await page.getByRole('textbox', { name: 'Enter tags' }).click();
    await page.getByRole('textbox', { name: 'Enter tags' }).fill('dummy');
    await page.getByRole('button', { name: 'Publish Article' }).click();
    await expect(page.locator('.article-page h1')).toContainText('this is a test article')

    //Add comment
    await page.getByRole('textbox', { name: 'Write a comment...' }).click();
    await page.getByRole('textbox', { name: 'Write a comment...' }).fill('test comment');
    await page.getByRole('button', { name: 'Post Comment' }).click();
    await expect(page.locator('app-article-comment .card-text').first()).toContainText('test comment')

    //Delete Comment
    await page.locator('.mod-options > .ion-trash-a').click();
    await expect(page.locator('app-article-list h1').first()).not.toBeVisible();


    //Delete article
    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByText(' Global Feed ').click();
    await page.getByRole('link', { name: 'this is a test article short' }).click();
    await page.getByRole('button', { name: 'Delete Article' }).first().click();
    await page.getByText(' Global Feed ').click();
    await expect(page.locator('app-article-list h1').first()).not.toContainText('this is a test article');

    await context.close();
});