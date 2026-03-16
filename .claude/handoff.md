# Session Handoff
- Updated: 2026-03-15
- Branch: main

## 현재 작업
- (없음) — 모든 핵심 기능 구현 및 배포 완료

## 완료된 것
- 프로젝트 전체 설계 (브레인스토밍 → 디자인 스펙 → 구현 플랜)
- Next.js 16 + Tailwind 3 + next-intl 프로젝트 초기화
- 핵심 로직: `calculations.ts` (TDD, 23 tests), `storage.ts` (localStorage CRUD + base64 URL 공유)
- `UserProfile` 타입 추가 — `min(대상 남은 수명, 나의 남은 수명)` 계산
- 온보딩 플로우: Step 1 프로필 입력 (필수) → Step 2 첫 대상 추가 → 대시보드
- 프로필 저장 시 "Me" Subject 자동 생성 (`dashboard/page.tsx`)
- 대시보드: SubjectCard, SubjectFormModal, DailyReminder, edit/delete
- 상세 그리드: LifeGrid (auto-fit columns + expand fullscreen), SeasonCounter, TimeRatioBar, ShareButton
- UnitToggle: Days/Weeks/Months 전환 — 하단 통계도 선택 단위에 맞게 표시
- i18n 5개 언어: en, ko, ja, zh, es (드롭다운 switcher, cookie 기반)
- SEO: sitemap.xml, robots.txt, OG 메타태그, Google Search Console 등록 완료
- Vercel Analytics + Speed Insights 연동
- 코드 리뷰 2회 → 모든 critical/important 이슈 해결
- Vercel 프로덕션 배포: https://life-calendar-gray.vercel.app
- GitHub: https://github.com/hobaek/life-calendar

## 다음 할 일
- README.md 꾸미기 (유저가 나중에 하겠다고 함)
- 네이버 서치어드바이저 등록 (한국 검색 노출)
- 커스텀 도메인 (필요 시)
- "Me" Subject 이름이 locale 변경 시 안 바뀌는 UX 이슈 (마이너)
- UserProfile 관련 계산 테스트 추가 (min end date 로직)
- Product Hunt / Reddit 등 마케팅 런칭

## 주의사항
- Co-Authored-By 커밋 메시지 금지 (git hook으로 차단됨)
- 프로젝트는 yarn 사용 (npm 아님)
- Tailwind v3 config 형식 사용 (v4 아님)
- `contain: strict`는 collapsed grid에서 높이 0 버그 유발 → `contentVisibility: auto`만 사용
- localStorage 읽기는 반드시 `useEffect` 안에서 (SSR 하이드레이션)
