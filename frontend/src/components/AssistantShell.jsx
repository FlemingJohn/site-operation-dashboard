import { Resizable } from 're-resizable';
import { ASSISTANT_MAX_SHARE, ASSISTANT_MIN_SIZE } from '../constants';
import { useAssistantSize } from '../hooks/useAssistantSize';
import ResizeGrip from './ResizeGrip';

const RESIZE_EDGES = { left: true, top: true, topLeft: true };
const MAX_WIDTH = `${ASSISTANT_MAX_SHARE * 100}vw`;
const MAX_HEIGHT = `${ASSISTANT_MAX_SHARE * 100}vh`;

const AssistantShell = ({ layout, children }) => {
  const { size, saveSize, resetSize } = useAssistantSize();

  if (layout !== 'window') {
    return <div className={`assistant-shell assistant-shell-${layout}`}>{children}</div>;
  }

  const grip = (direction) => (
    <ResizeGrip direction={direction} size={size} onResize={saveSize} onReset={resetSize} />
  );

  return (
    <Resizable
      className="assistant-shell"
      size={size}
      minWidth={ASSISTANT_MIN_SIZE.width}
      minHeight={ASSISTANT_MIN_SIZE.height}
      maxWidth={MAX_WIDTH}
      maxHeight={MAX_HEIGHT}
      enable={RESIZE_EDGES}
      handleComponent={{ left: grip('left'), top: grip('top'), topLeft: grip('topLeft') }}
      handleClasses={{ left: 'resize-edge', top: 'resize-edge', topLeft: 'resize-edge' }}
      onResizeStop={(event, direction, element) =>
        saveSize({ width: element.offsetWidth, height: element.offsetHeight })
      }
    >
      {children}
    </Resizable>
  );
};

export default AssistantShell;
