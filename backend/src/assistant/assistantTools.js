import { getEquipmentTool } from './tools/getEquipmentTool.js';
import { getSummaryTool } from './tools/getSummaryTool.js';
import { getTechnicianWorkloadTool } from './tools/getTechnicianWorkloadTool.js';
import { listInstallationsTool } from './tools/listInstallationsTool.js';
import { listLowStockPartsTool } from './tools/listLowStockPartsTool.js';
import { listServiceDueTool } from './tools/listServiceDueTool.js';
import { searchActivityTool } from './tools/searchActivityTool.js';
import { searchSitesTool } from './tools/searchSitesTool.js';

const TOOLS = [
  getSummaryTool,
  searchSitesTool,
  listInstallationsTool,
  getTechnicianWorkloadTool,
  listServiceDueTool,
  getEquipmentTool,
  listLowStockPartsTool,
  searchActivityTool,
];

export const TOOL_DECLARATIONS = TOOLS.map((tool) => tool.declaration);

export const TOOLS_BY_NAME = Object.fromEntries(TOOLS.map((tool) => [tool.declaration.name, tool]));
