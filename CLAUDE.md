# Gamification Clock App - CLAUDE.md

## Project Overview

**"시간을 키우다"** — 시계를 보는 것만으로 캐릭터가 성장하고, 매일 출석과 알람 미션으로 보상을 얻어 희귀 시계 스킨을 수집하는 모바일 전체화면 시계 앱.

- **Platform**: React Native (Expo) + TypeScript
- **State**: Zustand + MMKV
- **Animation**: react-native-reanimated + Lottie
- **Ads**: react-native-google-mobile-ads (AdMob)
- **Notifications**: Notifee
- **Backend**: Supabase or Firebase
- **Navigation**: Expo Router (파일 기반 라우팅)

## Project Structure

```
src/
├── app/                    # Expo Router 엔트리 & 레이아웃
│   ├── _layout.tsx         # 루트 레이아웃 (AdMob 초기화, 프로바이더)
│   ├── (tabs)/             # 탭 네비게이션 그룹
│   │   ├── _layout.tsx     # 탭 레이아웃 (하단 메뉴)
│   │   ├── index.tsx       # 🏠 시계 (메인)
│   │   ├── pet.tsx         # 🐾 펫 (육성/상호작용)
│   │   ├── gacha.tsx       # 🎰 뽑기 (가챠)
│   │   ├── games.tsx       # 🎮 게임 (미니게임 목록)
│   │   └── settings.tsx    # ⚙️ 설정
│   └── onboarding.tsx      # 첫 실행 온보딩 (펫 선택)
│
├── components/
│   ├── clock/              # 시계 관련 컴포넌트
│   │   ├── DigitalClock.tsx
│   │   ├── AnalogClock.tsx
│   │   ├── ClockSkinRenderer.tsx
│   │   └── DateWeather.tsx
│   ├── pet/                # 펫 관련 컴포넌트
│   │   ├── PetDisplay.tsx
│   │   ├── PetInteraction.tsx
│   │   ├── PetFeed.tsx
│   │   └── GrowthProgress.tsx
│   ├── gacha/              # 뽑기 관련 컴포넌트
│   │   ├── GachaAnimation.tsx
│   │   ├── GachaResult.tsx
│   │   └── CollectionGrid.tsx
│   ├── games/              # 미니게임 컴포넌트
│   │   ├── AlarmGame.tsx       # 알람 끄기 게임 래퍼
│   │   ├── ReactionGame.tsx    # 반응속도
│   │   ├── MathQuiz.tsx        # 수학 퀴즈
│   │   ├── PatternMemory.tsx   # 패턴 기억
│   │   ├── ShakeGame.tsx       # 흔들기
│   │   ├── TimeGuess.tsx       # 시간 맞추기
│   │   └── PomodoroTimer.tsx   # 타이머 챌린지
│   ├── ads/                # 광고 컴포넌트
│   │   ├── BannerAd.tsx
│   │   ├── RewardedAdButton.tsx
│   │   └── InterstitialManager.tsx
│   ├── achievement/        # 업적/스트릭
│   │   ├── AchievementList.tsx
│   │   └── StreakBadge.tsx
│   └── ui/                 # 공통 UI
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── ProgressBar.tsx
│       └── CoinDisplay.tsx
│
├── stores/                 # Zustand 상태 관리
│   ├── useClockStore.ts        # 시계 스킨, 테마 상태
│   ├── usePetStore.ts          # 펫 데이터, 성장, 먹이
│   ├── useCurrencyStore.ts     # 코인, 젬 재화
│   ├── useGachaStore.ts        # 뽑기 상태, 천장 카운트
│   ├── useAttendanceStore.ts   # 출석, 스트릭
│   ├── useAchievementStore.ts  # 업적 달성 상태
│   ├── useAdFreeStore.ts       # 광고 제거 상태
│   ├── useGameStore.ts         # 미니게임 플레이 횟수, 기록
│   └── useSettingsStore.ts     # 앱 설정 (알람, 테마)
│
├── hooks/                  # 커스텀 훅
│   ├── useRewardedAd.ts        # 리워드 광고 로직
│   ├── useScreenTime.ts        # 화면 켜둔 시간 추적
│   ├── useAlarm.ts             # 알람 관리
│   ├── useDailyReset.ts        # 일일 리셋 로직
│   └── useGrowthCalculator.ts  # 펫 성장 계산
│
├── services/               # 비즈니스 로직 서비스
│   ├── adService.ts            # AdMob 초기화/관리
│   ├── notificationService.ts  # Notifee 알림 관리
│   ├── gachaService.ts         # 뽑기 확률/로직
│   ├── rewardService.ts        # 보상 계산/지급
│   └── storageService.ts       # MMKV 스토리지 래퍼
│
├── constants/              # 상수 정의
│   ├── adUnits.ts              # AdMob 광고 단위 ID
│   ├── gameConfig.ts           # 게임 밸런스 상수
│   ├── petConfig.ts            # 펫 성장 테이블
│   ├── gachaConfig.ts          # 뽑기 확률 테이블
│   └── theme.ts                # 색상, 폰트 등 디자인 토큰
│
├── types/                  # TypeScript 타입 정의
│   ├── pet.ts                  # 펫 관련 타입
│   ├── gacha.ts                # 뽑기/스킨 타입
│   ├── game.ts                 # 미니게임 타입
│   ├── achievement.ts          # 업적 타입
│   └── store.ts                # 스토어 공통 타입
│
├── utils/                  # 유틸리티 함수
│   ├── time.ts                 # 시간 관련 유틸
│   ├── random.ts               # 확률/랜덤 유틸
│   └── format.ts               # 포맷팅 유틸
│
└── assets/                 # 정적 리소스
    ├── lottie/                 # Lottie 애니메이션 파일
    ├── images/                 # 이미지 리소스
    ├── sounds/                 # 효과음/알람 사운드
    └── fonts/                  # 커스텀 폰트
```

