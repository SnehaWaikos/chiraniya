import React, { useState, useRef, useEffect } from "react";
import { MoveHorizontal, Maximize2, Compass, Play, Pause, ZoomIn, ZoomOut, Info } from "lucide-react";

interface Hotspot {
  id: string;
  label: string;
  description: string;
  xPercent: number; // base x position on image (0-100)
  yPercent: number; // base y position on image (0-100)
}

interface PanoramaViewerProps {
  imageUrl: string;
  title: string;
  blueprintOverlay?: boolean;
}

export default function PanoramaViewer({ imageUrl, title, blueprintOverlay = false }: PanoramaViewerProps) {
  const [rotation, setRotation] = useState(0); // in pixels
  const [isDragging, setIsDragging] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);

  const imageWidth = 1920; // assumed viewport width for seamless repeat calculation

  const hotspots: Hotspot[] = [
    {
      id: "staircase",
      label: "Glass Floating Staircase",
      description: "Custom cantilevered structural glass panes with cascading ethereal lighting arrays.",
      xPercent: 30,
      yPercent: 45,
    },
    {
      id: "facade",
      label: "Concrete Wall Facade",
      description: "Polished concrete texture with contrasting warm horizontal walnut panels.",
      xPercent: 65,
      yPercent: 40,
    },
    {
      id: "chasing-light",
      label: "Caustic Aquatic Glint",
      description: "High-refraction blue undertones cascading from a bespoke light installation.",
      xPercent: 48,
      yPercent: 25,
    },
  ];

  // Auto-rotation effect
  useEffect(() => {
    if (!autoPlay || isDragging) return;

    let animFrame: number;
    const tick = () => {
      setRotation((prev) => (prev - 0.45) % imageWidth);
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [autoPlay, isDragging]);

  // Handle Drag / Swipe Start
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    startRotationRef.current = rotation;
    setActiveHotspot(null);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  // Handle Dragging
  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startXRef.current;
    // Multiplier determines drag sensitivity
    const nextRotation = (startRotationRef.current + deltaX * 1.5) % imageWidth;
    setRotation(nextRotation);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  // Handle Drag End
  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging]);

  // Adjust zoom level safely
  const adjustZoom = (amount: number) => {
    setZoom((prev) => Math.min(Math.max(prev + amount, 1), 1.8));
  };

  return (
    <div className="space-y-4">
      {/* Viewer Main Frame */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleEnd}
        className={`relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/60 select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* Continuous wrapped background panorama */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${100 * zoom}% ${100 * zoom}%`,
            backgroundRepeat: "repeat-x",
            backgroundPosition: `${rotation}px center`,
            transition: isDragging ? "none" : "background-position 0.1s ease-out, background-size 0.2s ease-out",
          }}
        />

        {/* Blueprint Lines Overlay (Conditional) */}
        {blueprintOverlay && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <svg className="w-full h-full opacity-60 stroke-secondary/40 stroke-[0.5]" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="panoGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(1, 103, 125, 0.2)" strokeWidth="0.2" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#panoGrid)" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#00b4d8" strokeWidth="0.1" strokeDasharray="3,3" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#01677d" strokeWidth="0.1" strokeDasharray="1,1" />
            </svg>
          </div>
        )}

        {/* Interactive Hotspot pins placed onto the panning cylinder */}
        {hotspots.map((spot) => {
          // Calculate screen position based on panning rotation offset
          // Normalizes the position dynamically across the scrolling viewport
          const containerWidth = containerRef.current?.clientWidth || 800;
          const pxOffset = (spot.xPercent / 100) * imageWidth;
          const rawX = pxOffset + rotation;
          
          // Keep it bounded inside repeated viewport
          let screenX = rawX % imageWidth;
          if (screenX < 0) screenX += imageWidth;
          
          // Only show if it falls inside visible container window bounds
          if (screenX > containerWidth + 40 && screenX < imageWidth - 40) return null;

          return (
            <div
              key={spot.id}
              className="absolute z-20 transition-all duration-100"
              style={{
                left: `${(screenX / containerWidth) * 100}%`,
                top: `${spot.yPercent}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(activeHotspot?.id === spot.id ? null : spot);
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center border shadow-lg transition-all ${
                  activeHotspot?.id === spot.id
                    ? "bg-secondary text-white scale-110 ring-4 ring-secondary/20 border-white"
                    : "bg-white/95 text-secondary hover:bg-secondary hover:text-white border-secondary/40"
                }`}
              >
                <Info className="w-4 h-4" />
              </button>

              {/* Dynamic hotspot detail card */}
              {activeHotspot?.id === spot.id && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-white/95 backdrop-blur-md border border-secondary/30 p-3 rounded-xl shadow-xl z-30 pointer-events-auto">
                  <h6 className="font-serif text-xs font-bold text-primary mb-1">{spot.label}</h6>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">{spot.description}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Cinematic Walkthrough Visual Guidance Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-6 flex flex-wrap justify-between items-end gap-4 pointer-events-none z-10">
          <div className="space-y-1 text-white">
            <span className="bg-secondary px-2.5 py-1 rounded-full text-[9px] font-label font-bold uppercase tracking-wider">
              360° Panorama Walkthrough
            </span>
            <h4 className="font-serif text-lg font-bold">{title}</h4>
            <p className="text-[10px] text-white/70 flex items-center gap-1">
              <MoveHorizontal className="w-3.5 h-3.5 animate-pulse" />
              <span>Click & Drag or Swipe to pan around the room</span>
            </p>
          </div>

          {/* Compass direction indicator */}
          <div className="glass-refraction pointer-events-auto p-2.5 rounded-full border border-white/40 shadow-md flex items-center gap-2 text-white">
            <Compass
              className="w-5 h-5 text-secondary-container transition-transform"
              style={{ transform: `rotate(${-rotation * 0.4}deg)` }}
            />
            <span className="font-mono text-xs font-bold text-white/90">
              {Math.round(((rotation % imageWidth) / imageWidth) * 360)}° N
            </span>
          </div>
        </div>

        {/* Float Right: Zoom and Rotate controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {/* Play/Pause continuous automation rotation */}
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`p-2 rounded-xl border border-white/50 backdrop-blur-md shadow-md hover:scale-105 transition-all text-xs font-bold ${
              autoPlay ? "bg-secondary text-white" : "bg-white/95 text-secondary"
            }`}
            title={autoPlay ? "Pause Auto-rotation" : "Play Auto-rotation"}
          >
            {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Zoom controls */}
          <div className="bg-white/95 border border-white/40 rounded-xl shadow-md p-1 flex flex-col gap-1">
            <button
              onClick={() => adjustZoom(0.15)}
              className="p-1.5 rounded-lg hover:bg-secondary-container/40 text-secondary transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => adjustZoom(-0.15)}
              className="p-1.5 rounded-lg hover:bg-secondary-container/40 text-secondary transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Under-viewer metadata bar */}
      <div className="glass-refraction p-4 rounded-2xl border border-white/60 flex justify-between items-center text-xs">
        <span className="font-semibold text-secondary flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span>Simulation Active: Cylinder Texture projection</span>
        </span>
        <button
          onClick={() => setRotation(0)}
          className="font-label text-[10px] font-bold text-secondary hover:text-primary tracking-wider uppercase"
        >
          Reset Orientation
        </button>
      </div>
    </div>
  );
}
