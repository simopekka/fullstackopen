const { test, describe, beforeEach, expect } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
    await page.goto('/')
  })

  test('frontpage shows loginform', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
  })
  
  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')

    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login with incorrect login credentials shows error', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salasana')

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong username or password')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })
})

describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/')
    await loginWith(page, 'mluukkai', 'salainen')
  })

  test('user can create new blog', async ({ page }) => {
    await expect(page.getByText('Create new blog')).toBeVisible()
    await createBlog(page, 'testi blogi', 'author', 'www.fi')

    const locator = await page.getByTestId('blogs')
    await expect(locator.getByText('testi blogi')).toBeVisible()

  })

  test('user can like blogs', async ({ page }) => {
    await page.getByRole('button', {name: 'view'}).click()
    await page.getByRole('button', {name: 'like'}).click()

    await expect(page.getByText('1like')).toBeVisible()
  })

  test('user can delete blogs', async ({ page }) => {
    await page.getByRole('button', {name: 'view'}).click()
    await expect(page.getByText('remove')).toBeVisible()
    const locator = await page.getByTestId('blogs')
    page.on('dialog', async dialog => {
      await dialog.accept()
    })
    await page.getByRole('button', {name: 'remove'}).click()
    await expect(locator.getByText('testi blogi')).not.toBeVisible()
  })
})

describe('Handling multiple blogs', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'test user',
        username: 'user',
        password: 'salainen'
      }
    })
    await page.goto('/')
    await loginWith(page, 'mluukkai', 'salainen')
    await createBlog(page, 'first', 'author', 'www.fi')
    await createBlog(page, 'second', 'author', 'www.fi')
    await createBlog(page, 'third', 'author', 'www.fi')
    await page.getByRole('button', {name: 'log out'}).click()
  })

  test('user cant remove other users blogs', async ({ page }) => {
    await loginWith(page, 'user', 'salainen')
    await page.getByRole('button', {name: 'view'}).last().click()
    await expect(page.getByText('remove')).not.toBeVisible()
  })

  test('top liked blog is shown first', async ({ page }) => {
    await loginWith(page, 'user', 'salainen')
    await page.getByRole('button', {name: 'view'}).last().click()
    await page.getByRole('button', {name: 'like'}).click()
    const locator = page.getByTestId('blog').first()
    await expect(locator.getByText('third')).toBeVisible()
  })
})
