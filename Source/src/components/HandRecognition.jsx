import { useRef, useEffect, useState } from 'react'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

function HandRecognition({ webcamRef }) {
  const canvasRef = useRef(null)
  const handLandmarkerRef = useRef(null)
  const animFrameRef = useRef(null)
  const lastTimestampRef = useRef(-1)
  const [isReady, setIsReady] = useState(false)
  const [handsDetected, setHandsDetected] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function initializeHandLandmarker() {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.7/wasm'
        )
        const landmarker = await HandLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 2
        })
        if (!cancelled) {
          handLandmarkerRef.current = landmarker
          setIsReady(true)
          console.log('HandLandmarker initialized')
        }
      } catch (error) {
        console.error('HandLandmarker initialization error:', error)
        // Fallback to CPU
        try {
          const filesetResolver = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.7/wasm'
          )
          const landmarker = await HandLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'CPU'
            },
            runningMode: 'VIDEO',
            numHands: 2
          })
          if (!cancelled) {
            handLandmarkerRef.current = landmarker
            setIsReady(true)
            console.log('HandLandmarker initialized (CPU fallback)')
          }
        } catch (err2) {
          console.error('HandLandmarker fallback error:', err2)
        }
      }
    }

    initializeHandLandmarker()

    return () => {
      cancelled = true
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (!isReady) return

    function detectLoop() {
      const video = webcamRef?.current?.getVideo()
      if (!video || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(detectLoop)
        return
      }

      const canvas = canvasRef.current
      if (!canvas) {
        animFrameRef.current = requestAnimationFrame(detectLoop)
        return
      }

      const ctx = canvas.getContext('2d')
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const nowMs = performance.now()
      if (nowMs <= lastTimestampRef.current) {
        animFrameRef.current = requestAnimationFrame(detectLoop)
        return
      }
      lastTimestampRef.current = nowMs

      try {
        const results = handLandmarkerRef.current.detectForVideo(video, nowMs)

        if (results.landmarks && results.landmarks.length > 0) {
          setHandsDetected(true)
          results.landmarks.forEach((landmarks) => {
            drawHand(ctx, landmarks, canvas.width, canvas.height)
          })
        } else {
          setHandsDetected(false)
        }
      } catch (err) {
        console.error('Hand detection error:', err)
      }

      animFrameRef.current = requestAnimationFrame(detectLoop)
    }

    animFrameRef.current = requestAnimationFrame(detectLoop)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [isReady, webcamRef])

  function drawHand(ctx, landmarks, width, height) {
    ctx.save()
    
    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [5, 9], [9, 10], [10, 11], [11, 12], // Middle
      [9, 13], [13, 14], [14, 15], [15, 16], // Ring
      [13, 17], [17, 18], [18, 19], [19, 20], [0, 17] // Pinky
    ]

    ctx.strokeStyle = '#00FF00'
    ctx.lineWidth = 3
    connections.forEach(([i, j]) => {
      const p1 = landmarks[i]
      const p2 = landmarks[j]
      ctx.beginPath()
      ctx.moveTo(p1.x * width, p1.y * height)
      ctx.lineTo(p2.x * width, p2.y * height)
      ctx.stroke()
    })

    // Draw joints
    ctx.fillStyle = '#FF0000'
    landmarks.forEach((lm) => {
      ctx.beginPath()
      ctx.arc(lm.x * width, lm.y * height, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    ctx.restore()
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transform scale-x-[-1]"
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none z-20">
          <p className="text-white text-lg font-medium">손 인식 AI 모델 로딩 중...</p>
        </div>
      )}
      {isReady && !handsDetected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-20">
          <p className="text-white text-lg font-medium">손을 카메라에 비춰주세요</p>
        </div>
      )}
    </>
  )
}

export default HandRecognition
