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

시작 진입점, 즉 프로그램이 실행될 때의 첫 시작점을 의미합니다.

프로그램을 다루는 모든 언어들은 전부 **Entry Point**를 갖고 있습니다. C나 Java 같은 예전 언어들은 `main`이라는 함수명을 사용하였고 그 이후로 많은 언어들이 영향을 받아 main이라는 이름을 시작점으로 잡기 시작했습니다.

Swift도 Command Line Tool로 프로젝트를 생성하게 되면 main.swift가 자동으로 만들어져 프로그램의 시작점을 알 수 있습니다. 하지만 iOS 앱 개발을 진행하기 위해 프로젝트를 만들게 되면 main.swift는 존재하지 않습니다. 그런데도 실행을 하면 잘 동작되는 것을 볼 수 있는데, 과연 iOS 프로젝트에서 Entry Point는 대체 어디에 있을까요?

![normal](/img/in-post/iOS/EntryPoint/normal.png){: .align-center width="70%" height="70%"}

## iOS Entry Point

Objective-C로 이루어진 iOS 프로젝트를 먼저 살펴보자면, `main.m` 내부에 main함수가 자동으로 생성돼 있는 것을 볼 수 있습니다.

![main-objective-c](/img/in-post/iOS/EntryPoint/main-objective-c.png){: .align-center}

main함수를 들여다보면 굉장히 단순하게 생겼습니다. main의 파라미터 두 개와 AppDelegate 클래스를 가지고 UIApplicationMain<sup>[[1]](#ref1)</sup>을 실행하면서 나온 반환값을 리턴하며 프로그램이 종료되죠.

그렇다면 swift 프로젝트에서도 결국엔 iOS 프로젝트이기 때문에 UIApplicationMain을 실행하는 절차를 어딘가에 내포하고 있을 겁니다. 실제로 swift 프로젝트를 열고 `AppDelegate.swift`를 보면 AppDelegate 클래스 위에 `@main`이라는 어노테이션을 표기하고있고 `UIResponder`와 `UIApplicationDelegate`를 준수하고 있는 것을 볼 수 있습니다.

![main-swift](/img/in-post/iOS/EntryPoint/main-swift.png){: .align-center}

### @main

struct(구조체), class(클래스), enumeration(열거형)에 적용하여 프로그램의 top-level entry point를 명시적으로 나타내주는 어노테이션입니다. `@main`을 적용하려면 어떠한 인자(argument)도 받지 않고 Void를 반환하는 main이라는 이름의 정적 함수를 구현해야합니다.

```swift
@main
struct MyTopLevel {
  static func main() {
    // Top-level code goes here
  }
}
```

다른 방식으로 `@main`을 적용 시키고 싶다면, main함수가 구현되어있는 protocol을 준수하는 것 만으로 해결할 수 있습니다.

```swift
protocol ProvidesMain {
  static func main() throws
}
```

다시 Appdelegate.swift 파일을 보고 해석해봅시다.

Appdelegate 클래스 위에 main annotation이 있으므로 해당 클래스의 main함수를 **EntryPoint로 지정한다는 의미이며**, 보여지는 main 함수가 없기 때문에 사전에 구현되어있는 프로토콜을 Appdelegate 클래스가 준수하고 있는 것을 알 수 있습니다.

Appdelegate 클래스는 UIResponder라는 클래스를 상속받고, UIApplicationDelegate를 준수하고 있기 때문에 `UIApplicationDelegate` 내부에 main함수가 내장되어있음을 예상할 수 있으며, 해당 프로토콜은 UIKit 프레임워크에 속해있기 때문에 앱 제어권은 자연스레 UIKit 프레임워크로 이관되게 됩니다.<sup>[[2]](#ref2)</sup> 그렇게해서 시스템은 main() 메서드를 호출하고 AppDelegate 클래스에서 작성한 커스텀 코드를 델리게이트로 지정하여 앱을 실행하게 되기 때문에 정상적으로 잘 작동될 수 있었던 것입니다.

_<!-- ### Entry Point를 바꿔보자 -->_

_<!-- TODO: Entry Point 사용자 지정 설정 -->_

## 결론

`@main`에 해당하는 클래스나 구조체나 열거형의 main함수가 entry point로 잡힌다.

iOS 프로젝트의 경우 Appdelegate를 Entry point로 하여금 델리게이트로도 설정하여 앱을 구동한다.

## References

1. <a id="ref1">[UIApplicationMain(_:_:_:_:) | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/1622933-uiapplicationmain)</a>
2. <a id="ref2">[main() | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/3656306-main)</a>
