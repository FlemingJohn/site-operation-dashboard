const TaglineSystemDrawing = () => (
  <svg className="equipment-drawing" viewBox="0 0 220 150" aria-hidden="true">
    <rect className="drawing-frame" x="20" y="104" width="64" height="30" rx="5" />
    <circle className="drawing-accent" cx="52" cy="104" r="20" />
    <circle className="drawing-light" cx="52" cy="104" r="7" />
    <path className="drawing-rope" d="M52 84 L170 28" />
    <circle className="drawing-ring" cx="176" cy="26" r="12" />
    <rect className="drawing-dark" x="174" y="38" width="4" height="32" />
    <path className="drawing-metal" d="M150 70 Q176 82 202 70 L196 92 H156 Z" />
    <circle className="drawing-dark" cx="40" cy="134" r="6" />
    <circle className="drawing-dark" cx="68" cy="134" r="6" />
  </svg>
);

export default TaglineSystemDrawing;
