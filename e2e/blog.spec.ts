import { test, expect } from '@playwright/test'

// 테스트용 페이지 (다양한 블록 타입을 포함)
const TEST_POST_ID = '33e91e41-e8fe-4506-b654-fb6b4039cad2'

test.describe('홈페이지', () => {
  test('게시물 목록이 정상 렌더링된다', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.blog-home-title')).toBeVisible()
    await expect(page.locator('.blog-post-item').first()).toBeVisible()
  })
})

test.describe('포스트 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
  })

  test('페이지 타이틀이 렌더링된다', async ({ page }) => {
    await expect(page.locator('.notion-title')).toBeVisible()
  })

  test('페이지 커버 이미지가 로드된다', async ({ page }) => {
    const cover = page.locator('.notion-page-cover')
    if (await cover.count() > 0) {
      const src = await cover.getAttribute('src')
      expect(src).toBeTruthy()
      expect(src).not.toMatch(/^\/images\//) // 상대 경로가 아닌 절대 URL
    }
  })
})

test.describe('불릿 리스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
  })

  test('중첩 레벨별 마커가 다르다 (•, ◦, ▪)', async ({ page }) => {
    const markers = page.locator('.notion-list-disc .notion-list-item-marker')
    const count = await markers.count()
    if (count === 0) return

    // 최상위 마커: •
    const topLevel = page.locator(
      ':not(.notion-list-item-content) > .notion-list-disc > .notion-list-item-marker'
    )
    if (await topLevel.count() > 0) {
      await expect(topLevel.first()).toHaveText('•')
    }

    // 중첩 마커: ◦
    const nested = page.locator(
      '.notion-list-disc .notion-list-item-content > .notion-list-disc > .notion-list-item-marker'
    )
    if (await nested.count() > 0) {
      await expect(nested.first()).toHaveText('◦')
    }
  })
})

test.describe('번호 리스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/33e91e41-e8fe-4506-b654-fb6b4039cad2`)
  })

  test('최상위 번호가 1. 2. 3. 형식이다', async ({ page }) => {
    const topMarkers = page.locator(
      ':not(.notion-list-item-content) > .notion-list-numbered > .notion-list-item-marker'
    )
    if (await topMarkers.count() >= 2) {
      await expect(topMarkers.nth(0)).toHaveText('1.')
      await expect(topMarkers.nth(1)).toHaveText('2.')
    }
  })

  test('중첩 번호가 a. b. c. 형식이다', async ({ page }) => {
    const nestedMarkers = page.locator(
      '.notion-list-numbered .notion-list-item-content > .notion-list-numbered > .notion-list-item-marker'
    )
    if (await nestedMarkers.count() >= 2) {
      await expect(nestedMarkers.nth(0)).toHaveText('a.')
      await expect(nestedMarkers.nth(1)).toHaveText('b.')
    }
  })
})

test.describe('이미지 블록', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
  })

  test('이미지가 로드되고 border-radius가 적용된다', async ({ page }) => {
    const img = page.locator('.notion-asset-wrapper-image img').first()
    if (await img.count() > 0) {
      await expect(img).toBeVisible()
      const borderRadius = await img.evaluate(el => getComputedStyle(el).borderRadius)
      expect(borderRadius).toBe('2px')
    }
  })

  test('가운데 정렬 이미지에 margin auto가 적용된다', async ({ page }) => {
    const centered = page.locator('.notion-asset-align-center').first()
    if (await centered.count() > 0) {
      const ml = await centered.evaluate(el => getComputedStyle(el).marginLeft)
      const mr = await centered.evaluate(el => getComputedStyle(el).marginRight)
      expect(ml).not.toBe('0px')
      expect(ml).toBe(mr)
    }
  })

  test('캡션이 이미지와 같은 컨테이너 안에 있다', async ({ page }) => {
    const captionParent = page.locator('.notion-asset-wrapper-image .notion-asset-caption').first()
    if (await captionParent.count() > 0) {
      // 캡션의 부모 div와 img의 부모 div가 동일한지 확인
      const isSibling = await captionParent.evaluate(el => {
        const parent = el.parentElement
        return parent?.querySelector('img') !== null
      })
      expect(isSibling).toBe(true)
    }
  })
})

test.describe('다크모드', () => {
  test('다크모드에서 배경색이 변경된다', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto(`/post/${TEST_POST_ID}`)

    const bg = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor)
    // #191919 = rgb(25, 25, 25)
    expect(bg).toBe('rgb(25, 25, 25)')
  })

  test('라이트모드에서 배경색이 흰색이다', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(`/post/${TEST_POST_ID}`)

    const bg = await page.locator('.notion').first().evaluate(el => getComputedStyle(el).backgroundColor)
    // #fff = rgb(255, 255, 255)
    expect(bg).toBe('rgb(255, 255, 255)')
  })
})

test.describe('콜아웃', () => {
  test('콜아웃이 배경색과 아이콘을 가진다', async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)

    const callout = page.locator('.notion-callout').first()
    if (await callout.count() > 0) {
      await expect(callout).toBeVisible()

      const bg = await callout.evaluate(el => getComputedStyle(el).backgroundColor)
      expect(bg).not.toBe('rgba(0, 0, 0, 0)') // 투명이 아닌 배경색

      const icon = callout.locator('.notion-callout-icon')
      await expect(icon).toBeVisible()
    }
  })
})
