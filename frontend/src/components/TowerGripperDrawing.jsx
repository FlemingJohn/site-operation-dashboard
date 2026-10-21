const TowerGripperDrawing = () => (
  <svg className="equipment-drawing" viewBox="0 0 220 150" aria-hidden="true">
    <rect className="drawing-light" x="96" y="4" width="28" height="142" rx="4" />
    <rect className="drawing-metal" x="104" y="4" width="12" height="142" />
    <rect className="drawing-frame" x="60" y="56" width="100" height="38" rx="6" />
    <rect className="drawing-accent" x="48" y="62" width="16" height="26" rx="3" />
    <rect className="drawing-accent" x="156" y="62" width="16" height="26" rx="3" />
    <rect className="drawing-frame-light" x="70" y="66" width="80" height="18" rx="9" />
    <circle className="drawing-signal" cx="84" cy="75" r="4" />
    <circle className="drawing-signal" cx="136" cy="75" r="4" />
    <rect className="drawing-dark" x="108" y="36" width="4" height="20" />
  </svg>
);

export default TowerGripperDrawing;
