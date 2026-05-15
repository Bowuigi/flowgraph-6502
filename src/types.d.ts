//// General

export type Result<T> =
  | { success: false, error: string }
  | { success: true, value: T };

//// Program AST

export type Program = Array<Statement>;

export type Statement =
  | { is: 'label', name: string }
  | { is: 'instruction', mnemonic: string, args: Array<InstructionArgument> };

export type InstructionArgument =
  | { is: 'label', name: string } // For identifying absolute jumps
  | { is: 'accumulator' } // For identifying the accumulator addressing mode
  | { is: 'literal', value: number } // Immediate and friends addressing mode
  | { is: 'pointer', base: number, offset: 'X' | 'Y' } // Absolute and friends addressing modes

//// Instruction management

export type Instruction =
  (
    state: CPUState,
    args: Array<InstructionArgument>,
    goto: (label: string) => void
  ) => void;

/// 6502 simulation

export interface CPUState {
  registers: Registers;
  flags: Flags;
  /** Addressable using 16bit pointers */
  memory: Uint8Array;
  /** Fake memory location markers; this is not handled like in a normal assembler */
  labels: Array<string>;
}

export interface Registers {
  /** 0..255 */ A: number;
  /** 0..255 */ X: number;
  /** 0..255 */ Y: number;
}

export interface Flags {
  negative: boolean;
  overflow: boolean;
  zero: boolean;
  carry: boolean;
}
