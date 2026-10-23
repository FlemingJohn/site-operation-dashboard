import { useState } from 'react';
import { updateEquipment } from '../api/equipmentApi';
import { toEquipmentBody } from '../lib/toEquipmentBody';

export const useMoveToStock = (onMoved) => {
  const [isMoving, setIsMoving] = useState(false);
  const [error, setError] = useState('');

  const move = async (unit) => {
    setIsMoving(true);
    setError('');
    try {
      const moved = await updateEquipment(
        unit.id,
        toEquipmentBody({ ...unit, status: 'in_stock', siteId: null })
      );
      onMoved(moved);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsMoving(false);
    }
  };

  return { move, isMoving, error, clearError: () => setError('') };
};
