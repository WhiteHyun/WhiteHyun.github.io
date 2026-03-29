import { test, expect, type Page, type Locator } from '@playwright/test'

const TEST_POST_ID = '33e91e41-e8fe-4506-b654-fb6b4039cad2'
const NUMBERED_LIST_POST_ID = '33e91e41-e8fe-4506-b654-fb6b4039cad2'

/** 요소의 computed style 값을 가져오는 헬퍼 */
async function css(locator: Locator, prop: string): Promise<string> {
  return locator.evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop)
}

// ============================================
// 글로벌 타이포그래피
// ============================================
test.describe('글로벌 타이포그래피', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
  })

  test('.notion 기본 font-size: 16px, line-height: 1.5', async ({ page }) => {
    const notion = page.locator('.notion').first()
    expect(await css(notion, 'font-size')).toBe('16px')
    expect(await css(notion, 'line-height')).toBe('24px') // 16 * 1.5
  })

  test('bold 텍스트 font-weight: 600', async ({ page }) => {
    const bold = page.locator('.notion b').first()
    if (await bold.count() > 0) {
      expect(await css(bold, 'font-weight')).toBe('600')
    }
  })
})

// ============================================
// 페이지 레이아웃
// ============================================
test.describe('페이지 레이아웃', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
  })

  test('.notion-page max-width: 720px', async ({ page }) => {
    const notionPage = page.locator('.notion-page').first()
    expect(await css(notionPage, 'max-width')).toBe('720px')
  })

  test('.notion-full-page padding-bottom: 30vh', async ({ page }) => {
    const fullPage = page.locator('.notion-full-page').first()
    if (await fullPage.count() > 0) {
      const pb = await css(fullPage, 'padding-bottom')
      // 30vh는 뷰포트에 따라 다르므로 0이 아닌지만 확인
      expect(parseFloat(pb)).toBeGreaterThan(0)
    }
  })
})

// ============================================
// 페이지 제목
// ============================================
test.describe('페이지 제목', () => {
  test('font-size: 40px, font-weight: 700', async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
    const title = page.locator('.notion-title').first()
    expect(await css(title, 'font-size')).toBe('40px')
    expect(await css(title, 'font-weight')).toBe('700')
    expect(await css(title, 'line-height')).toBe('48px') // 40 * 1.2
  })
})

// ============================================
// 제목 블록 (H2, H3, H4)
// ============================================
test.describe('제목 블록', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
  })

  test('H2: font-size 1.875em, font-weight 600', async ({ page }) => {
    const h2 = page.locator('.notion-h2').first()
    if (await h2.count() > 0) {
      expect(await css(h2, 'font-size')).toBe('30px') // 16 * 1.875
      expect(await css(h2, 'font-weight')).toBe('600')
      expect(await css(h2, 'padding-top')).toBe('32px')
    }
  })

  test('H3: font-size 1.5em, font-weight 600', async ({ page }) => {
    const h3 = page.locator('.notion-h3').first()
    if (await h3.count() > 0) {
      expect(await css(h3, 'font-size')).toBe('24px') // 16 * 1.5
      expect(await css(h3, 'font-weight')).toBe('600')
      expect(await css(h3, 'padding-top')).toBe('28px')
    }
  })

  test('H4: font-size 1.25em, font-weight 600', async ({ page }) => {
    const h4 = page.locator('.notion-h4').first()
    if (await h4.count() > 0) {
      expect(await css(h4, 'font-size')).toBe('20px') // 16 * 1.25
      expect(await css(h4, 'font-weight')).toBe('600')
      expect(await css(h4, 'padding-top')).toBe('22px')
    }
  })
})

// ============================================
// 텍스트 블록
// ============================================
test.describe('텍스트 블록', () => {
  test('padding: 8px', async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
    const text = page.locator('.notion-text').first()
    if (await text.count() > 0) {
      expect(await css(text, 'padding')).toBe('8px')
    }
  })
})

// ============================================
// 코드 블록
// ============================================
test.describe('코드 블록', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
  })

  test('border-radius: 18px, padding: 36px 22px', async ({ page }) => {
    const code = page.locator('.notion-code').first()
    if (await code.count() > 0) {
      expect(await css(code, 'border-radius')).toBe('18px')
      expect(await css(code, 'padding-top')).toBe('36px')
      expect(await css(code, 'padding-left')).toBe('22px')
    }
  })

  test('코드 텍스트는 monospace, font-size 85%', async ({ page }) => {
    const codeText = page.locator('.notion-code-text').first()
    if (await codeText.count() > 0) {
      const fontFamily = await css(codeText, 'font-family')
      expect(fontFamily).toMatch(/SFMono|Menlo|Consolas|monospace/i)
      // 85% of 16px = 13.6px
      const fontSize = parseFloat(await css(codeText, 'font-size'))
      expect(fontSize).toBeCloseTo(13.6, 0)
    }
  })
})

