---
layout: post
title: "[iOS] AppDelegate의 역할"
header-style: text
sitemap:
  changefreq: daily
  priority: 1.0
tags:
  - Swift
---

## AppDelegate

App(앱) + Delegate(위임하다) → “앱에 주요한 동작을 관리한다.” 라고 뜻을 통해 해석해볼 수 있는데요.

공식문서에 따르면<sup>[[1]](#ref1)</sup>, `UIApplication`과 함께 작동하여 시스템과의 상호 작용을 관리하며, UIApplication 객체와 마찬가지로 `UIKit`은 app delegate 객체를 `app cycle`초기에 생성합니다.

그리고 AppDelegate 객체로 다음의 작업을 처리합니다.

- 앱의 주요 데이터 구조 초기화
- 앱의 scene 구성
- 메모리 부족 경고나 다운로드 완료 알림 등 외부에서 발생한 알림에 대한 대응
- 앱의 scene, view, view controller에 상관없이 앱 자체를 대상으로 이벤트에 대응
- Apple Push Notification 등 앱을 실행했을 때 필요한 서비스를 등록하는 것

## Methods

### 앱 초기화

- application(\_:willFinishLaunchingWithOptions:)

  - 앱이 구동되어 필요한 초기 실행 과정이 완료되기 직전에 호출되는 메소드
  - 메소드가 불려질 때는 `Inactive` 상태

- application(\_:didFinishLaunchingWithOptions:)
  - 앱이 사용자에게 화면으로 표시되기 직전에 호출되는 메소드
  - 해당 메소드가 반환된 후 어느 시점에서 앱을 `foreground` 또는 `background` 상태로 전환

### 앱 Life-Cycle 이벤트 응답

- applicationDidBecomeActive(\_:)
  - iOS13 이상인 경우 `sceneDidBecomeActive(_:)` 를 호출해야함<sup>[[2]](#ref2)</sup>
  - 앱이 foreground로 실행중일 때 호출되는 메소드
  - 앱이 `Inactive` 상태에서 `active` 상태로 전환됨을 알림
  - 앱이 비활성화된 동안 일시중지된(or 아직 시작하지 않은) 작업을 다시 시작할 경우, 또는 이전에 앱이 `background`에 있어서 `UI`를 새로 고칠 필요가 있는 경우 이 메소드 내부에 코드를 작성
  - ex) 타이머나 스톱워치를 재시작할 때
- applicationDidEnterBackground(\_:)
  - iOS13 이상인 경우 `sceneDidEnterBackground(_:)`를 호출해야함<sup>[[3]](#ref3)</sup>
  - 앱이 백그라운드에 진입했을 때 호출되는 메소드
  - `Scene-Based Life-Cycle`<sup>[[4]](#ref4)</sup>에 따라 `Suspended`될 수 있기에 잃어서는 안 될 사용자 데이터를 종료 전에 미리 저장하거나, 공유 자원을 점유하고 있었다면 해제해 주는 작업을 이 메소드 내에서 작업해주어야 함
- applicationWillTerminate(\_:)
  - 앱이 종료되기 직전에 호출되는 메소드

## 정리

AppDelegate 객체는 UIApplication 객체와 함께 앱이 처음 만들어질 때 생성되고, 앱 전체의 생명 주기를 함께 한다.

## 논외

위에서 설명하지는 않았지만, iOS 13버전 이후 AppDelegate의 역할을 SceneDelegate가 일부 나눠 가져감으로써 일부 실행되지 않는 메소드도 존재합니다. 이는 레퍼런스를 참고하여 공식문서를 읽어보시는 것을 추천드리며, 두 Delegate의 역할을 자세하게 설명해주신 블로거님<sup>[[5]](#ref5)</sup>의 글도 한 번 읽어보시는 것을 권장드립니다.

## References

1. <a id="ref1">[protocol UIApplicationDelegate](https://developer.apple.com/documentation/uikit/uiapplicationdelegate)</a>

2. <a id="ref2">[applicationDidBecomeActive(\_:)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622956-applicationdidbecomeactive)</a>

3. <a id="ref3">[applicationDidEnterBackground(\_:)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622997-applicationdidenterbackground/#Discussion)</a>

4. <a id="ref4">[Managing Your App's Life Cycle](https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle)</a>

5. <a id="ref4">[[iOS] AppDelegate와 SceneDelegate - Lena](https://lena-chamna.netlify.app/post/appdelegate_and_scenedelegate/#iOS13부터-AppDelegate가-하는-일)</a>
