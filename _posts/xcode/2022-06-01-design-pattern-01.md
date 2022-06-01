---
layout: post
title: "[iOS] 디자인 패턴 개요"
sitemap:
  changefreq: daily
  priority: 1.0
tags:
  - design pattern
---

저는 대학생 시절 교수님에게서 디자인 패턴이라는 개념을 한 번도 듣지 못했습니다. 유튜브나 다양한 곳에서는 이따금씩 보이기는 했었습니다만 그렇게 중요하다고는 생각하지 못했어요.

하지만 iOS의 길을 걷고나서부터 귀가 따갑도록 듣게 되었습니다. 막상 보면 이게 왜 필요할까 싶었지만, 최근에 공부 및 개발을 하다보면서 디자인 패턴에 대한 필요성을 줄곧 느끼게 되었습니다. 앞으로도 자주 사용할 개념이기에 개념을 확실하게 정립하기 위해 글을 적어보도록 하겠습니다.

## 디자인 패턴이란 뭔데?

디자인 패턴이란, 보다 나은 방향으로 코드를 구조화시키는 패턴을 뜻합니다. 쉽게 설명하자면, 여러 문제를 해결하기위한 대책법이라고 볼 수 있겠네요. 그렇다면 여러 문제라는 건 무엇일까요? 바로 코드의 복잡성으로부터 시작됩니다.

예를 들어, 우리가 야간모드를 구현한다고 칩시다. dark mode로 세팅되었다면 다른 뷰 컨트롤러로 넘어갈 때도 유지되어야 합니다. 즉, 어느 뷰 컨트롤러이든 이 모드에 대한 세팅은 반드시 같은 것을 사용해야 합니다. 이 인스턴스가 하나로만 만들어져야 한다는 뜻이겠죠.

그러기 위해서는 싱글톤 패턴을 사용하여 해결할 수 있습니다.

```swift
class Appearence {

  static let shared = Appearence()

  private var `switch` = false
  var isDark: Bool {
    return `switch`
  }

  private init() { }

  func switchAppearence() {
    self.`switch`.toggle()
  }
}
```

위 코드에서는 직접적으로 인스턴스를 생성하지는 못하지만, 타입 프로퍼티인 `shared`로 **공유된 인스턴스**를 가져올 수 있습니다. 그리고 switchAppearence 메소드를통해 모드 설정을 할 수 있고, isDark라는 연산 프로퍼티로 현재의 모드 상태를 가져올 수 있습니다.

```swift
import UIKit

class FirstViewController: UIViewController {


  override func viewDidLoad() {
    super.viewDidLoad()

    print(Appearence.shared.isDark) // false

    Appearence.shared.switchAppearence()
  }
}

// ... more codes

class SecondViewController: UIViewController {


  override func viewDidLoad() {
    super.viewDidLoad()

    print(Appearence.shared.isDark) // true
  }
}
```

따라서 FirstViewController에서 세팅한 모드를 SecondViewController에서 확인했을 때 공유된 메모리이기 때문에 바뀐 값으로 출력됩니다.

이렇듯, 여러 메모리를 공유해야하는 상황이 생기는 등 여러 이슈가 발생했을 때 싱글톤 패턴을 사용하여 코드를 분명하고 간결하게 구성할 수 있습니다. 하지만, 여러 스레드에서 참조가 가능하기 때문에 `thread-safe`하지 않아 Anti-Pattern으로도 알려져있습니다. 따라서 여러 상황을 고려해보고 과연 이 패턴을 적용시키는 게 맞는지 고민해볼 필요가 있습니다.

예시로 든 싱글톤패턴 뿐 아니라 이미 여러 디자인 패턴이 만들어져 있고 우리는 그걸 알게모르게 사용하고 있습니다. 이미 iOS 개발할 때 사용되는 MVC패턴이 하나의 예시가 되겠네요.

이렇듯 디자인 패턴에 대해 잘 공부하기만 한다면, 자신의 코드를 보다 더 우아하게 만들 수 있으므로 자신이 필요한 개념에 대한 디자인 패턴을 공부하시는 것을 추천드립니다.
