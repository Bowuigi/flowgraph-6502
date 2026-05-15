;;; Printing demo. Loads up to the first 0 zero value or until length 255 is reached

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
