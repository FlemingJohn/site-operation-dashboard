import { ASSISTANT_RESIZE_STEP } from '../constants';

const GRIPS = {
  left: { label: 'Resize width', changes: { ArrowLeft: { width: 1 }, ArrowRight: { width: -1 } } },
  top: { label: 'Resize height', changes: { ArrowUp: { height: 1 }, ArrowDown: { height: -1 } } },
  topLeft: {
    label: 'Resize width and height',
    changes: {
      ArrowLeft: { width: 1 },
      ArrowRight: { width: -1 },
      ArrowUp: { height: 1 },
      ArrowDown: { height: -1 },
    },
  },
};

const ResizeGrip = ({ direction, size, onResize, onReset }) => {
  const { label, changes } = GRIPS[direction];

  const handleKeyDown = (event) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onReset();
      return;
    }
    const change = changes[event.key];
    if (!change) return;
    event.preventDefault();
    onResize({
      width: size.width + (change.width ?? 0) * ASSISTANT_RESIZE_STEP,
      height: size.height + (change.height ?? 0) * ASSISTANT_RESIZE_STEP,
    });
  };

  return (
    <div
      className={`resize-grip resize-grip-${direction}`}
      role="separator"
      tabIndex={0}
      aria-label={`${label}. Arrow keys resize, Home resets.`}
      aria-orientation={direction === 'top' ? 'horizontal' : 'vertical'}
      aria-valuenow={direction === 'top' ? size.height : size.width}
      onKeyDown={handleKeyDown}
      onDoubleClick={onReset}
      title="Drag to resize · double-click to reset"
    />
  );
};

export default ResizeGrip;
