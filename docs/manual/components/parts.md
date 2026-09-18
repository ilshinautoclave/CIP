# 4.1 주요 구성품

<figure>
  <img src="/images/equipment-internal.jpg" alt="W.I.P 내부 구성" />
  <figcaption>[ Warm Isostatic Press 내부 구성 ]</figcaption>
</figure>

## 구성품 일람

| 구분 | 명칭 | 기능 |
| --- | --- | --- |
| 1 | **Pressure Vessel (Body)** | 시료를 가압하는 압력용기 본체 |
| 2 | **Pressure Vessel (Cover)** | 압력용기 상부 밀폐 커버 |
| 3 | **Cover Stopper** | 커버 상승 위치 고정 |
| 4 | **Air Cylinder for Cover UP/DOWN** | 커버 승강 구동 (2 ea) |
| 5 | **Air Cylinder for Pin IN/OUT** | 안전핀 수평 이동 구동 (1 ea) |
| 6 | **Water Tank (Feed & Receiver)** | 압력 매체(순수) 공급·회수 탱크 |
| 7 | **Filter Ass'y** | 압력 매체 이물질 여과 |
| 8 | **High Pressure Pump** | 공압 구동식 증압 펌프 (1400 : 1) |
| 9 | **Check Valve** | 가압수 역류 방지 |
| 10 | **Silicon Heater** | 베셀 가열 (히터 탑재형만) |
| 11 | **Rupture Disc** | 과압 시 파열되어 압력 방출 |
| 12 | **Pressure Transducer** | 베셀 압력 측정 |
| 13 | **Solenoid Valve for Pump ON/OFF** | 펌프 구동 에어 개폐 |
| 14 | **Speed Control Valve** | 커버 승강 속도 조절 |

## 밸브 & 게이지 랙

| 명칭 | 기능 |
| --- | --- |
| **Release Valve** | 감압 시 수동으로 서서히 개방 |
| **Air Vent Valve (Shut off valve)** | 베셀 내 잔류 에어 배출 |
| **Air Control Valve (V-1)** | 펌프 구동 에어 유량 = 가압 속도 조절 |
| **Air Regulator** | 공급 에어 압력 조정 |
| **Pressure Gauge** | 베셀 압력 아날로그 표시 |
| **Ball Valve (15A)** | 탱크·드레인 라인 개폐 |

## 센서 및 인터록

| 센서 | 위치 | 역할 |
| --- | --- | --- |
| Cover Down 감지 센서 | 커버 실린더 측면 | 커버 완전 하강 확인 → 핀 동작 허용 |
| Cover Up 감지 센서 | 커버 실린더 상부 | 커버 완전 상승 확인 |
| Pin In Limit Switch | 핀 실린더 | 핀 삽입 완료 → 가압 허용 |
| Pin Out Limit Switch | 핀 실린더 | 핀 인출 완료 → 커버 동작 허용 |

::: warning 인터록
각 실린더 끝단에는 제어 및 위치를 감지하기 위해 센서가 장착되어 있으며, **이 센서들은 서로 연동(Interlock)** 되어 Cover 및 Pin이 제어됩니다.

**커버 하강 + 핀 삽입이 모두 감지되지 않으면 가압 펌프는 작동하지 않습니다.**
:::

상세 인터록 조건은 [기술 문서 › 인터록 조건](/technical/interlock)을 참조하십시오.
