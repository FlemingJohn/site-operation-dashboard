import ConfirmMoveCard from '../components/ConfirmMoveCard';
import MachineCardsCard from '../components/MachineCardsCard';
import MarkServiceDoneCard from '../components/MarkServiceDoneCard';
import ReorderPartCard from '../components/ReorderPartCard';
import StockRowsCard from '../components/StockRowsCard';
import { confirmMoveSchema } from '../validation/confirmMoveSchema';
import { machineCardsSchema } from '../validation/machineCardsSchema';
import { markServiceDoneSchema } from '../validation/markServiceDoneSchema';
import { reorderPartSchema } from '../validation/reorderPartSchema';
import { stockRowsSchema } from '../validation/stockRowsSchema';

export const CARD_REGISTRY = {
  machineCards: { component: MachineCardsCard, schema: machineCardsSchema },
  stockRows: { component: StockRowsCard, schema: stockRowsSchema },
  markServiceDone: { component: MarkServiceDoneCard, schema: markServiceDoneSchema },
  reorderPart: { component: ReorderPartCard, schema: reorderPartSchema },
  confirmMove: { component: ConfirmMoveCard, schema: confirmMoveSchema },
};
