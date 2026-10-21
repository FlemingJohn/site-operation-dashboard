const EmptyIllustration = () => (
  <svg className="empty-illustration" viewBox="0 0 120 80" aria-hidden="true">
    <path className="empty-illustration-top" d="M20 34 L60 18 L100 34 L60 50 Z" />
    <path className="empty-illustration-left" d="M20 34 V60 L60 76 V50 Z" />
    <path className="empty-illustration-right" d="M100 34 V60 L60 76 V50 Z" />
    <path className="empty-illustration-tape" d="M40 26 L80 42" />
  </svg>
);

export default EmptyIllustration;