// ============================================
// 인라인 서식
// ============================================
test.describe('인라인 서식', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
  })

  test('인라인 코드: 빨간 텍스트, 배경, border-radius 4px', async ({ page }) => {
    const inlineCode = page.locator('.notion-inline-code').first()
    if (await inlineCode.count() > 0) {
      expect(await css(inlineCode, 'border-radius')).toBe('4px')
      const color = await css(inlineCode, 'color')
      // #eb5757 = rgb(235, 87, 87)
      expect(color).toBe('rgb(235, 87, 87)')
    }
  })

  test('링크: 밑줄 + opacity 0.7', async ({ page }) => {
    const linkSpan = page.locator('.notion-link > span').first()
    if (await linkSpan.count() > 0) {
      const decoration = await css(linkSpan, 'text-decoration-line')
      expect(decoration).toContain('underline')
      expect(await css(linkSpan, 'opacity')).toBe('0.7')
    }
  })
})

// ============================================
// 불릿 리스트
// ============================================
test.describe('불릿 리스트 레이아웃', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
  })

  test('리스트 아이템: flex 레이아웃, padding 1px 6px 1px 8px', async ({ page }) => {
    const item = page.locator('.notion-list-disc').first()
    if (await item.count() > 0) {
      expect(await css(item, 'display')).toBe('flex')
      expect(await css(item, 'padding-left')).toBe('8px')
      expect(await css(item, 'padding-right')).toBe('6px')
    }
  })

  test('마커: width 24px, height 28px, font-size 1.5em', async ({ page }) => {
    const marker = page.locator('.notion-list-disc > .notion-list-item-marker').first()
    if (await marker.count() > 0) {
      expect(await css(marker, 'width')).toBe('24px')
      expect(await css(marker, 'height')).toBe('28px')
      expect(await css(marker, 'font-size')).toBe('24px') // 1.5em of 16px
    }
  })

  test('콘텐츠: flex: 1 1 0px, padding-left 6px', async ({ page }) => {
    const content = page.locator('.notion-list-disc > .notion-list-item-content').first()
    if (await content.count() > 0) {
      expect(await css(content, 'flex-grow')).toBe('1')
      expect(await css(content, 'padding-left')).toBe('6px')
    }
  })

  test('중첩 아이템: padding-top 2px, padding-bottom 0px', async ({ page }) => {
    const nested = page.locator(
      '.notion-list-item > .notion-list-item-content > .notion-list-disc'
    ).first()
    if (await nested.count() > 0) {
      expect(await css(nested, 'padding-top')).toBe('2px')
      expect(await css(nested, 'padding-bottom')).toBe('0px')
    }
  })
})

