import { VargaDefinition } from './types';
import { D1Definition } from './d1';
import { D2Definition } from './d2';
import { D3Definition } from './d3';
import { D4Definition } from './d4';
import { D5Definition } from './d5';
import { D6Definition } from './d6';
import { D7Definition } from './d7';
import { D9Definition } from './d9';
import { D10Definition } from './d10';
import { D12Definition } from './d12';
import { D16Definition } from './d16';
import { D20Definition } from './d20';
import { D24Definition } from './d24';
import { D27Definition } from './d27';
import { D30Definition } from './d30';
import { D40Definition } from './d40';
import { D45Definition } from './d45';
import { D60Definition } from './d60';

export const ALL_VARGAS: Record<string, VargaDefinition> = {
  D1: D1Definition,
  D2: D2Definition,
  D3: D3Definition,
  D4: D4Definition,
  D5: D5Definition,
  D6: D6Definition,
  D7: D7Definition,
  D9: D9Definition,
  D10: D10Definition,
  D12: D12Definition,
  D16: D16Definition,
  D20: D20Definition,
  D24: D24Definition,
  D27: D27Definition,
  D30: D30Definition,
  D40: D40Definition,
  D45: D45Definition,
  D60: D60Definition,
};

export const VARGA_ORDER: string[] = [
  'D1', 'D2', 'D3', 'D4', 'D5', 'D6',
  'D7', 'D9', 'D10', 'D12', 'D16', 'D20',
  'D24', 'D27', 'D30', 'D40', 'D45', 'D60'
];

export function getVargaDefinition(id: string): VargaDefinition {
  const v = ALL_VARGAS[id];
  if (!v) {
    throw new Error(`Unsupported Varga chart identifier: ${id}`);
  }
  return v;
}
