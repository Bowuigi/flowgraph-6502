# flowgraph-6502 Assembly Programming Skill

## Overview

flowgraph-6502 is a simplified dialect of 6502 assembly designed for control flow analysis and interpretation. It omits many complex features of real 6502 hardware (no stack, no interrupts, no self-modifying code) to focus on core logic and branching patterns.

**Key differences from standard 6502:**
- No stack operations (no `pha`, `pla`, `php`, `plp`, `rts`, `rti`)
- No transfer register instructions (`tsx`, `txs`)
- `jsr` only calls built-in primitives, not user-defined subroutines
- No `org`, `db`, `dw`, or other assembler directives
- No indirect addressing modes
- Labels are referenced with a `.` prefix (e.g., `.my_label`)

---

## Syntax

### Comments
```asm
; Single-line comment
;; Double semicolon for section comments
;;; Triple semicolon for file-level comments
```

### Labels
```asm
label_name:      ; Define a label
  jmp .label_name   ; Reference with . prefix
```

Label names use alphanumeric characters and underscores. The `.` prefix is **required** when referencing labels as operands.

### Numeric Literals

All numbers require a base suffix:

| Suffix | Base     | Example       | Value |
|--------|----------|---------------|-------|
| `d`    | Decimal  | `42d`         | 42    |
| `h`    | Hex      | `FFh`         | 255   |
| `o`    | Octal    | `72o`         | 58    |
| `b`    | Binary   | `00110110b`   | 54    |

### Register References

Use `A` to reference the accumulator in instructions that operate on it directly (e.g., `asl A`).

---

## Addressing Modes

| Mode | Syntax | Example | Description |
|------|--------|---------|-------------|
| Immediate | `value` | `lda 42d` | Literal value |
| Zero Page | `[addr]` | `lda [10h]` | 8-bit address |
| Zero Page,X | `[addr+X]` | `lda [10h+X]` | 8-bit address + X |
| Zero Page,Y | `[addr+Y]` | `ldx [10h+Y]` | 8-bit address + Y |
| Absolute | `[addr]` | `lda [1000h]` | 16-bit address |
| Absolute,X | `[addr+X]` | `lda [1000h+X]` | 16-bit address + X |
| Absolute,Y | `[addr+Y]` | `lda [1000h+Y]` | 16-bit address + Y |
| Accumulator | `A` | `asl A` | Operate on accumulator directly |

**Note:** Zero Page and Absolute use the same bracket syntax; the assembler distinguishes them by value size.

---

## Addressing Mode Extension Rule

Any instruction that supports **Immediate**, **Zero Page**, and **Absolute** addressing modes automatically supports **all 8 modes**: Immediate, Zero Page, Zero Page,X, Zero Page,Y, Absolute, Absolute,X, Absolute,Y, and Accumulator. This is an implementation extension that simplifies programming — you don't need to check which specific modes each instruction supports.

Instructions marked with `All` in the tables below support all 8 modes. Instructions with specific mode listings do not qualify for this extension (they lack Immediate, or are inherently restricted like branches, transfers, and flag operations).

---

## Registers & Flags

### Registers (all 8-bit)

| Register | Name | Typical Use |
|----------|------|-------------|
| `A` | Accumulator | Arithmetic, logic, I/O |
| `X` | Index Register | Loop counters, indexing |
| `Y` | Index Register | Loop counters, indexing |

### Processor Flags

| Flag | Name | Set When |
|------|------|----------|
| `C` | Carry | Arithmetic overflow/underflow, comparison result |
| `Z` | Zero | Result is zero |
| `N` | Negative | Result has bit 7 set (value > 127) |
| `V` | Overflow | Signed arithmetic overflow |

---

## Instruction Quick Reference

### Load / Store

| Instruction | Description | Modes | Flags |
|-------------|-------------|-------|-------|
| `lda` | Load A from memory | All | Z, N |
| `ldx` | Load X from memory | All | Z, N |
| `ldy` | Load Y from memory | All | Z, N |
| `sta` | Store A to memory | ZP, ZP,X, ZP,Y, Abs, Abs,X, Abs,Y | - |
| `stx` | Store X to memory | ZP, ZP,X, ZP,Y, Abs, Abs,X, Abs,Y | - |
| `sty` | Store Y to memory | ZP, ZP,X, ZP,Y, Abs, Abs,X, Abs,Y | - |

