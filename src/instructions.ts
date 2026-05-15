import * as H from './util.ts';
import { expectLabel } from './util.ts';
import { stdin, stdout } from 'node:process';
import type { Instruction } from './types.d.ts';
import { readSync } from 'node:fs';
import { readlink } from 'node:fs/promises';
import * as readline from 'node:readline/promises';
import { isatty } from 'node:tty';

export const instructions: Record<string, Instruction> = {
  //// Branching operations
  
  // Jump to subroutine. Flags N, Z, C (depending on primitive called)
  async jsr(state, args, _goto) {
    const primitive = H.expectLabel(args[0]);
    switch (primitive) {
      case 'read_byte': return H.primReadByte(state);
      case 'write_byte': return H.primWriteByte(state);
      case 'read_uint8': return await H.primReadUInt8(state);
      case 'write_uint8': return H.primWriteUInt8(state);
      default: throw new H.OperationUnsupported(`Unsupported primitive ${primitive}`);
    }
  },
  // Unconditional jump. No flags
  jmp(state, args, goto) {
    const label = expectLabel(args[0]);
    goto(label);
  },
  // Branch if carry clear. No flags
  bcc(state, args, goto) {
  },
  // Branch if carry set. No flags
  bcs(state, args, goto) {
  },
  // Branch if equal. No flags
  beq(state, args, goto) {
  },
  // Branch if not equal. No flags
  bne(state, args, goto) {
  },
  // Branch if plus. No flags
  bpl(state, args, goto) {
  },
  // Branch if minus. No flags
  bmi(state, args, goto) {
  },
  // Branch if overflow clear. No flags
  bvc(state, args, goto) {
  },
  // Branch if overflow set. No flags
  bvs(state, args, goto) {
  },

  //// Bit operations

  // Test bits. Flags N, V, Z
  bit(state, args, _goto) {
  },
  // Logical AND. Flags N, Z
  and(state, args, _goto) {
  },
  // Exclusive OR with memory. Flags N, Z
  eor(state, args, _goto) {
  },
  // Logical OR with memory. Flags N, Z
  ora(state, args, _goto) {
  },
  // Arithmetic shift left. Flags N, Z, C
  asl(state, args, _goto) {
  },
  // Logical shift right. Flags N, Z, C
  lsr(state, args, _goto) {
  },
  // Rotate left. Flags N, Z, C
  rol(state, args, _goto) {
  },
  // Rotate right. Flags N, Z, C
  ror(state, args, _goto) {
  },

  //// Arithmetic operations

  // Add with carry. Flags N, V, Z, C
  adc(state, args, _goto) {
  },
  // Subtract with carry. Flags N, V, Z, C
  sbc(state, args, _goto) {
  },

  //// Comparison operations
  
  // Compare accumulator. Flags N, Z, C
  cmp(state, args, _goto) {
  },
  // Compare X register. Flags N, Z, C
  cpx(state, args, _goto) {
  },
  // Compare Y register. Flags N, Z, C
  cpy(state, args, _goto) {
  },

  //// Increment and decrement operations

  // Increment memory. Flags N, Z
  inc(state, args, _goto) {
  },
  // Increment X register. Flags N, Z
  inx(state, args, _goto) {
  },
  // Increment Y register. Flags N, Z
  iny(state, args, _goto) {
  },
  // Decrement memory. Flags N, Z
  dec(state, args, _goto) {
  },
  // Decrement X register. Flags N, Z
  dex(state, args, _goto) {
  },
  // Decrement Y register. Flags N, Z
  dey(state, args, _goto) {
  },

  //// Load and store operations

  // Load accumulator from memory. Flags N, Z
  lda(state, args, _goto) {
  },
  // Load X register from memory. Flags N, Z
  ldx(state, args, _goto) {
  },
  // Load Y register from memory. Flags N, Z
  ldy(state, args, _goto) {
  },
  // Store accumulator to memory. No flags
  sta(state, args, _goto) {
  },
  // Store X register to memory. No flags
  stx(state, args, _goto) {
  },
  // Store Y register to memory. No flags
  sty(state, args, _goto) {
  },

  //// Transfer operations

  // Transfer accumulator to X
  tax(state, args, _goto) {
  },
  // Transfer accumulator to Y
  tay(state, args, _goto) {
  },
  // Transfer X to accumulator
  txa(state, args, _goto) {
  },
  // Transfer Y to accumulator
  tya(state, args, _goto) {
  },

  //// Flag set/clear operations

  // Clear carry flag. Flags C
  clc(state, args, _goto) {
  },
  // Clear overflow flag. Flags V
  clv(state, args, _goto) {
  },
  // Set carry flag. Flags C
  sec(state, args, _goto) {
  },
  // Set overflow flag. Flags V
  sev(state, args, _goto) {
  },

  //// No operation

  // No operation. No flags
  nop(state, args, _goto) {
  },

  // Unsupported: brk, rti, cld, cli, jsr to user-defined labels, rts, pha, pla, php, plp, sed, sei, tsx, txs
}
