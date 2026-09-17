'use client';

import React, { useRef, useState, useEffect } from 'react';

interface SignaturePadProps {
  value?: string | null;
  onChange: (dataUrl: string) => void;
  authorizedPersonName?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ value, onChange, authorizedPersonName }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'DRAW' | 'TYPE'>('DRAW');
  const [typedName, setTypedName] = useState(authorizedPersonName || '');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (value && value.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, [value]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  const handleTypedChange = (name: string) => {
    setTypedName(name);
    onChange(name);
  };

  return (
    <div className="border border-slate-300 rounded-lg p-3 bg-slate-50">
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-semibold uppercase text-slate-700 tracking-wider">
          Authorization & Digital Signature
        </label>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode('DRAW')}
            className={`px-2.5 py-1 rounded font-medium ${
              mode === 'DRAW' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Draw Signature
          </button>
          <button
            type="button"
            onClick={() => setMode('TYPE')}
            className={`px-2.5 py-1 rounded font-medium ${
              mode === 'TYPE' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Type Name
          </button>
        </div>
      </div>

      {mode === 'DRAW' ? (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={120}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full bg-white border border-slate-300 rounded cursor-crosshair touch-none"
          />
          <div className="flex justify-between items-center mt-1.5 text-xs text-slate-500">
            <span>Sign inside the box using mouse or touch</span>
            <button
              type="button"
              onClick={clearCanvas}
              className="text-red-600 hover:underline font-medium"
            >
              Clear Canvas
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={typedName}
            onChange={(e) => handleTypedChange(e.target.value)}
            placeholder="Type authorized signatory name..."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-teal-500 font-serif italic text-slate-800"
          />
          <p className="text-xs text-slate-500">
            Preview signature font style: <span className="font-serif italic text-slate-900 font-bold ml-1">{typedName || 'Signatory Name'}</span>
          </p>
        </div>
      )}
    </div>
  );
};