## Tech Stack & Dependencies

| Package | Purpose |
|---------|---------|
| `expo` | React Native 프레임워크 |
| `typescript` | 타입 안정성 |
| `zustand` | 상태 관리 |
| `react-native-mmkv` | 로컬 저장소 (동기식, 고속) |
| `react-native-reanimated` | 애니메이션 |
| `lottie-react-native` | Lottie 애니메이션 |
| `react-native-google-mobile-ads` | AdMob 광고 |
| `@notifee/react-native` | 알림/알람 |
| `expo-router` | 파일 기반 라우팅 |
| `expo-haptics` | 햅틱 피드백 |

## Development Rules

### Immutability
- Zustand 스토어에서 **절대 직접 mutation 금지**
- 항상 새 객체 생성으로 상태 업데이트
- MMKV 저장 시에도 immutable 패턴 유지

### File Convention
- 컴포넌트: PascalCase (`PetDisplay.tsx`)
- 훅: camelCase with `use` prefix (`usePetStore.ts`)
- 서비스: camelCase (`gachaService.ts`)
- 타입: PascalCase for interfaces, camelCase for files
- 상수: UPPER_SNAKE_CASE for values, camelCase for files

### Component Pattern
```typescript
// 함수형 컴포넌트 + TypeScript Props
interface Props {
  petId: string
  onInteract?: () => void
}

export function PetDisplay({ petId, onInteract }: Props) {
  // hooks first
  // derived state
  // handlers
  // render
}
```

### Store Pattern (Zustand + Storage Adapter)

```typescript
import { create } from 'zustand'
import { storage } from '../services/storageService'

interface SomeStore {
  value: number
  setValue: (v: number) => void
}

export const useSomeStore = create<SomeStore>((set) => ({
  value: storage.getNumber('someValue') ?? 0,
  setValue: (v) => {
    storage.set('someValue', v)
    set({ value: v })
  },
}))
```

> Note: `storageService.ts`는 MMKV v3 (react-native-mmkv@3) 사용. 네이티브 빌드 필수.

### Ad Integration Rules
- **개발 중**: 반드시 `TestIds` 사용 (실제 ID 사용 시 계정 정지)
- **리워드 광고**: `EARNED_REWARD` 이벤트에서만 보상 지급
- **인터스티셜**: 3회에 1번 이하 빈도
- **광고 제거 중**: 자발적 리워드(젬 획득용)만 시청 가능
- **광고 ID**: `constants/adUnits.ts`에서 환경별 분기

### Game Balance Constants
모든 게임 밸런스 수치는 `constants/gameConfig.ts`에 중앙 관리:
- 펫 경험치 테이블
- 뽑기 확률 (일반 60%, 레어 25%, 에픽 12%, 레전더리 3%)
- 천장 시스템: 50회
- 코인/젬 획득량
- 광고 제거 시간: 24시간

## MVP Phases

### Phase 1 — 핵심 시계 + AdMob (2~3주)
- [x] Expo + TypeScript 프로젝트 초기 설정
- [x] 전체화면 시계 UI (디지털/아날로그 기본 2종)
- [ ] 기본 알람 기능 (Notifee) — 네이티브 빌드 필요
- [x] AdMob 연동 + 배너 광고 (플레이스홀더, 네이티브 빌드 시 실제 연동)

### Phase 2 — 게이미피케이션 (3~4주)
- [x] 펫 육성 시스템 (성장 5단계)
- [x] 출석 체크 + 코인 시스템
- [x] 뽑기(가챠) 시스템 + 스킨 적용
- [x] 리워드 광고 (젬 획득 + 24시간 광고 제거) — 시뮬레이션 모드
- [x] 인터스티셜 광고 — 로직 구현 완료

