import { logger } from '../utils/logger.js';
import { TOOLS_BY_NAME } from './assistantTools.js';

const UNKNOWN_TOOL = { error: 'There is no tool with that name.' };
const FAILED_TOOL = { error: 'This lookup failed.' };

const toFunctionResponse = (call, response) => ({
  functionResponse: { id: call.id, name: call.name, response },
});

export const runTool = async (call, send) => {
  const tool = TOOLS_BY_NAME[call.name];
  if (!tool) return { part: toFunctionResponse(call, UNKNOWN_TOOL), records: [], source: null };

  send({ type: 'step', label: tool.stepLabel });
  try {
    const { response, records = [], summary } = await tool.run(call.args);
    const source = summary ? { tool: call.name, summary } : null;
    return { part: toFunctionResponse(call, response), records, source };
  } catch (error) {
    logger.error({ err: error, tool: call.name }, 'Assistant tool failed');
    return { part: toFunctionResponse(call, FAILED_TOOL), records: [], source: null };
  }
};
