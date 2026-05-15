# flowgraph-6502

Create flowgraphs for a variant of 6502 assembly. Also includes an interpreter for completeness.

# Running

Install dependencies with:

```
<js package manager> install
```

Run the interpreter with:

```
<js runtime> src/main.ts interpreter filename.s memory.bin
```

Run the flow graph generator with:

```
<js runtime> src/main.ts flowgraph filename.s output.svg
```

The flow graph will be stored in `output.svg`. Statistics about such graphs will be printed to the terminal.

Where `<js package manager>` is one of `npm`, `deno`, `bun`, `pnpm`, `ant`, etc and `<js runtime>` is one of `node`, `deno run -A`, `bun run`, `ant run`, etc.

# Syntax example

```asm
; Comment
label:
  instruction .label_argument, 1d, ffh, 72o, 00110110b, [10h], [10h+X], [10h+Y], A

;;; From `examples/print.s`
_start:
  ;; An infinite loop with break conditions. X is used as an accumulator
  ldx 0d
  loop_step:
    lda [0d + X]
    beq .loop_end
    jsr .write_byte
    inx
    beq .loop_end
    jmp .loop_step
  loop_end:
  ; Done. It terminates automatically
```

# Features and non-features

- `jsr` only to call the following primitives:
  - `.write_byte`: Outputs whatever is on register A to the console.
  - `.read_byte`: Reads a byte of user input and puts it into the A register.
  - `.read_uint8`: 
