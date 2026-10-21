import BladeYokeDrawing from './BladeYokeDrawing';
import MobileRobotDrawing from './MobileRobotDrawing';
import TaglineSystemDrawing from './TaglineSystemDrawing';
import TowerGripperDrawing from './TowerGripperDrawing';

const DRAWINGS = {
  blade_yoke: BladeYokeDrawing,
  tower_gripper: TowerGripperDrawing,
  tagline_system: TaglineSystemDrawing,
  mobile_robot: MobileRobotDrawing,
};

const EquipmentDrawing = ({ type, size = 'medium' }) => {
  const Drawing = DRAWINGS[type] ?? BladeYokeDrawing;
  return (
    <span className={`equipment-drawing-frame equipment-drawing-${size}`}>
      <Drawing />
    </span>
  );
};

export default EquipmentDrawing;
