const { test, describe, beforeEach, expect } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/blogs', {
      data: {
        title: 'test Blog',
        author: 'Matti Luukkainen',
        url: 'www',
        likes: 0,
        user: {
          username: 'mluukkai'
        }
      }
    })
    await page.goto('/')
  })

  
  test('frontpage shows loginform', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
  })
  
  test('user can log in', async ({ page }) => {
    await page.getByTestId('username').first().fill('mluukkai')
    await page.getByTestId('password').last().fill('salainen')
    await page.getByRole('button', {name: 'login'}).click()

    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login with incorrect login credentials shows error', async ({ page }) => {
    await page.getByTestId('username').first().fill('mluukkai')
    await page.getByTestId('password').last().fill('salasana')
    await page.getByRole('button', {name: 'login'}).click()

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong username or password')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })


})