# 4.2 공정 흐름도 (P&ID)

## 공정 흐름 개요

<figure>
  <img src="/images/process-flow.jpg" alt="Process Flow Diagram" />
  <figcaption>[ Process Flow Diagram — 저압 Water / 고압 Water / Air 계통 ]</figcaption>
</figure>

| 계통 | 색상 | 경로 |
| --- | --- | --- |
| 저압 Water | 파랑 | Reservoir Tank → Ball Valve → Filter → Pump 흡입 |
| 고압 Water | 빨강 | Pump 토출 → Check Valve → Pressure Vessel |
| Air | 회색 | Air 공급 → Ball Valve → Air Regulator → Solenoid Valve → Pump 구동 |

## 흐름 순서

1. **충전** — Reservoir Tank의 순수가 Ball Valve와 Filter를 거쳐 펌프로 공급됩니다.
2. **에어 배출** — Air Vent Valve를 통해 베셀 내부 잔류 공기를 배출합니다.
3. **가압** — Air Driven Pump가 구동되어 Check Valve를 거쳐 베셀을 가압합니다.
4. **유지** — 압력이 Low 설정값 아래로 떨어지면 재가압(보상 가압)이 이루어집니다.
5. **감압** — Release Valve를 서서히 열어 고압수를 Reservoir Tank로 되돌립니다.

## P&ID 도면

<figure>
  <img src="/images/pid-diagram.png" alt="P&ID" />
  <figcaption>[ P&amp;ID — Warm Isostatic Press ]</figcaption>
</figure>

### 주요 기기 번호

| Tag | 명칭 | 사양 |
| --- | --- | --- |
| PUMP-1 | Air Driven Pump | 1400 : 1, Max. 600 MPa |
| CV-1 | Check Valve | 1/4" 100,000 PSIG Ball type |
| R/V-1 | Relief Valve | 1/4" 100,000 PSIG |
| NV-1 | Needle Valve | 1/4" 100,000 PSIG Angle type |
| P/G-1 | Pressure Gauge | 7,000 bar |
| PT-1 | Pressure Transducer | 7,000 bar |
| SOL-1, SOL-2 | Solenoid Valve | Air 제어 |
| B/V-1 ~ 3 | Ball Valve | 15A |

### 배관 사양

| 구간 | 사양 |
| --- | --- |
| 가압펌프 ↔ 압력용기 | 1/4" 100,000 PSIG (689.4 MPa) |
| 저압 수라인 | 1/4" 6,000 PSIG |
| 에어 라인 | 12 mm 우레탄 호스 |

::: tip
전체 도면(P&ID, Layout, Electric Drawing)의 원본은 [다운로드](/download/) 페이지에서 받을 수 있습니다.
:::
