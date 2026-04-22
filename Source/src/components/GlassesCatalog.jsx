function GlassesCatalog({ glasses, selectedGlasses, onSelectGlasses }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {glasses.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelectGlasses(item)}
          className={`
            group p-2 rounded-2xl border transition-all duration-300
            ${selectedGlasses?.id === item.id
              ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              : 'border-gray-700 bg-gray-800/40 hover:border-gray-600 hover:bg-gray-800/60'
            }
          `}
        >
          <div className="aspect-square bg-gradient-to-br from-white to-gray-200 rounded-xl mb-3 overflow-hidden p-2 group-hover:scale-[1.02] transition-transform duration-300">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-contain drop-shadow-md"
              onError={(e) => {
                e.target.style.display = 'none'
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="hidden w-full h-full items-center justify-center text-gray-500 text-xs font-medium">
              이미지 준비 중
            </div>
          </div>
          <p className={`text-xs font-bold text-center transition-colors ${selectedGlasses?.id === item.id ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-200'}`}>
            {item.name}
          </p>
        </button>
      ))}
    </div>
  )
}

export default GlassesCatalog