### Transfer Between Registers

| Instruction | Description | Flags |
|-------------|-------------|-------|
| `tax` | A → X | Z, N |
| `tay` | A → Y | Z, N |
| `txa` | X → A | Z, N |
| `tya` | Y → A | Z, N |

### Arithmetic

| Instruction | Description | Modes | Flags |
|-------------|-------------|-------|-------|
| `adc` | A = A + mem + C | All | C, Z, V, N |
| `sbc` | A = A - mem - !C | All | C, Z, V, N |
| `inc` | mem = mem + 1 | ZP, ZP,X, ZP,Y, Abs, Abs,X, Abs,Y | Z, N |
| `inx` | X = X + 1 | Implied | Z, N |
| `iny` | Y = Y + 1 | Implied | Z, N |
| `dec` | mem = mem - 1 | ZP, ZP,X, ZP,Y, Abs, Abs,X, Abs,Y | Z, N |
| `dex` | X = X - 1 | Implied | Z, N |
| `dey` | Y = Y - 1 | Implied | Z, N |

### Logic & Shifts

| Instruction | Description | Modes | Flags |
|-------------|-------------|-------|-------|
| `and` | A = A & mem | All | Z, N |
| `ora` | A = A \| mem | All | Z, N |
| `eor` | A = A ^ mem | All | Z, N |
| `asl` | Shift left (×2), bit 7 → C | A, ZP, ZP,X, ZP,Y, Abs, Abs,X, Abs,Y | C, Z, N |
| `lsr` | Shift right (÷2), bit 0 → C | A, ZP, ZP,X, ZP,Y, Abs, Abs,X, Abs,Y | C, Z, N |
| `rol` | Rotate left through C | A, ZP, ZP,X, ZP,Y, Abs, Abs,X, Abs,Y | C, Z, N |
| `ror` | Rotate right through C | A, ZP, ZP,X, ZP,Y, Abs, Abs,X, Abs,Y | C, Z, N |
| `bit` | Test bits, Z = A & mem, N/V from mem bits 7/6 | ZP, Abs | Z, V, N |

### Compare

| Instruction | Description | Modes | Flags |
|-------------|-------------|-------|-------|
| `cmp` | Compare A with mem | All | C, Z, N |
| `cpx` | Compare X with mem | All | C, Z, N |
| `cpy` | Compare Y with mem | All | C, Z, N |

Compare sets flags as if performing `register - mem`:
- C=1 if register >= mem, C=0 if register < mem
- Z=1 if register == mem
- N=1 if result is negative (register < mem as signed)

### Branch & Jump

| Instruction | Description | Condition |
|-------------|-------------|-----------|
| `jmp` | Unconditional jump | Always |
| `beq` | Branch if Z=1 | Equal / Zero |
| `bne` | Branch if Z=0 | Not equal / Non-zero |
| `bpl` | Branch if N=0 | Positive |
| `bmi` | Branch if N=1 | Negative |
| `bcc` | Branch if C=0 | Carry clear / Below |
| `bcs` | Branch if C=1 | Carry set / Above or equal |
| `bvc` | Branch if V=0 | Overflow clear |
| `bvs` | Branch if V=1 | Overflow set |

All branches and `jmp` take a label reference: `jmp .target_label`

### Flag Control

| Instruction | Effect |
|-------------|--------|
| `clc` | Clear carry (C=0) |
| `sec` | Set carry (C=1) |
| `clv` | Clear overflow (V=0) |

### Other

| Instruction | Description |
|-------------|-------------|
| `nop` | No operation |
| `jsr` | Call a primitive (see below) |

---

## Primitives (jsr)

`jsr` can only call these four built-in primitives. They do not return via `rts` — execution continues at the next instruction.

### `.read_byte`
Reads a single byte from user input into A.

| Writes | Condition |
|--------|-----------|
| A | Byte read (0 on EOF or NUL) |
| Z=1 | Byte was NUL (0) |
| N=1 | Byte > 127 |
| C=1 | EOF encountered |

### `.write_byte`
Outputs the byte in A to the console.

| Reads | Description |
|-------|-------------|
| A | Byte to output |

### `.read_uint8`
Reads an unsigned 8-bit integer from user input into A.

