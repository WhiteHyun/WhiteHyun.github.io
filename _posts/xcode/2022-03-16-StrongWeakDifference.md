---
layout: post
title: "[iOS] Strong과 Weak의 차이점"
header-style: text
sitemap:
  changefreq: daily
  priority: 1.0
tags:
  - iOS
---

## Goal

> - Swift 문법 중 Strong과 Weak의 차이점을 이해한다.

## 소개

최근 Swift 공부를 진행하면서 Interface Builder에 붙여놓은 객체를 뷰 컨트롤러 클래스의 프로퍼티와 연결하는 과정에서 **Storage** 설정에 있는 **Strong**과 **Weak**이 정확하게 어떤 역할을 하는지 궁금해졌습니다.

![connection](/img/in-post/iOS/StrongWeak/connection.png){: .align-center}

<div align="center" style="color: gray;font-size: 12px">Outlet 어노테이션 객체에 대해 Connection할 때</div>
<!-- FIXME: 캡션을 넣는 법을 몰라서 이렇게 넣음 -->

변수를 strong과 weak으로 세팅하게 되면, weak은 키워드가 들어가지만 strong은 키워드 없이 선언되는 것을 볼 수 있습니다.
대체 어떤 효과를 지녔길래, 이렇게 두 가지 기능으로 분류해놓은걸까요?

![variables](/img/in-post/iOS/StrongWeak/variables.png){: .align-center}

## Strong과 Weak에 관해

결론부터 말하자면 weak타입으로 선언한 변수는 strong타입과 달리 **다른 곳에서 참조되고 있다 하더라도 메모리에서 제거될 수 있습니다.**
반대로 말하자면, strong타입은 다른 곳에서 참조되고있다면 메모리가 회수되지 않는다는 뜻입니다.

듣고보면 weak이 그다지 메리트가 없어보이는 녀석처럼 보입니다.
하지만 메모리 누수에 있어서 weak은 효과적인 키워드가 될 수 있습니다.

> 최근에 `iOS Academy`라는 해외유튜버분께서 [Memory Leak 영상을 제작하였습니다.](https://youtu.be/b2AgibUg47k)
> 아래 글은 영상에서 보여주는 코드를 차용하여 설명합니다. 영상의 전달력이 더 뛰어날 수 있으므로 영어가 되시는 분은 영상만 보셔도 무방합니다.

예를들어, 다음의 ViewController가 있다고 합시다.

```swift
import UIKit

// 루트 뷰컨트롤러
class ViewController: UIViewController {


    override func viewDidLoad() {
        super.viewDidLoad()
        // 버튼 설정
        let button = UIButton()
        button.setTitle("Go to other View", for: .normal)
        button.setTitleColor(.tintColor, for: .normal)
        button.frame = CGRect(x: 0, y: 0, width: 200, height: 50)
        button.center = view.center
        button.addTarget(self, action: #selector(didTapButton), for: .touchUpInside)

        // 뷰에 버튼을 추가
        view.addSubview(button)
    }
    // 버튼 클릭 이벤트
    @objc private func didTapButton() {
        let vc = SecondVC()
        present(vc, animated: true)
    }
}

class MyView: UIView {

    let vc: UIViewController
    init(vc: UIViewController) {
        self.vc = vc
        super.init(frame: .zero)
    }

    required init?(coder: NSCoder) {
        fatalError()
    }
}


class SecondVC: UIViewController {

    var myView: MyView?

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .red
        self.myView = MyView(vc: self)
    }
}
```

실행하게 되면 첫 화면에는 가운데에 버튼하나가 놓여져있을 거고, 누르게 된다면 두 번째 뷰 컨트롤러를 보여주게 될 것입니다.

![test](/img/in-post/iOS/StrongWeak/test-view.gif){: .align-center width="30%" height="30%"}

그리고 두 번째 뷰 컨트롤러는 MyView라는 프로퍼티를 가짐과 동시에, MyView는 SecondVC라는 프로퍼티를 가지고 초기화되기 때문에 **상호참조**되어있음을 알 수 있습니다.
그래서 버튼을 눌러 SecondVC를 present하고, dismiss하게되면 두 클래스는 메모리를 회수할 수 없게 된 채 사라지게 됩니다. 이러한 사이클을 유지한다면, **메모리 누수가 이어지게 되는 것입니다.**

> 메모리누수를 시각적으로 보일 수 있는데, 글에서는 언급하지 않습니다.  
> `iOS Academy`의 [Memory Leak 영상을 시청해주세요.](https://youtu.be/b2AgibUg47k)

### weak을 적절하게 사용하자

위 코드 중 MyView와 SecondVC를 가져와보겠습니다.

```swift
class MyView: UIView {

    let vc: UIViewController
    init(vc: UIViewController) {
        self.vc = vc
        super.init(frame: .zero)
    }

    required init?(coder: NSCoder) {
        fatalError()
    }
}


class SecondVC: UIViewController {

    var myView: MyView?

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .red
        self.myView = MyView(vc: self)
    }
}
```

두 클래스의 상호참조로 인해 메모리 누수가 발생하고있을 때에는 상호참조되는 변수 중 하나에 weak을 사용하면 됩니다.  
예를 들면, MyView에서 vc 변수를 weak으로 선언해주는 방법이 있겠네요.

> weak을 선언하게 되면 메모리가 회수될 수 있기 때문에 **옵셔널 형태로 정의해주어야합니다.** 실수하셨다더라도 컴파일러가 알아서 알려주니 걱정 안하셔도 됩니다.

```swift
class MyView: UIView {

    weak let vc: UIViewController? // weak으로 설정, 옵셔널 형태로 정의
    init(vc: UIViewController) {
        self.vc = vc
        super.init(frame: .zero)
    }
    // more codes...
}
```

이렇게 된다면 영원히 메모리에서 제거되지 않는 코드가 시스템에 의해 임의로 제거가 되어 상호 참조로부터 벗어날 수 있습니다.  
이렇듯, 상호참조가 일어날 경우를 대비하여 weak을 적절하게 사용해야겠습니다.
