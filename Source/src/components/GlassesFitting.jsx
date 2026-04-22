import { useRef, useEffect, useState, useCallback } from 'react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

function GlassesFitting({ selectedGlasses, size, offset, onScreenshot, webcamRef }) {
  const canvasRef = useRef(null)
  const faceLandmarkerRef = useRef(null)
  const glassesImageRef = useRef(null)
  const animFrameRef = useRef(null)
  const lastTimestampRef = useRef(-1)
  const [isReady, setIsReady] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)

  // 1. FaceLandmarker 초기화 (한 번만)
  useEffect(() => {
    let cancelled = false

    async function initializeFaceLandmarker() {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.7/wasm'
        )
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU'
          },
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
          numFaces: 1,
          runningMode: 'VIDEO'
        })
        if (!cancelled) {
          faceLandmarkerRef.current = landmarker
          setIsReady(true)
          console.log('FaceLandmarker 초기화 완료')
        }
      } catch (error) {
        console.error('FaceLandmarker initialization error:', error)
        // GPU 실패 시 CPU로 재시도
        try {
          const filesetResolver = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.7/wasm'
          )
          const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'CPU'
            },
            outputFaceBlendshapes: false,
            outputFacialTransformationMatrixes: false,
            numFaces: 1,
            runningMode: 'VIDEO'
          })
          if (!cancelled) {
            faceLandmarkerRef.current = landmarker
            setIsReady(true)
            console.log('FaceLandmarker 초기화 완료 (CPU fallback)')
          }
        } catch (err2) {
          console.error('FaceLandmarker CPU fallback error:', err2)
        }
      }
    }

    initializeFaceLandmarker()

    return () => {
      cancelled = true
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close()
      }
    }
  }, [])

  // 2. 안경 이미지 로드
  useEffect(() => {
    if (selectedGlasses?.imageUrl) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        glassesImageRef.current = img
        console.log('안경 이미지 로드 완료')
      }
      img.onerror = () => {
        console.error('Failed to load glasses image:', selectedGlasses.imageUrl)
        glassesImageRef.current = null
      }
      img.src = selectedGlasses.imageUrl
    } else {
      glassesImageRef.current = null
    }
  }, [selectedGlasses?.imageUrl])

  // 3. 메인 감지 루프
  useEffect(() => {
    if (!isReady) return

    function detectLoop() {
      const video = webcamRef?.current?.getVideo()

      if (!video || video.readyState < 2) {
        // 비디오가 아직 준비 안 됨 → 재시도
        animFrameRef.current = requestAnimationFrame(detectLoop)
        return
      }

      const canvas = canvasRef.current
      if (!canvas) {
        animFrameRef.current = requestAnimationFrame(detectLoop)
        return
      }

      const ctx = canvas.getContext('2d')

      // 캔버스 크기를 비디오에 맞춤
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // MediaPipe 감지
      const nowMs = performance.now()
      if (nowMs <= lastTimestampRef.current) {
        animFrameRef.current = requestAnimationFrame(detectLoop)
        return
      }
      lastTimestampRef.current = nowMs

      try {
        const results = faceLandmarkerRef.current.detectForVideo(video, nowMs)

        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          const landmarks = results.faceLandmarks[0]
          setFaceDetected(true)

          // 얼굴 랜드마크 시각화
          drawLandmarks(ctx, landmarks, canvas.width, canvas.height)

          // 안경 그리기
          if (selectedGlasses && glassesImageRef.current) {
            drawGlasses(ctx, landmarks, canvas.width, canvas.height)
          }
        } else {
          setFaceDetected(false)
        }
      } catch (err) {
        console.error('Detection error:', err)
      }

      animFrameRef.current = requestAnimationFrame(detectLoop)
    }

    animFrameRef.current = requestAnimationFrame(detectLoop)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [isReady, selectedGlasses, size, offset, webcamRef])

  function drawLandmarks(ctx, landmarks, width, height) {
    ctx.save()

    // 눈 랜드마크 인덱스 (MediaPipe 468 랜드마크 기준)
    const leftEyeIndices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
    const rightEyeIndices = [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466]

    // 왼쪽 눈 (빨간 점)
    ctx.fillStyle = '#ff0000'
    leftEyeIndices.forEach(index => {
      const lm = landmarks[index]
      if (lm) {
        ctx.beginPath()
        ctx.arc(lm.x * width, lm.y * height, 2, 0, 2 * Math.PI)
        ctx.fill()
      }
    })

    // 오른쪽 눈 (초록 점)
    ctx.fillStyle = '#00ff00'
    rightEyeIndices.forEach(index => {
      const lm = landmarks[index]
      if (lm) {
        ctx.beginPath()
        ctx.arc(lm.x * width, lm.y * height, 2, 0, 2 * Math.PI)
        ctx.fill()
      }
    })

    // 미간 (노란 점 - 안경 중심 위치)
    ctx.fillStyle = '#ffff00'
    ctx.beginPath()
    ctx.arc(landmarks[168].x * width, landmarks[168].y * height, 4, 0, 2 * Math.PI)
    ctx.fill()

    ctx.restore()
  }

  function drawGlasses(ctx, landmarks, canvasWidth, canvasHeight) {
    const img = glassesImageRef.current
    if (!img) return

    // MediaPipe 랜드마크 인덱스:
    // 33: 왼쪽 눈 안쪽 꼬리
    // 133: 왼쪽 눈 바깥 꼬리
    // 362: 오른쪽 눈 안쪽 꼬리 (actually outer)
    // 263: 오른쪽 눈 바깥 꼬리 (actually inner based on MediaPipe)
    // 168: 미간 (코 브릿지)
    
    const leftEyeOuter = landmarks[33]   // 왼쪽 눈 바깥
    const rightEyeOuter = landmarks[263] // 오른쪽 눈 바깥
    const noseBridge = landmarks[168]

    // 얼굴 폭 계산 (눈 사이 + 여유)
    const eyeDistance = Math.hypot(
      (rightEyeOuter.x - leftEyeOuter.x) * canvasWidth,
      (rightEyeOuter.y - leftEyeOuter.y) * canvasHeight
    )

    // 안경 크기: 눈 간 거리의 약 1.8배 (안경은 눈보다 넓음)
    const scaleFactor = selectedGlasses.scaleFactor || 1.0
    const glassesWidth = eyeDistance * 1.8 * scaleFactor * (size / 100)
    const glassesHeight = glassesWidth * (img.naturalHeight / img.naturalWidth)

    // 안경 중심 위치
    const centerX = noseBridge.x * canvasWidth + offset.x
    const centerY = noseBridge.y * canvasHeight + offset.y

    // 회전 각도 (두 눈 사이 기울기)
    const rollAngle = Math.atan2(
      (rightEyeOuter.y - leftEyeOuter.y) * canvasHeight,
      (rightEyeOuter.x - leftEyeOuter.x) * canvasWidth
    )

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(rollAngle)

    ctx.drawImage(
      img,
      -glassesWidth / 2,
      -glassesHeight / 2,
      glassesWidth,
      glassesHeight
    )

    ctx.restore()
  }

  function handleScreenshot() {
    const canvas = canvasRef.current
    if (canvas && onScreenshot) {
      onScreenshot(canvas)
    }
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transform scale-x-[-1]"
      />
      {selectedGlasses && (
        <button
          onClick={handleScreenshot}
          className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-colors z-10"
        >
          촬영
        </button>
      )}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none z-20">
          <p className="text-white text-lg font-medium">AI 모델 로딩 중...</p>
        </div>
      )}
      {isReady && !faceDetected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-20">
          <p className="text-white text-lg font-medium">얼굴을 화면에 맞춰주세요</p>
        </div>
      )}
    </>
  )
}

export default GlassesFitting
