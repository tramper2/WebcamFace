import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'

const Webcam = forwardRef(function Webcam(props, ref) {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)

  // 부모 컴포넌트에서 video 요소에 접근할 수 있도록 ref 노출
  useImperativeHandle(ref, () => ({
    getVideo: () => videoRef.current
  }))

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        setError('웹캠 접근 권한이 필요합니다.')
        console.error('Camera access error:', err)
      }
    }

    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <p className="text-lg">{error}</p>
            <p className="text-sm text-gray-400 mt-2">브라우저의 웹캠 권한을 허용해주세요.</p>
          </div>
        </div>
      )}
      {!error && !stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
          <p className="text-lg">웹캠 연결 중...</p>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover transform scale-x-[-1]"
      />
    </div>
  )
})

export default Webcam
