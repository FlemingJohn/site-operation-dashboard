import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { getToday } from '../utils';
import MachineLink from './MachineLink';
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
            <MachineLink unit={machine} onOpen={onOpenRecord}>
              <Typography variant="caption" color="text.secondary" noWrap>
                {machine.siteName ?? 'In the warehouse'}
              </Typography>
              <ServiceDueLine unit={machine} variant="caption" />
            </MachineLink>
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
