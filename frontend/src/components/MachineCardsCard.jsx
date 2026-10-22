import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Link, Typography } from '@mui/material';
import { EQUIPMENT_TYPE_LABELS } from '../constants';
import { getToday } from '../utils';
import EquipmentDrawing from './EquipmentDrawing';
import MarkServiceDoneCard from './MarkServiceDoneCard';
import SeeAllLink from './SeeAllLink';
import ServiceDueLine from './ServiceDueLine';

const MachineCardsCard = ({ machines, total, seeAll, onOpenRecord }) => {
  const [chosen, setChosen] = useState(null);

  return (
    <>
      <ul className="assistant-machines">
        {machines.map((machine) => (
          <li key={machine.id} className="assistant-machine">
            <EquipmentDrawing type={machine.type} size="small" />
            <div className="assistant-machine-text">
              <Link
                component={RouterLink}
                to={`/equipment/${machine.id}`}
                onClick={onOpenRecord}
                className="text-strong"
              >
                {machine.serial}
              </Link>
              <Typography variant="caption" color="text.secondary" noWrap>
                {EQUIPMENT_TYPE_LABELS[machine.type]} · {machine.siteName ?? 'In the warehouse'}
              </Typography>
              <ServiceDueLine unit={machine} variant="caption" />
            </div>
            <Button
              size="small"
              variant="outlined"
              disabled={Boolean(chosen)}
              onClick={() => setChosen(machine)}
            >
              Mark as done
            </Button>
          </li>
        ))}
      </ul>
      <SeeAllLink
        shown={machines.length}
        total={total ?? machines.length}
        seeAll={seeAll}
        onOpenRecord={onOpenRecord}
      />
      {chosen && (
        <MarkServiceDoneCard
          machine={chosen}
          doneOn={getToday()}
          technicianId={null}
          notes=""
          onOpenRecord={onOpenRecord}
        />
      )}
    </>
  );
};

export default MachineCardsCard;
