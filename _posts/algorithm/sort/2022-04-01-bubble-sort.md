---
layout: post
title: "[알고리즘] 버블 정렬 (Bubble Sort)"
header-style: text
sitemap:
  changefreq: daily
  priority: 1.0
tags:
  - algorithm
  - sort
---

## 버블 정렬

버블 정렬은 서로 인접한 두 요소를 비교하고, 큰 수가 앞에 있는 경우 자리를 바꿈으로써 정렬하는 알고리즘입니다. 인덱스를 증가시키면서 비교하고 바꾸는 작업을 반복하며, 정렬이 마치 거품이 올라오는 듯한 모습을 보인다고 해서 버블 정렬이라 불립니다.

![bubble sort](/img/in-post/algorithm/sort/bubble_sort.gif){: .align-center width="70%" height="70%"}

### 시간 복잡도

평균: O(n²)

최악: O(n²)

### 공간 복잡도

O(n)

### 장점

비교적 간단한 정렬 알고리즘이기에 입문할 때 좋다.

### 단점

간단한 만큼 데이터를 읽고 쓰는 과정이 잦아 매우 비효율적이다.

### 과정

1. 첫 요소와 두 번째 요소를 비교하여 조건에 맞으면 자리를 바꾼다.
2. 인덱스를 하나 증가시켜 두 번째 요소와 세 번째 요소를 비교하여 조건에 맞으면 자리를 바꾼다.
3. 계속 증가시키며 진행하다가 배열의 끝에 다다르면 마지막 요소는 배열에서 가장 큰 값이 되며, 첫 번째 루프가 종료된다.
4. 다시 처음부터 진행하되, 끝 인덱스에서 1씩 감소시킨 크기만큼만 진행한다.

## 구현 (Swift)

```swift
func bubbleSort(array: [Int]) -> [Int] {
  var sequence = array

  for i in 0..<sequence.count {
    for j in 1..<sequence.count - i {
      if sequence[j-1] > sequence[j] {
        let temp = sequence[j-1]
        sequence[j-1] = sequence[j]
        sequence[j] = temp
      }
    }
  }
  return sequence
}

print(bubbleSort(array: [4, 3, 8, 9, 2, 7, 1, 5, 6]))
// Prints "[1, 2, 3, 4, 5, 6, 7, 8, 9]"
```
