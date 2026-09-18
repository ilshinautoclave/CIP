# 4.3 제어반 구성

<figure>
  <img src="/images/control-panel.jpg" alt="W.I.P Process Controller" />
  <figcaption>[ W.I.P Process Controller 전면 ]</figcaption>
</figure>

## 전면 구성

| 구성품 | 기능 |
| --- | --- |
| **터치 HMI / 지시계** | 압력·온도 표시, 설정, 그래프, 알람 확인 |
| **POWER (OFF / ON)** | 제어 전원 인가 |
| **BUZZER** | 알람 부저 확인·정지 |
| **E.M.O STOP** | 비상 정지 |
| **PRESSURE GAUGE** | 베셀 압력 아날로그 표시 |
| **RELEASE** | 감압 수동 밸브 |
| **AIR REGULATOR** | 공급 에어 압력 조정 |

::: danger E.M.O STOP
비상 정지 버튼을 누르면 펌프 구동 에어가 차단됩니다.
**단, 베셀 내부의 압력은 그대로 유지됩니다.** 비상 정지 후에도 반드시 Release valve로 감압한 뒤 커버·핀을 조작하십시오.
:::

## 제어 방식 (사양 타입별)

| 타입 | 방식 | 특징 |
| --- | --- | --- |
| **A형** | 터치 HMI 방식 | 화면에서 가압·핀·커버·히터 조작, STEP 패턴 저장 |
| **B형** | 버튼/스위치 방식 | 양수(Two-handed) 버튼으로 커버 조작, 지시계로 압력 설정 |

상세 비교 → [부록 A. 사양 타입 비교](../appendix/model-comparison)

### 버튼/스위치 방식(B형)의 양수 버튼

::: warning 안전
안전을 위하여 **Cover Down / Up 은 양수 버튼(Two Handed)** 을 적용합니다.
**Cover-1, Cover-2 스위치가 동시에 동작되어야** Down 또는 Up 동작이 이루어집니다.
:::

## 램프 표시

| 램프 | 점등 조건 |
| --- | --- |
| Cover Down Lamp | 커버가 완전히 하강하여 센서에 감지됨 |
| Cover Up Lamp | 커버가 완전히 상승하여 센서에 감지됨 |
| Pin In Lamp | 핀이 완전히 삽입되어 센서에 감지됨 |
| Pin Out Lamp | 핀이 완전히 인출되어 센서에 감지됨 |
| Pump On Lamp | 가압 펌프 구동 중 |
| Pump Off Lamp | 가압 펌프 정지 |

터치 HMI 화면의 상세 설명은 [6. HMI 화면](../hmi/main-screen)을 참조하십시오.
