# TRD: 기술 설계 문서

## 1. 기술 스택
- **Frontend**: React.js (Hooks 기반 상태 관리)
- **AI Engine**: MediaPipe Face Landmarker (WASM 기반)
- **Rendering**: HTML5 Canvas 2D API (초기 단계), 추후 Three.js 확장 고려
- **Styling**: Tailwind CSS

## 2. 시스템 아키텍처
1. **Input Module**: `navigator.mediaDevices.getUserMedia`를 통한 비디오 스트림 획득.
2. **Inference Module**: MediaPipe가 비디오 프레임을 분석하여 3D 랜드마크 좌표 반환.
3. **Calculation Module**: 
   - 중심점: 미간(Landmark 168)
   - 너비: 좌우 눈 끝 거리 기반 스케일링
   - 회전: 좌우 눈 높이 차이를 이용한 `Math.atan2` 계산
4. **Output Module**: 원본 비디오 위에 투명 캔버스를 겹쳐 안경 이미지 렌더링.

## 3. 데이터 구조
- `GlassesItem`: `{ id, name, imageUrl, scaleFactor, offset }`
- `FaceMetrics`: `{ center, width, rollAngle, yawAngle }`

## 4. 인프라 및 배포
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions를 통한 자동 빌드 및 배포