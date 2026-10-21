const RADIUS = 11;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const FILL_BY_STATE = { later: 1, this_week: 0.4, late: 0.1 };

const HealthRing = ({ state }) => (
  <svg className={`health-ring health-ring-${state}`} viewBox="0 0 30 30" aria-hidden="true">
    <circle className="health-ring-track" cx="15" cy="15" r={RADIUS} />
    <circle
      className="health-ring-value"
      cx="15"
      cy="15"
      r={RADIUS}
      strokeDasharray={`${CIRCUMFERENCE * FILL_BY_STATE[state]} ${CIRCUMFERENCE}`}
      transform="rotate(-90 15 15)"
    />
  </svg>
);

export default HealthRing;
