import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    // GitHub Pages: https://ilshinautoclave.github.io/CIP/
    base: '/CIP/',

    lang: 'ko-KR',
    title: '일신오토클레이브',
    description: 'ISOSTATIC PRESS 기술자료 - 매뉴얼, 자가 진단 가이드, 다운로드',

    lastUpdated: true,
    cleanUrls: true,
    ignoreDeadLinks: true,

    head: [
      ['link', { rel: 'icon', href: '/CIP/favicon.ico' }],
      ['meta', { name: 'theme-color', content: '#0b3fa8' }],
      ['meta', { property: 'og:title', content: '일신오토클레이브 기술자료' }],
      ['meta', { property: 'og:description', content: 'ISOSTATIC PRESS 매뉴얼 및 자가 진단 가이드' }]
    ],

    themeConfig: {
      logo: '/logo.png',
      siteTitle: '기술자료',

      nav: [
        { text: '홈', link: '/' },
        { text: '매뉴얼', link: '/manual/intro/overview' },
        { text: '자가 진단 가이드', link: '/troubleshooting/' },
        { text: '기술 문서', link: '/technical/alarm-code-table' },
        { text: '다운로드', link: '/download/' },
        { text: '회사', link: 'https://suflux.com/' }
      ],

      sidebar: {
        '/manual/': [
          {
            text: '1. 사용자를 위한 중요 정보',
            collapsed: false,
            items: [
              { text: '1.1 사전 준비', link: '/manual/intro/overview' },
              { text: '1.2 데이터 시트', link: '/manual/intro/datasheet' },
              { text: '1.3 사양', link: '/manual/intro/specifications' },
              { text: '1.4 제품 안내', link: '/manual/intro/product-notice' },
              { text: '1.5 폐수 처리', link: '/manual/intro/wastewater' },
              { text: '1.6 일반 사항', link: '/manual/intro/general' }
            ]
          },
          {
            text: '2. 안전',
            collapsed: false,
            items: [
              { text: '2.1 안전 표시', link: '/manual/safety/indications' },
              { text: '2.2 안전 규정', link: '/manual/safety/regulations' },
              { text: '2.3 작업 환경', link: '/manual/safety/environment' },
              { text: '2.4 책임의 한계', link: '/manual/safety/liability' }
            ]
          },
          {
            text: '3. 설치',
            collapsed: false,
            items: [
              { text: '3.1 반입 및 점검', link: '/manual/installation/receiving' },
              { text: '3.2 설치 장소 및 수평', link: '/manual/installation/leveling' },
              { text: '3.3 유틸리티 연결', link: '/manual/installation/utilities' }
            ]
          },
          {
            text: '4. 장치 구성',
            collapsed: false,
            items: [
              { text: '4.1 주요 구성품', link: '/manual/components/parts' },
              { text: '4.2 공정 흐름도 (P&ID)', link: '/manual/components/pid' },
              { text: '4.3 제어반 구성', link: '/manual/components/control-panel' }
            ]
          },
          {
            text: '5. 운전',
            collapsed: false,
            items: [
              { text: '5.1 운전 전 점검', link: '/manual/operation/pre-check' },
              { text: '5.2 전원 인가', link: '/manual/operation/power-on' },
              { text: '5.3 압력 설정', link: '/manual/operation/pressure-setting' },
              { text: '5.4 시료 장착 및 투입', link: '/manual/operation/loading' },
              { text: '5.5 가압', link: '/manual/operation/pressurizing' },
              { text: '5.6 감압', link: '/manual/operation/releasing' },
              { text: '5.7 시료 반출', link: '/manual/operation/unloading' }
            ]
          },
          {
            text: '6. HMI 화면',
            collapsed: false,
            items: [
              { text: '6.1 메인 화면', link: '/manual/hmi/main-screen' },
              { text: '6.2 알람 및 구동 설정', link: '/manual/hmi/alarm-setting' },
              { text: '6.3 STEP 패턴 설정', link: '/manual/hmi/step-pattern' }
            ]
          },
          {
            text: '7. 유지 보수',
            collapsed: false,
            items: [
              { text: '7.1 점검 항목과 주기', link: '/manual/maintenance/checklist' },
              { text: '7.2 소모품 교체', link: '/manual/maintenance/consumables' }
            ]
          },
          {
            text: '부록',
            collapsed: true,
            items: [
              { text: 'A. 사양 타입 비교', link: '/manual/appendix/model-comparison' },
              { text: 'B. 용어집', link: '/manual/appendix/glossary' },
              { text: 'C. 문의 및 A/S', link: '/manual/appendix/support' }
            ]
          }
        ],

        '/troubleshooting/': [
          {
            text: '자가 진단 가이드',
            collapsed: false,
            items: [
              { text: '사용 방법', link: '/troubleshooting/' },
              { text: '증상별 빠른 찾기', link: '/troubleshooting/symptom-index' }
            ]
          },
          {
            text: '커버 · 핀',
            collapsed: false,
            items: [
              { text: '커버 상승/하강 불량', link: '/troubleshooting/cover-movement' },
              { text: '핀이 빠지지 않음', link: '/troubleshooting/pin-stuck' },
              { text: '베셀이 닫히지 않음', link: '/troubleshooting/vessel-closing' }
            ]
          },
          {
            text: '압력',
            collapsed: false,
            items: [
              { text: '승압/유지 불량', link: '/troubleshooting/pressure-build' },
              { text: '고압 누수(Leak)', link: '/troubleshooting/leak' }
            ]
          },
          {
            text: '온도 · 전기',
            collapsed: false,
            items: [
              { text: '히터 온도 이상', link: '/troubleshooting/heater' },
              { text: '알람 발생 시 조치', link: '/troubleshooting/alarm-response' }
            ]
          }
        ],

        '/technical/': [
          {
            text: '기술 문서',
            collapsed: false,
            items: [
              { text: '알람 코드표', link: '/technical/alarm-code-table' },
              { text: '인터록 조건', link: '/technical/interlock' },
              { text: '소모품 · 부품 목록', link: '/technical/parts-list' }
            ]
          }
        ],

        '/download/': [
          {
            text: '다운로드',
            collapsed: false,
            items: [
              { text: '자료실', link: '/download/' }
            ]
          }
        ]
      },

      socialLinks: [
        { icon: 'youtube', link: 'https://www.youtube.com/@ilshinautoclave' }
      ],

      footer: {
        message: '고압 장비입니다. 반드시 교육받은 작업자만 운전하십시오.',
        copyright: '© ㈜일신오토클레이브 (ILSHIN AUTOCLAVE CO., LTD.)'
      },

      search: {
        provider: 'local',
        options: {
          locales: {
            root: {
              translations: {
                button: { buttonText: '검색', buttonAriaLabel: '검색' },
                modal: {
                  displayDetails: '상세 보기',
                  resetButtonTitle: '검색 초기화',
                  backButtonTitle: '뒤로',
                  noResultsText: '검색 결과가 없습니다',
                  footer: {
                    selectText: '선택',
                    navigateText: '이동',
                    closeText: '닫기'
                  }
                }
              }
            }
          }
        }
      },

      outline: { level: [2, 3], label: '목차' },
      docFooter: { prev: '이전 페이지', next: '다음 페이지' },
      returnToTopLabel: '맨 위로',
      sidebarMenuLabel: '메뉴',
      darkModeSwitchLabel: '화면 모드',
      lightModeSwitchTitle: '라이트 모드로 전환',
      darkModeSwitchTitle: '다크 모드로 전환',
      lastUpdatedText: '최종 수정일'
    },

    mermaid: {
      theme: 'base',
      flowchart: {
        // 자연 크기로 렌더링하고, 넘치면 가로 스크롤 (글씨 축소 방지)
        useMaxWidth: false,
        // SVG 텍스트로 렌더링 — 여러 줄 라벨이 도형 밖으로 잘리는 문제 방지
        htmlLabels: false,
        curve: 'linear',
        nodeSpacing: 45,
        rankSpacing: 55,
        padding: 18
      }
    }
  })
)