// ============================================
// 번호 리스트
// ============================================
test.describe('번호 리스트 레이아웃', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/${NUMBERED_LIST_POST_ID}`)
  })

  test('번호 마커 font-size: 1em (본문 크기)', async ({ page }) => {
    const marker = page.locator('.notion-list-numbered > .notion-list-item-marker').first()
    if (await marker.count() > 0) {
      expect(await css(marker, 'font-size')).toBe('16px') // 1em of 16px
    }
  })

  test('중첩 마커 사이클: 1. → a. → i.', async ({ page }) => {
    // Level 0: 숫자
    const top = page.locator(
      ':not(.notion-list-item-content) > .notion-list-numbered > .notion-list-item-marker'
    ).first()
    if (await top.count() > 0) {
      const text = await top.textContent()
      expect(text).toMatch(/^\d+\.$/)
    }

    // Level 1: 알파벳
    const nested1 = page.locator(
      '.notion-list-numbered .notion-list-item-content > .notion-list-numbered > .notion-list-item-marker'
    ).first()
    if (await nested1.count() > 0) {
      const text = await nested1.textContent()
      expect(text).toMatch(/^[a-z]+\.$/)
    }

    // Level 2: 로마 숫자
    const nested2 = page.locator(
      '.notion-list-numbered .notion-list-item-content > .notion-list-numbered .notion-list-item-content > .notion-list-numbered > .notion-list-item-marker'
    ).first()
    if (await nested2.count() > 0) {
      const text = await nested2.textContent()
      expect(text).toMatch(/^[ivxlcdm]+\.$/)
    }
  })
})

// ============================================
// 인용문
// ============================================
test.describe('인용문', () => {
  test('border-left 3px solid, padding 8px 0 8px 16px', async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
    const quote = page.locator('.notion-quote').first()
    if (await quote.count() > 0) {
      const borderLeft = await css(quote, 'border-left-width')
      expect(borderLeft).toBe('3px')
      expect(await css(quote, 'border-left-style')).toBe('solid')
      expect(await css(quote, 'padding-left')).toBe('16px')
    }
  })
})

// ============================================
// 콜아웃
// ============================================
test.describe('콜아웃 레이아웃', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
  })

  test('border-radius: 10px, padding: 12px', async ({ page }) => {
    const callout = page.locator('.notion-callout').first()
    if (await callout.count() > 0) {
      expect(await css(callout, 'border-radius')).toBe('10px')
      expect(await css(callout, 'padding')).toBe('12px')
    }
  })

  test('아이콘: 24x24px', async ({ page }) => {
    const icon = page.locator('.notion-callout-icon').first()
    if (await icon.count() > 0) {
      expect(await css(icon, 'width')).toBe('24px')
      expect(await css(icon, 'height')).toBe('24px')
    }
  })

  test('콜아웃 텍스트: margin-left 8px', async ({ page }) => {
    const text = page.locator('.notion-callout-text').first()
    if (await text.count() > 0) {
      expect(await css(text, 'margin-left')).toBe('8px')
    }
  })
})

// ============================================
// 구분선
// ============================================
test.describe('구분선', () => {
  test('height: 13px, 선이 표시된다', async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
    const hr = page.locator('.notion-hr').first()
    if (await hr.count() > 0) {
      expect(await css(hr, 'height')).toBe('13px')
      expect(await css(hr, 'border-top-style')).toBe('none')
    }
  })
})

// ============================================
// 이미지 블록
// ============================================
test.describe('이미지 블록 레이아웃', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
  })

  test('wrapper: margin-top/bottom 0, padding 8px', async ({ page }) => {
    const wrapper = page.locator('.notion-asset-wrapper-image').first()
    if (await wrapper.count() > 0) {
      // margin-left/right는 정렬에 따라 auto(계산값)일 수 있으므로 top/bottom만 확인
      expect(await css(wrapper, 'margin-top')).toBe('0px')
      expect(await css(wrapper, 'margin-bottom')).toBe('0px')
      expect(await css(wrapper, 'padding')).toBe('8px')
    }
  })

  test('이미지: border-radius 2px, width 100%', async ({ page }) => {
    const img = page.locator('.notion-asset-wrapper-image img').first()
    if (await img.count() > 0) {
      expect(await css(img, 'border-radius')).toBe('2px')
      expect(await css(img, 'width')).not.toBe('0px')
    }
  })

  test('캡션: font-size 14px, line-height 1.4', async ({ page }) => {
    const caption = page.locator('.notion-asset-wrapper-image .notion-asset-caption').first()
    if (await caption.count() > 0) {
      expect(await css(caption, 'font-size')).toBe('14px')
      const lh = parseFloat(await css(caption, 'line-height'))
      expect(lh).toBeCloseTo(19.6, 0) // 14 * 1.4
    }
  })

  test('제약 너비 이미지: block_width - padding 적용', async ({ page }) => {
    // 너비가 제한된 이미지 (inline width가 있는)
    const wrapper = page.locator('.notion-asset-wrapper-image[style*="width"]').first()
    if (await wrapper.count() > 0) {
      const wrapperWidth = parseFloat(await css(wrapper, 'width'))
      const img = wrapper.locator('img').first()
      const imgWidth = parseFloat(await css(img, 'width'))
      // 이미지 너비 = wrapper 너비 - padding 16px (box-sizing: border-box)
      expect(imgWidth).toBeLessThan(wrapperWidth)
      expect(imgWidth).toBeCloseTo(wrapperWidth - 16, 1)
    }
  })
})

// ============================================
// 컬럼 레이아웃
// ============================================
test.describe('컬럼 레이아웃', () => {
  test('gap: 46px', async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
    const row = page.locator('.notion-row').first()
    if (await row.count() > 0) {
      expect(await css(row, 'display')).toBe('flex')
      expect(await css(row, 'column-gap')).toBe('46px')
    }
  })
})

// ============================================
// 북마크
// ============================================
test.describe('북마크', () => {
  test('border-radius: 4px, border 1px', async ({ page }) => {
    await page.goto(`/post/${TEST_POST_ID}`)
    const bookmark = page.locator('.notion-bookmark').first()
    if (await bookmark.count() > 0) {
      expect(await css(bookmark, 'border-radius')).toBe('4px')
      expect(await css(bookmark, 'border-style')).toContain('solid')
      expect(await css(bookmark, 'display')).toBe('flex')
    }
  })
})

// 다크/라이트 모드 색상 검증은 blog.spec.ts에서 수행
