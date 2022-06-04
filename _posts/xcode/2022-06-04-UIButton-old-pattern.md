---
layout: post
title: "[iOS] UIButton의 old pattern을 제거해보자"
sitemap:
  changefreq: daily
  priority: 1.0
tags:
  - iOS
---

대부분 Swift 프로그래머는 UIButton에 Action을 넣을 때 다음의 식을 적용하며 실제로 저도 자주 사용하는 패턴입니다.

```swift
let button = UIButton()

// Some Codes...

button.addTarget(self, action: #selector(didTapButton), for: .touchUpInside)
```

하지만 iOS 14 이후로 UIButton은 UIAction이라는 클로저 기반 API를 갖고 있어서 간단한 작업을 요할 때 클로저로 간단히 구현해줄 수 있습니다.

```swift
let button = UIButton()

button.addAction(UIAction { [weak self] _ in
  print("Did tap button")
}, for: .touchUpInside)
```
