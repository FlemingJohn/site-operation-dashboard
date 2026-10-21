const MobileRobotDrawing = () => (
  <svg className="equipment-drawing" viewBox="0 0 220 150" aria-hidden="true">
    <rect className="drawing-frame" x="40" y="96" width="140" height="32" rx="8" />
    <circle className="drawing-dark" cx="64" cy="132" r="10" />
    <circle className="drawing-dark" cx="156" cy="132" r="10" />
    <rect className="drawing-accent" x="96" y="74" width="28" height="22" rx="4" />
    <path className="drawing-arm" d="M110 74 L132 40 L170 30" />
    <circle className="drawing-signal" cx="132" cy="40" r="7" />
    <path className="drawing-claw" d="M170 30 l14 -6 M170 30 l14 8" />
    <rect className="drawing-mint" x="54" y="104" width="30" height="6" rx="3" />
  </svg>
);

export default MobileRobotDrawing;
