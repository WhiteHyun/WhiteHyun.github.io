---
layout: post
title: "[알고리즘] 삽입 정렬 (Insertion Sort)"
header-style: text
sitemap:
  changefreq: daily
  priority: 1.0
tags:
  - algorithm
  - sort
---

## 삽입 정렬

삽입 정렬은 필요한 요소만 비교하여 자신이 위치해야하는 곳까지 값을 바꾸어 이동하는 정렬 알고리즘이다.

![insertion sort](/img/in-post/algorithm/sort/insertion_sort.gif){: .align-center width="70%" height="70%"}

### 시간 복잡도

**최선: O(n)**

평균: O(n²)

최악: O(n²)

### 공간 복잡도

O(n)

### 장점

알고리즘이 단순하다.

필요한 데이터만 비교하기 때문에 전체를 비교하는 선택정렬보다 빠르다.

최선의 경우 시간 복잡도가 O(n)으로 정렬 알고리즘 중에 가장 빠르다.

### 단점

평균과 최악일 때 O(n²)이므로 비효율적이다.

### 과정

1. 두 번째 요소부터 시작하여 이전 값을 비교하고 자신의 값이 더 작다면 교환한다.
2. 비교하였을 때 자신의 값이 더 크다면 사이클을 종료하고, 시작했던 위치의 다음 인덱스에서 다시 시작한다.
3. 배열의 끝에 도달할 때까지 이를 반복한다.

## 구현 (Swift)

```swift
func insertionSort(array: [Int]) -> [Int] {
  var sequence = array
  for index in 1..<sequence.count {
    var currentIndex = index
    while currentIndex > 0 && sequence[currentIndex-1] > sequence[currentIndex] {
      sequence.swapAt(currentIndex - 1, currentIndex)
      currentIndex -= 1
    }
  }
  return sequence
}
```
