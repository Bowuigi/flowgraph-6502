import { readSync } from "node:fs";
import type { CPUState, Flags, InstructionArgument } from "./types.d.ts";
import { stdin, stdout } from "node:process";
import * as readline from 'node:readline/promises';

export class IllegalInstruction {
  name = 'IllegalInstruction' as const;
  msg: string;
  constructor(mnemonic: string) {
    this.msg = `Illegal instruction: ${mnemonic}`;
  }
}

export class OperationUnsupported {
  name = 'OperationUnsupported' as const;
  msg: string;
  constructor(msg: string) {
    this.msg = `Operation unsupported: Attempted to ${msg}`;
  }
}

export function extractNumericValue(arg: InstructionArgument, state: CPUState): number {
  switch (arg.is) {
    case 'literal':
      return arg.value;
    case 'accumulator':
      return state.registers.A;
    case 'pointer': {
      if (arg.offset === null) {
        return state.memory[arg.base];
      } else {
        return state.memory[arg.base + state.registers[arg.offset]];
      }
    }
    case 'label':
      throw new OperationUnsupported(`Attempted to extract numeric value from label ${arg.name}`);
  }
}

export function expectLabel(arg: InstructionArgument): string {
  switch (arg.is) {
    case 'label':
      return arg.name;
    default:
      throw new OperationUnsupported(`extract program position from ${arg.is} (only labels are supported)`);
  }
}

export function setNegativeAndZero(value: number, flags: Flags) {
  flags.negative = (value & 0x80) !== 0;
  flags.zero = (value & 0xFF) === 0;
}

export function primReadByte(state: CPUState): void {
  if (state.input_exhausted) {
    state.flags.carry = true;
    state.registers.A = 0;
    setNegativeAndZero(0, state.flags);
    return;
  }

  const buf: Buffer | null = stdin.read(1);
  if (buf === null) {
    state.flags.carry = true;
    state.registers.A = 0;
  } else {
    state.flags.carry = false;
    state.registers.A = buf.readUInt8(0);
  }
  setNegativeAndZero(state.registers.A, state.flags);
}

export function primWriteByte(state: CPUState): void {
  stdout.write(Uint8Array.from([state.registers.A]));
}

export async function primReadUInt8(state: CPUState): Promise<void> {
  state.flags.carry = false;
  const rl = readline.createInterface({ input: stdin });

  for await (const line of rl) {
    rl.close();
    const num = parseInt(line, 10);
    state.registers.A = num;

    if (isNaN(num)) {
      state.registers.A = 0;
      state.flags.carry = true;
    }

    setNegativeAndZero(state.registers.A, state.flags);
  }

  state.registers.A = 0;
  state.flags.carry = true;
  setNegativeAndZero(0, state.flags);
}

export function primWriteUInt8(state: CPUState) {
  stdout.write(state.registers.A.toString(10));
}
