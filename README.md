# 🚀 AI Vision Lab: Face & Hand Interaction

실시간 AI 비전 기술을 활용한 가상 피팅 및 핸드 트래킹 인터랙티브 웹 애플리케이션입니다. MediaPipe와 React를 결합하여 웹캠만으로 정밀한 신체 인식을 구현합니다.

## ✨ 주요 기능

### 1. 👓 가상 안경 피팅 (Face Fitting)
- **정밀한 얼굴 인식**: MediaPipe Face Landmarker를 사용하여 468개의 얼굴 포인트 추적.
- **실시간 렌더링**: 얼굴의 각도(Roll), 위치, 크기에 맞춰 안경 이미지를 자연스럽게 합성.
- **커스터마이징**: 안경의 크기, 가로/세로 위치를 미세하게 조정할 수 있는 컨트롤 패널 제공.
- **화면 캡처**: 피팅된 모습을 사진으로 즉시 저장 가능.

### 2. 🖐️ 실시간 손 인식 (Hand Tracking)
- **마디별 추적**: 손가락의 21개 주요 랜드마크를 실시간으로 추적 및 시각화.
- **멀티 인식**: 양손을 동시에 인식하여 움직임을 포착.

## 🛠 기술 스택
- **Core**: React 19, Vite
- **AI Engine**: MediaPipe Tasks Vision (@mediapipe/tasks-vision)
- **Styling**: Tailwind CSS (Glassmorphism UI)
- **Language**: JavaScript (ES6+)

## 🚀 시작하기

### 설치
```bash
cd Source
npm install
```

### 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` (또는 활성 포트)로 접속하세요.

## 📂 프로젝트 구조
- `Source/`: 웹 애플리케이션 소스 코드
- `Doc/`: 프로젝트 기획 및 가이드 문서
- `Source/src/components/`: 기능별 UI 컴포넌트 (FaceFitting, HandRecognition 등)
- `Source/src/utils/`: 안경 애셋 및 유틸리티 로직

## 📝 라이선스
Copyright © 2026 VisionLab. All rights reserved.
