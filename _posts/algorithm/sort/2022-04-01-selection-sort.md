---
layout: post
title: "[알고리즘] 선택 정렬 (Selection Sort)"
header-style: text
sitemap:
  changefreq: daily
  priority: 1.0
tags:
  - algorithm
  - sort
---

## 선택 정렬

선택 정렬은 버블 정렬과 유사하며 해당 순서에 요소를 넣을 위치는 정해져 있고, 어떤 요소를 넣을 지 선택하는 알고리즘이다. 아래 예시는 가장 작은 값부터 선택하여 앞 부분에 넣는 과정을 보인다.

![selection sort](/img/in-post/algorithm/sort/selection_sort.gif){: .align-center width="70%" height="70%"}

### 시간 복잡도

최선: O(n²)

평균: O(n²)

최악: O(n²)

### 공간 복잡도

O(n)

### 장점

비교적 간단한 정렬 알고리즘이기에 이해하기 쉽다.

교환하는 연산이 많지 않아 버블정렬보다 빠르다.

### 단점

버블 정렬과 같은 O(n²)이므로 비효율적이다.

### 과정

1. 첫 번째 요소부터 시작하여 값의 인덱스를 한 곳에 저장해 둔다.
2. 그 다음 요소부터 저장해둔 인덱스로 배열을 참조한 값과 비교하여 조건에 부합하면 인덱스를 갱신한다.
3. 배열을 다 돌고나서 시작한 곳의 위치와 저장한 인덱스를 참조하여 서로 값을 교환한다.
4. 시작한 곳에서 한 칸 뒤에 다시 1번을 수행하며, 배열의 끝에 다다르면 종료한다.

## 구현 (Swift)

```swift
func selectionSort(array: [Int]) -> [Int] {
  var sequence = array

  for i in 0..<sequence.count - 1 {
    var lowlest = i
    for j in i + 1..<sequence.count {
      if sequence[lowlest] > sequence[j] {
        lowlest = j
      }
    }
    sequence.swapAt(i, lowlest)
  }
  return sequence
}

print(selectionSort(array: [4, 3, 8, 9, 2, 7, 1, 5, 6]))
// Prints "[1, 2, 3, 4, 5, 6, 7, 8, 9]"
```
