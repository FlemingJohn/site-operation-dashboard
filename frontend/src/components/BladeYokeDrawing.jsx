const BladeYokeDrawing = () => (
  <svg className="equipment-drawing" viewBox="0 0 220 150" aria-hidden="true">
    <rect className="drawing-dark" x="105" y="6" width="10" height="34" />
    <path className="drawing-frame" d="M60 40 H160 L150 56 H70 Z" />
    <rect className="drawing-frame" x="66" y="56" width="16" height="64" rx="3" />
    <rect className="drawing-frame" x="138" y="56" width="16" height="64" rx="3" />
    <rect className="drawing-light" x="80" y="72" width="60" height="34" rx="17" />
    <path className="drawing-blade" d="M30 88 Q110 70 200 84" />
    <rect className="drawing-accent" x="62" y="116" width="24" height="10" rx="3" />
    <rect className="drawing-accent" x="134" y="116" width="24" height="10" rx="3" />
    <circle className="drawing-signal" cx="110" cy="6" r="5" />
  </svg>
);

export default BladeYokeDrawing;
