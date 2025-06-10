import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

const GradientPicker = ({ onChange, initialStops = [
  { color: '#3b82f6', stop: 0 },
  { color: '#8b5cf6', stop: 50 },
  { color: '#a855f7', stop: 100 },
], initialBorder = '#a855f7' }) => {
  const [stops, setStops] = useState(initialStops);
  const [border, setBorder] = useState({ color: initialBorder });
  const [selectedStop, setSelectedStop] = useState(0);
  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = (color) => {
    const hex = color.hex;
    if (selectedStop === -1) {
      setBorder({ color: hex });
    } else {
      const newStops = [...stops];
      newStops[selectedStop] = { ...newStops[selectedStop], color: hex };
      setStops(newStops);
    }

    onChange({
      gradient: `from-[${stops[0].color}] via-[${stops[1].color}] to-[${stops[2].color}]`,
      border: `border-[${border.color}/30]`,
    });
  };

  const handleStopChange = (index, value) => {
    const newStops = [...stops];
    newStops[index].stop = Math.max(0, Math.min(100, parseInt(value) || 0));
    setStops(newStops);
  };

  return (
    <div className="relative p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center mb-4">
        <div
          className="w-full h-8 rounded"
          style={{ background: `linear-gradient(to right, ${stops[0].color} ${stops[0].stop}%, ${stops[1].color} ${stops[1].stop}%, ${stops[2].color} ${stops[2].stop}%)` }}
        ></div>
      </div>
      <div className="flex space-x-4 mb-4">
        {stops.map((stop, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full cursor-pointer ${selectedStop === index ? 'ring-2 ring-white' : ''}`}
              style={{ backgroundColor: stop.color }}
              onClick={() => { setSelectedStop(index); setShowPicker(true); }}
            ></div>
            <input
              type="number"
              value={stop.stop}
              onChange={(e) => handleStopChange(index, e.target.value)}
              className="w-12 mt-2 text-center bg-gray-700 text-white rounded"
              min="0"
              max="100"
            />
          </div>
        ))}
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full cursor-pointer ${selectedStop === -1 ? 'ring-2 ring-white' : ''}`}
            style={{ backgroundColor: border.color }}
            onClick={() => { setSelectedStop(-1); setShowPicker(true); }}
          ></div>
          <span className="mt-2 text-white text-sm">Border</span>
        </div>
      </div>
      {showPicker && (
        <div className="absolute z-10">
          <ChromePicker
            color={selectedStop === -1 ? border.color : stops[selectedStop].color}
            onChangeComplete={handleColorChange}
          />
          <button
            onClick={() => setShowPicker(false)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default GradientPicker;