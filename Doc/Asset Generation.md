# Asset Generation Guide: Virtual Try-on Eyewear

## 1. 개요
본 문서는 가상 피팅 서비스에 사용될 안경 이미지 에셋을 생성하기 위한 프롬프트 가이드라인이다. 이미지 생성 에이전트는 이 규칙을 준수하여 개발에 즉시 사용 가능한 형태의 이미지를 생성한다.

## 2. 생성 목표 (Core Requirements)
- **정면 뷰 (Frontal View)**: 얼굴에 씌웠을 때 어색함이 없도록 완벽한 정면을 향해야 함.
- **단일 객체 (Single Object)**: 안경 하나만 명확하게 노출되어야 함.
- **흰색 배경 (Plain White Background)**: 추후 배경 제거(Alpha Channel 처리)가 용이하도록 단순한 흰색 배경 사용.
- **고해상도 (High Detail)**: 안경테의 질감(금속, 뿔테, 투명 등)이 선명하게 표현되어야 함.

## 3. 프롬프트 구조 (Prompt Formula)
에이전트는 다음 공식을 사용하여 영문 프롬프트를 작성한다.
> **[안경 스타일] + [프레임 재질/색상] + "eyeglasses, isolated on white background, perfectly centered, front view, symmetrical, high resolution, studio lighting, professional product photography"**

## 4. 스타일별 예시 프롬프트 (Sample Prompts)

| 스타일 | 프롬프트 예시 |
| :--- | :--- |
| **클래식 뿔테** | Black thick-rimmed acetate horn-rimmed eyeglasses, isolated on white background, perfectly centered, front view, symmetrical. |
| **금속 테** | Round gold metal wire-frame glasses, minimalist design, isolated on white background, front view, symmetrical, studio light. |
| **투명 프레임** | Trendy transparent clear crystal frame eyeglasses, professional photography, isolated on white background, front view. |
| **선글라스** | Classic aviator sunglasses with dark tinted lenses and silver frame, isolated on white background, front view. |

## 5. 금지 사항 (Negative Constraints)
- **사람 포함 금지**: 안경을 쓴 모델의 모습이 나오지 않도록 할 것.
- **측면 뷰 금지**: 안경다리만 보이는 측면 이미지는 피팅용으로 부적합함.
- **그림자 최소화**: 바닥에 강한 그림자가 생기지 않도록 'Studio lighting' 설정 유지.
- **장식 요소 배제**: 케이스, 안경 닦이 등 주변 소품 제외.

## 6. 출력 형식
- **Aspect Ratio**: 1:1 (Square)
- **Format**: PNG 또는 JPG (배경 제거가 용이한 고대비 이미지)