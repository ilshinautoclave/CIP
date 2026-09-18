# 부록 A. 사양 타입 비교

동일 모델명이라도 **제어 방식과 전원 사양**이 호기별로 다릅니다.
본 매뉴얼은 아래 두 타입으로 구분하여 설명합니다. 운전 및 A/S 시 반드시 **장비 명판의 Serial No.** 를 확인하십시오.

| 구분 | **A형** | **B형** |
| --- | --- | --- |
| 제어 방식 | **터치 HMI** | **버튼/스위치 + 지시계** |
| 히터 | **탑재 (실리콘 히터)** | 없음 |

## 사양 비교

| 항목 | A형 | B형 |
| --- | --- | --- |
| Max. Working Condition | 600 MPa @ 85 ℃ | 600 MPa @ 85 ℃ |
| **전원 (예)** | **220 VAC, 3-phase, 8 kW** | **380 VAC, 3-phase, 3 kW** |
| Air | 0.6 ~ 0.9 MPa | 0.6 ~ 0.9 MPa |
| Pure Water | 0.77 Liter | 0.77 Liter |
| Pressure Vessel 재질 | SUS630 (ASTM A564) | SUS630 (ASTM A564) |
| Vessel 내부 치수 | 70 ID × 200 IL | 70 ID × 200 IL |
| **Water Tank 재질 (예)** | **SUS630** | **SUS304** |
| **Water Tank 치수 (예)** | **70 mm(I.D) × 250 mm(I.L)** | **70 mm(I.D) × 200 mm(I.L)** |
| Pump 압력비 | 1400 : 1 | 1400 : 1 |
| 운전 온도 범위 | 10 ℃ ~ 85 ℃ | 10 ℃ ~ 60 ℃ |

## 조작 방식 비교

| 항목 | A형 | B형 |
| --- | --- | --- |
| 전원 인가 | Key 스위치 ON | 전원 버튼 ON |
| 압력 설정 | HMI STEP 화면에서 입력·저장 | 지시계에서 MOD / ▲ / ▶ / ENT로 입력 |
| 영점 조정 | HMI SET 화면 › 영점조정 | 지시계에서 (ENT + ▶) |
| 커버 조작 | 화면의 **상승/하강** 버튼 | **Cover-1 + Cover-2 양수 버튼** |
| 핀 조작 | 화면의 **삽입/인출** 버튼 | Pin IN / OUT 스위치 |
| 가압 조작 | 화면의 **가압 ON/OFF** | Pump ON / OFF 스위치 |
| **히터** | **있음** | 없음 |
| STEP 패턴 저장 | 1 ~ 10 패턴, 각 10 STEP | 없음 (단일 High / Low) |
| 그래프 저장 | 있음 (주기 설정 가능) | 없음 |

## 가압 절차의 차이

| 단계 | A형 (터치 HMI) | B형 (버튼/지시계) |
| --- | --- | --- |
| 에어 빼기 | 펌프 가동 **약 5초 후** Release valve 잠금 | Release valve 먼저 잠금 → **FLUID INDICATOR**로 물 흐름 확인 → Air vent valve 잠금 |
| 목표 도달 | Pumping 정지 + **부저** | **High Alarm 점등** + Pumping 정지 |
| 가압 속도 조절 | V-1 (Air control valve) | V-1 (Air control valve) |

::: warning
두 타입은 **가압 시 에어 빼기 순서가 다릅니다.**
운전 전 해당 호기의 절차를 확인하십시오. → [5.5 가압](../operation/pressurizing)
:::

## 부록 자료 구성

납품 계약 내용에 따라 제공되는 부록 자료가 다를 수 있습니다.

| 부록 | 내용 |
| --- | --- |
| Pressure Test Report | 압력 시험 성적서 |
| Layout Drawing | 배치 도면 |
| Process Flow Diagram | 공정 흐름도 |
| Electric Drawing | 전기 도면 |
| Parts List | 부품 목록 |
| Catalogues | 구성품 카탈로그 |

::: info
사양 타입이 추가되면 이 표에 열을 추가해 관리하십시오.
:::
