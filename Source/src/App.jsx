import { useState, useRef } from 'react'
import Webcam from './components/Webcam'
import GlassesFitting from './components/GlassesFitting'
import HandRecognition from './components/HandRecognition'
import GlassesCatalog from './components/GlassesCatalog'
import { createGlassesImage } from './utils/glassesAssets'

function App() {
  const [view, setView] = useState('home') // 'home', 'face', 'hand'
  const webcamRef = useRef(null)
  const [selectedGlasses, setSelectedGlasses] = useState(null)
  const [glassesSize, setGlassesSize] = useState(100)
  const [glassesOffset, setGlassesOffset] = useState({ x: 0, y: 0 })

  const glassesItems = [
    { id: 1, name: '클래식 뿔테', type: 'horn-rimmed', imageUrl: createGlassesImage('horn-rimmed'), scaleFactor: 1.0 },
    { id: 2, name: '금속 테', type: 'metal-round', imageUrl: createGlassesImage('metal-round'), scaleFactor: 1.0 },
    { id: 3, name: '투명 프레임', type: 'clear-crystal', imageUrl: createGlassesImage('clear-crystal'), scaleFactor: 1.0 },
    { id: 4, name: '선글라스', type: 'aviator', imageUrl: createGlassesImage('aviator'), scaleFactor: 1.0 },
  ]

  const handleTakeScreenshot = (canvas) => {
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `capture-${Date.now()}.png`
    link.click()
  }

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          AI 비전 체험관
        </h2>
        <p className="text-gray-400 text-lg">원하시는 체험 모드를 선택해주세요</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        <button 
          onClick={() => setView('face')}
          className="group relative bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-700 hover:border-blue-500 transition-all duration-500 overflow-hidden text-left"
        >
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-500"></div>
          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">
              👓
            </div>
            <h3 className="text-2xl font-bold">가상 안경 피팅</h3>
            <p className="text-gray-400 leading-relaxed">
              얼굴을 인식하여 다양한 스타일의 안경을 <br/> 가상으로 착용해볼 수 있습니다.
            </p>
            <div className="pt-4 flex items-center text-blue-400 font-semibold group-hover:gap-2 transition-all">
              시작하기 <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setView('hand')}
          className="group relative bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-700 hover:border-purple-500 transition-all duration-500 overflow-hidden text-left"
        >
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all duration-500"></div>
          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">
              🖐️
            </div>
            <h3 className="text-2xl font-bold">실시간 손 인식</h3>
            <p className="text-gray-400 leading-relaxed">
              손가락 마디마디를 실시간으로 추적하여 <br/> 움직임을 정밀하게 인식합니다.
            </p>
            <div className="pt-4 flex items-center text-purple-400 font-semibold group-hover:gap-2 transition-all">
              시작하기 <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  )

  const renderFaceFitting = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
      <div className="lg:col-span-2">
        <div className="relative bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl border border-gray-800">
          <Webcam ref={webcamRef} />
          <GlassesFitting
            selectedGlasses={selectedGlasses}
            size={glassesSize}
            offset={glassesOffset}
            onScreenshot={handleTakeScreenshot}
            webcamRef={webcamRef}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-3xl p-6 border border-gray-700 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-sm">⚙️</span>
            안경 세부 조정
          </h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <label className="font-medium text-gray-300">크기</label>
                <span className="text-blue-400 font-mono">{glassesSize}%</span>
              </div>
              <input
                type="range" min="70" max="130"
                value={glassesSize}
                onChange={(e) => setGlassesSize(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                disabled={!selectedGlasses}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <label className="font-medium text-gray-300">가로 위치</label>
                <span className="text-blue-400 font-mono">{glassesOffset.x}px</span>
              </div>
              <input
                type="range" min="-50" max="50"
                value={glassesOffset.x}
                onChange={(e) => setGlassesOffset({ ...glassesOffset, x: Number(e.target.value) })}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                disabled={!selectedGlasses}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <label className="font-medium text-gray-300">세로 위치</label>
                <span className="text-blue-400 font-mono">{glassesOffset.y}px</span>
              </div>
              <input
                type="range" min="-50" max="50"
                value={glassesOffset.y}
                onChange={(e) => setGlassesOffset({ ...glassesOffset, y: Number(e.target.value) })}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                disabled={!selectedGlasses}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-3xl p-6 border border-gray-700 shadow-xl overflow-hidden">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-sm">🕶️</span>
            안경 컬렉션
          </h2>
          <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <GlassesCatalog
              glasses={glassesItems}
              selectedGlasses={selectedGlasses}
              onSelectGlasses={setSelectedGlasses}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderHandRecognition = () => (
    <div className="flex flex-col items-center animate-in fade-in duration-700">
      <div className="w-full max-w-4xl relative bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl border border-gray-800">
        <Webcam ref={webcamRef} />
        <HandRecognition webcamRef={webcamRef} />
        <button
          onClick={() => handleTakeScreenshot(document.querySelector('canvas'))}
          className="absolute bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 z-30"
        >
          📷 현재 화면 캡처
        </button>
      </div>
      <div className="mt-8 text-center max-w-2xl px-4">
        <h3 className="text-2xl font-bold mb-4">🖐️ 손 인식 모드 안내</h3>
        <p className="text-gray-400">
          카메라를 향해 손을 흔들어보세요. <br/>
          최대 2개의 손을 동시에 인식하며, 21개의 주요 랜드마크를 정밀하게 추적합니다.
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-blue-500/30">
      <nav className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button 
            onClick={() => setView('home')}
            className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 transition-transform"
          >
            VisionLab
          </button>
          {view !== 'home' && (
            <button 
              onClick={() => setView('home')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all text-sm font-medium"
            >
              ← 홈으로 돌아가기
            </button>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {view === 'home' && renderHome()}
        {view === 'face' && renderFaceFitting()}
        {view === 'hand' && renderHandRecognition()}
      </main>

      <footer className="py-12 border-t border-gray-800 text-center text-gray-500 text-sm">
        &copy; 2026 VisionLab AI Interaction Showcase. All rights reserved.
      </footer>
    </div>
  )
}

export default App
