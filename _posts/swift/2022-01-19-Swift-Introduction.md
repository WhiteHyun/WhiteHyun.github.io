---
layout: post
title: "[Swift] 기초 문법 정리 - 개요"
header-style: text
sitemap:
  changefreq: daily
  priority: 1.0
tags:
  - Swift
---

## Swift란?

- Swift는 Apple에서 만든 프로그래밍 언어이며, WWDC 2014에서 처음으로 세상에 공개되었다.

  > 당시 Swift는 빠르고(Fast), 현대적이고(Modern), 안전(Safe)을 위해 설계되었으며, 한 번도 본 적 없는 수준의 상호 작용(Interactive) 및 개발을 가능하게 한다고 소개하였으나, 이후 Safe(안정성), Fast(신속성), Expressive(표현성)으로 바뀌었다.

- 기존에 사용되던 Objective-C<sup>[[1]](#ref1)</sup>와 함께 사용할 목적으로 만들어졌기 때문에 LLVM<sup>[[2]](#ref2)</sup>으로 빌드되고 같은 런타임을 공유한다.

- Objective-C 보다 직관적이고, 보다 깔끔하게 작성할 수 있다.<sup>[[3]](#ref2)</sup>

  ```objective-c
  // 기존 objective-C 코드
  if (myDelegate != nil) {
      if ([myDelegate respondsToSelector:
          @selector(scrollViewDidScroll:)]) {
              [myDelegate scrollViewDidScroll:myScrollView];
      }
  }
  ```

  ```swift
  // Swift 코드
  myDelegate?.scrollViewDidScroll?(myScrollView)
  ```

- Android에서 사용하는 Kotlin언어와 비슷한 컨셉을 가진 언어이다.

## Reference

1. 오브젝티브-C(영어: Objective-C)는 C 프로그래밍 언어에 스몰토크 스타일의 메시지 구문을 추가한 객체 지향 언어이다. <a id="ref1">[Objective-C - 위키피디아](https://ko.wikipedia.org/wiki/오브젝티브-C)</a>

2. LLVM(Low Level Virtual Machine)은 컴파일러의 기반구조이다. 프로그램을 컴파일 타임, 링크 타임, 런타임 상황에서 프로그램의 작성 언어에 상관없이 최적화를 쉽게 구현할 수 있도록 구성되어 있다. <a id="ref2">[LLVM - 위키피디아](https://ko.wikipedia.org/wiki/LLVM)</a>

3. Apple WWDC 2014에서 Swift를 공개할 때 비교했던 코드이다. 자세한 영상은 <a id="ref3">[링크를 참조](https://youtu.be/MO7Ta0DvEWA)</a>
