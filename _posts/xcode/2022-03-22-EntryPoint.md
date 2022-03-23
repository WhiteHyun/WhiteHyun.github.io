---
layout: post
title: "[iOS] 앱의 시작점(Entry Point)은 어디일까?"
header-style: text
sitemap:
  changefreq: daily
  priority: 1.0
tags:
  - Swift
---

## Entry Point란?

시작 진입점이라고 불리우는 이 놈은 프로그램 실행의 시작점을 의미합니다.

프로그램을 다루는 모든 언어들은 전부 엔트리 포인트를 갖고 있습니다. C나 Java 같은 언어들은 `main`이라는 함수를 사용하며
Python은 시작하는 파일이 엔트리 포인트로 지정됩니다. (내장 변수: "\_\_main\_\_")

하지만 iOS 앱 개발을 진행하기 위해 프로젝트를 만들게 되면 main.swift는 존재하지 않습니다. 그런데도 실행을 하면 아주 잘 동작되는 것을 볼 수 있습니다. 그렇다면, iOS 프로젝트에서 Entry Point는 대체 어디일까요?
![normal](/img/in-post/iOS/EntryPoint/normal.png){: .align-center width="70%" height="70%"}

## iOS Entry Point

Objective-C로 이루어진 프로젝트를 먼저 살펴보자면, Objective-C는 C언어를 기반으로 하고 있습니다. 따라서 objective-C로 이루어진 iOS 앱은 main 함수부터 실행될 것이라 예측할 수 있는데, Objective-C로 프로젝트를 만들면 `main.m`이 자동으로 생성돼 있는 것을 볼 수 있습니다.

![main-objective-c](/img/in-post/iOS/EntryPoint/main-objective-c.png){: .align-center}

여기서 main함수의 역할은 실행 시 시스템으로부터 받은 두 개의 인자값과 AppDelegate 클래스를 이용하여 UIApplicationMain() 함수를 호출합니다. 그리고 UIApplication 객체를 생성하게 됩니다.

> UIApplication 객체는 앱 그 자체라고 봐도 무방합니다. UIApplication에 대한 설명은 Apple 공식문서를 참조하거나<sup>[[1]](#ref1)</sup> 추후에 글을 작성하도록 하곘습니다.

Swift는 C언어 기반으로 구성된 언어가 아닙니다. 따라서 main.m 파일은 존재하지 않으며 엔트리 포인트 또한 존재하지 않습니다. 하지만 objective-C 프로젝트에서 보았듯, main함수에서 AppDelegate클래스를 이용하여 UIApplication 객체를 생성하였었습니다. 따라서 Swift 프로젝트 또한 관련 파일 내에 무언가의 장치를 마련했을 거라 생각할 수 있습니다.

실제로 swift 프로젝트를 열고 `AppDelegate.swift`를 보면 AppDelegate 클래스 위에 `@main`이라는 어노테이션을 표기하고있는 걸 알 수 있습니다. 이는 **AppDelegate 클래스 내 main함수를 EntryPoint로 지정한다는 의미입니다**.

![main-swift](/img/in-post/iOS/EntryPoint/main-swift.png){: .align-center}

### AppDelegate에 main 함수가 없다?

정확하게 말하자면, AppDelegate 클래스는 UIApplicationDelegate를 위임받았기 때문에 main함수를 구현할 필요가 없습니다. 그래서 UIApplicationDelegate를 지우면 main함수를 구현하라는 에러문구가 나타나게 됩니다.

![main-error](/img/in-post/iOS/EntryPoint/main-error.png){: .align-center}

즉 `UIApplicationDelegate` 내에는 main함수가 내장되어있고, 해당 함수는 UIKit 앱의 Entry Point로 사용할 수 있도록 합니다.<sup>[[2]](#ref2)</sup> 그리고 시스템은 main() 메서드를 호출, AppDelegate 클래스에서 작성한 커스텀 코드를 델리게이트로 지정하여 앱을 실행하게 됩니다.

<!-- ### Entry Point를 바꿔보자 -->
<!-- TODO: Entry Point 사용자 지정 설정 -->

## 결론

swift 프로젝트 내에서는 자동으로 **@main**을 갖고 있는 `AppDelegate` 클래스를 Entry Point로 잡습니다. 그리고 나서 수행하는 과정은 아래 그림과 같이 일련의 과정을 가집니다.
![app life-cycle](http://pds20.egloos.com/pds/201010/14/13/a0005913_4cb6651387c28.jpg){: .align-center}

앱의 생명주기, AppDelegate에 관한 내용은 다음 글에서 자세하게 다룰 예정이기 때문에 지금은 엔트리 포인트 개념에 대해서만 짚고 넘어가시면 됩니다.

## References

1. <a id="ref1">[UIApplicationMain(_:_:_:_:) | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/1622933-uiapplicationmain)</a>
2. <a id="ref2">[main() | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/3656306-main)</a>