### Phase 3 — 미니게임 & 소셜 (2~3주)
- [x] 알람 미니게임 3종 (반응속도, 수학퀴즈, 시간맞추기)
- [x] 시간 맞추기 게임
- [x] 업적/스트릭 시스템
- [x] 추가 미니게임 3종 (패턴기억, 빠른탭, 뽀모도로)
- [x] 알람 게임 래퍼 (AlarmGame)
- [x] 펫 먹이주기/성장 상세 UI
- [x] 스트릭 배지 시스템
- [x] 가챠 결과 표시 컴포넌트
- [x] 인터스티셜 광고 매니저

### Phase 4 — 수익 최적화 (2주~)

- [ ] 리워드 광고 시청 포인트 다양화
- [ ] 시즌 한정 컬렉션
- [ ] A/B 테스트

---

## Work Progress Log

> **자가 반복 업데이트 규칙**: 매 작업 세션 종료 시 아래 로그를 업데이트합니다.
> Claude는 작업 시작 시 이 섹션을 읽고 현재 상태를 파악한 후 작업을 이어갑니다.

### Current Status

- **Active Phase**: Phase 3 완료, Phase 4 진행 중
- **Last Updated**: 2026-02-20
- **Last Session Summary**: 네이티브 빌드 전환 — MMKV v3 영구 저장소 연동, AdMob SDK 실제 연동 (BannerAd, RewardedAd), Notifee 알람 서비스 구현, 펫 상호작용 보상 시스템 추가

### Completed Work

<!-- 완료된 작업을 역순(최신순)으로 기록 -->
| Date       | Work                                    | Files Changed |
|------------|-----------------------------------------|---------------|
| 2026-02-20 | 네이티브 전환: MMKV, AdMob SDK, Notifee, 펫 보상 시스템 | `storageService, ads/*, notificationService, usePetStore` |
| 2026-02-20 | 미구현 컴포넌트 전체 구현 (hooks, 미니게임 3종, 펫 UI, 스트릭 배지 등 12파일) | `src/hooks/*, src/components/**/*` |
| 2026-02-20 | 패키지 버전 호환성 수정 + Node.js 업그레이드 | `package.json` |
| 2026-02-20 | 전체 앱 구현 (50+ 파일) | `src/**/*` |
| 2026-02-20 | CLAUDE.md 초기 생성, 프로젝트 구조 설계 | `CLAUDE.md` |

### In Progress

<!-- 현재 진행 중인 작업 -->
- None

### Known Issues

<!-- 알려진 이슈, 블로커 -->

- app.json의 AdMob App ID를 실제 값으로 교체 필요 (현재 placeholder)
- adUnits.ts의 프로덕션 광고 단위 ID 교체 필요
- `pnpm expo prebuild --clean` 후 네이티브 빌드 재실행 필요 (MMKV, AdMob, Notifee 반영)

### Next Steps

<!-- 다음 세션에서 해야 할 작업 -->

1. `pnpm expo prebuild --clean` 실행 후 iOS/Android 네이티브 빌드 확인
2. AdMob App ID 발급 및 app.json + adUnits.ts에 실제 ID 적용
3. 알람 UI 화면 구현 (설정 탭에 알람 추가/삭제 기능)
4. Lottie 애니메이션 에셋 추가 (뽑기 연출, 펫 애니메이션)
5. Phase 4 수익 최적화 (리워드 광고 다양화, 시즌 한정 컬렉션)

---

## Self-Update Protocol

**이 CLAUDE.md는 살아있는 문서입니다. 아래 규칙을 반드시 따릅니다:**

### 매 작업 시작 시
1. `Work Progress Log` 섹션을 읽고 현재 상태 파악
2. `Known Issues`와 `Next Steps` 확인
3. `In Progress`에 현재 작업 기록

### 매 작업 완료 시
1. `Completed Work` 테이블에 날짜, 작업 내용, 변경 파일 추가 (최신순)
2. `In Progress`에서 완료된 항목 제거
3. `Current Status` 업데이트 (Active Phase, Last Updated, Last Session Summary)
4. `Next Steps` 업데이트 (완료 항목 제거, 새 항목 추가)
5. MVP Phases 체크리스트에서 완료 항목 `[x]`로 변경
6. 새로운 이슈 발견 시 `Known Issues`에 추가
7. 구조 변경 시 `Project Structure` 트리 업데이트

### 구조 변경 시
- 새 파일/디렉토리 추가 → `Project Structure` 트리에 반영
- 새 패키지 설치 → `Tech Stack & Dependencies` 테이블에 추가
- 패턴 변경 → `Development Rules` 섹션 업데이트
