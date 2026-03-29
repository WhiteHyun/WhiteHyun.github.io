import { test, expect, type Locator } from '@playwright/test'

const TEST_POST_ID = '33e91e41-e8fe-4506-b654-fb6b4039cad2'

async function css(locator: Locator, prop: string): Promise<string> {
  return locator.evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop)
}

// ============================================
// 이미지 기본 정렬 = left
// ============================================
test.describe('이미지 기본 정렬', () => {
  test('alignment 미지정 이미지는 왼쪽 정렬 (margin-left: 0)', async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)

    // align 클래스가 없는 이미지 = 왼쪽 정렬
    const leftAligned = page.locator(
      '.notion-asset-wrapper-image:not(.notion-asset-align-center):not(.notion-asset-align-right)'
    ).first()
    if (await leftAligned.count() > 0) {
      expect(await css(leftAligned, 'margin-left')).toBe('0px')
    }
  })

  test('가운데 정렬 이미지는 notion-asset-align-center 클래스를 가진다', async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)

    const centered = page.locator('.notion-asset-align-center').first()
    if (await centered.count() > 0) {
      const ml = await css(centered, 'margin-left')
      const mr = await css(centered, 'margin-right')
      // margin auto → 계산값이 동일
      expect(ml).toBe(mr)
      expect(ml).not.toBe('0px')
    }
  })
})

// ============================================
// 텍스트 색상 — Notion 실제 테마 값
// ============================================
test.describe('텍스트 색상 (Notion 실제 테마)', () => {
  test('라이트모드: .notion-gray → #7d7a75', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(`/post/${TEST_POST_ID}`)

    const gray = page.locator('.notion-gray').first()
    if (await gray.count() > 0) {
      // #7d7a75 = rgb(125, 122, 117)
      expect(await css(gray, 'color')).toBe('rgb(125, 122, 117)')
    }
  })

  test('라이트모드: .notion-blue → #387dc9', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(`/post/${TEST_POST_ID}`)

    const blue = page.locator('.notion-blue').first()
    if (await blue.count() > 0) {
      // #387dc9 = rgb(56, 125, 201)
      expect(await css(blue, 'color')).toBe('rgb(56, 125, 201)')
    }
  })

  test('라이트모드: .notion-red → #cf5148', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(`/post/${TEST_POST_ID}`)

    const red = page.locator('.notion-red').first()
    if (await red.count() > 0) {
      // #cf5148 = rgb(207, 81, 72)
      expect(await css(red, 'color')).toBe('rgb(207, 81, 72)')
    }
  })
})

// ============================================
// 배경색 — BacSec CSS 변수 적용
// ============================================
test.describe('배경색 BacSec 변수', () => {
  test('라이트모드: .notion-teal_background → greBacSec (#e8f1ec)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(`/post/${TEST_POST_ID}`)

    const tealBg = page.locator('.notion-teal_background').first()
    if (await tealBg.count() > 0) {
      // #e8f1ec = rgb(232, 241, 236)
      expect(await css(tealBg, 'background-color')).toBe('rgb(232, 241, 236)')
    }
  })

  test('다크모드: .notion-teal_background → 다크 greBacSec (#263d30)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto(`/post/${TEST_POST_ID}`)

    const tealBg = page.locator('.notion-teal_background').first()
    if (await tealBg.count() > 0) {
      // #263d30 = rgb(38, 61, 48)
      expect(await css(tealBg, 'background-color')).toBe('rgb(38, 61, 48)')
    }
  })

  test('콜아웃 배경도 BacSec 변수를 사용한다', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(`/post/${TEST_POST_ID}`)

    const callout = page.locator('.notion-callout[class*="_background"]').first()
    if (await callout.count() > 0) {
      const bg = await css(callout, 'background-color')
      // 투명이 아닌 실제 배경색이 적용되었는지
      expect(bg).not.toBe('rgba(0, 0, 0, 0)')
    }
  })
})

// ============================================
// CSS 변수 :root 스코프
// ============================================
test.describe('CSS 변수 :root 스코프', () => {
  test('body에서 --c-bacPri 변수에 접근 가능하다', async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)

    // :root에 변수가 선언되어 있으면 body에서도 접근 가능
    const value = await page.evaluate(() => {
      return getComputedStyle(document.body).getPropertyValue('--c-bacPri').trim()
    })
    expect(value).toBeTruthy()
    expect(value).not.toBe('')
  })

  test('.blog-home에서도 --c-texPri 변수에 접근 가능하다', async ({ page }) => {
    await page.goto('/')

    const value = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--c-texPri').trim()
    })
    expect(value).toBeTruthy()
    expect(value).not.toBe('')
  })
})

// ============================================
// 리스트 내 인라인 링크 텍스트 흐름
// ============================================
test.describe('리스트 내 인라인 링크', () => {
  test('링크가 텍스트와 같은 줄에 인라인으로 표시된다', async ({ page }) => {
    await page.goto(`/post/9f2346f3-ce9a-4c23-a577-c8fc515ae975`)

    // 링크를 포함하는 리스트 아이템의 콘텐츠 영역
    const content = page.locator('.notion-list-item-content:has(.notion-link)').first()
    if (await content.count() > 0) {
      // 콘텐츠가 flex column이 아닌지 확인 (flex column이면 링크가 별도 줄로 밀림)
      const display = await css(content, 'display')
      expect(display).not.toBe('flex')
    }
  })
})

// ============================================
// CodeBlock 캡션 서식 지원
// ============================================
test.describe('코드 블록 캡션', () => {
  test('캡션이 존재하면 notion-asset-caption으로 렌더링된다', async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)

    // 코드 블록 바로 뒤의 캡션
    const codeCaption = page.locator('.notion-code + .notion-asset-caption').first()
    if (await codeCaption.count() > 0) {
      await expect(codeCaption).toBeVisible()
      expect(await css(codeCaption, 'font-size')).toBe('14px')
    }
  })
})