| Writes | Condition |
|--------|-----------|
| A | Number read (0 if zero or EOF) |
| Z=1 | Number was zero |
| N=1 | Number > 127 |
| C=1 | EOF or invalid input |

### `.write_uint8`
Outputs A as a decimal number to the console.

| Reads | Description |
|-------|-------------|
| A | Number to output (0-255) |

---

## Limitations

- **No stack** — cannot use `pha`, `pla`, `php`, `plp`, `rts`, `rti`, `tsx`, `txs`
- **No macros** — no `macro`/`endm` directives
- **No indirect addressing** — `(addr)`, `(addr,X)`, `(addr),Y` are not supported
- **No dynamic jumps** — all jump/branch targets must be statically known labels
- **No self-modifying code** — code and data memory are separate
- **No decimal mode** — BCD arithmetic not available
- **No interrupts** — no `brk`, `irq`, `nmi` handling
- **No assembler directives** — no `org`, `db`, `dw`, `ds`, etc.
- **No binary output** — this is an analysis/interpretation tool, not an assembler

---

## Common Patterns

### Loop with Counter

```asm
_start:
  ldx 10d          ; Counter = 10
loop:
  ; ... body ...
  dex
  bne .loop        ; Repeat while X != 0
done:
```

### Iterate Over Memory (Zero-Terminated String)

```asm
_start:
  ldx 0d           ; Index = 0
read_loop:
  lda [0d+X]       ; Load byte at index
  beq .end         ; Stop on zero byte
  jsr .write_byte  ; Process byte
  inx
  bne .read_loop   ; Continue (wraps at 255)
end:
```

### Conditional (If/Else)

```asm
  lda [value]
  cmp 50d
  bcs .greater_or_equal
  ; A < 50 path
  jmp .after_if
greater_or_equal:
  ; A >= 50 path
after_if:
```

### Read Input Until EOF

```asm
_start:
read_loop:
  jsr .read_byte
  bcs .done        ; EOF
  jsr .write_byte  ; Echo input
  jmp .read_loop
done:
```

### Multi-Byte Addition (16-bit)

```asm
; Add 16-bit value at [lo],[hi] to 16-bit accumulator in A:X
; Low byte in A, high byte in X
  clc
  adc [lo]         ; Add low byte with carry
  tax              ; Save low byte result in X
  lda [hi]
  adc [hi+1d]      ; Add high byte with carry from low
  ; Result: high byte in A, low byte in X
```

### Bit Testing

```asm
  lda [flags]
  and 01h          ; Test bit 0
  beq .bit_clear
  ; Bit 0 is set
bit_clear:
```

### Absolute Value

```asm
  lda [value]
  bpl .positive    ; Skip if already positive
  eor FFh          ; Invert bits (one's complement)
  adc 1d           ; Add 1 (two's complement)
positive:
  ; A now holds |value|
```

---

## Complete Example: Character Counter

Reads characters from input and counts them, then outputs the count.

```asm
;;; Character counter - reads input until EOF and prints the count

_start:
  ldx 0d           ; Initialize counter in X

read_loop:
  jsr .read_byte   ; Read next byte
  bcs .done        ; Branch if EOF (carry set)
  inx              ; Increment counter
  bne .read_loop   ; Continue if not overflowed
  ; If X overflows (256+ chars), we lose count
  ; For a real program, you'd use a 16-bit counter

done:
  txa              ; Move count to A
  jsr .write_uint8 ; Print the count
  ; Program ends automatically
```

---

## Tips for Writing Correct Code

1. **Always initialize registers** before using them — they start at unknown values
2. **Use `clc` before `adc`** if you don't want the previous carry to affect addition
3. **Use `sec` before `sbc`** if you want a clean subtraction without borrow
4. **Branch instructions can jump anywhere** — Contrary to 6502 assembly, the only difference between `jmp` and the other branch instructions is the condition.
5. **Flags are fragile** — most instructions modify flags. Don't assume flag state across instructions
6. **Label references need `.`** — `jmp label` is invalid; use `jmp .label`
7. **No return from primitives** — `jsr .write_byte` does not push a return address; execution continues on the next line
8. **Memory is external** — the program code is separate from the RAM you read/write with `lda`/`sta`
9. **User-defined functions are not supported** — Inline them if possible or use a preprocessor
