;;; Simple loop

_start:
  lda 1d
  loop:
    txa
    jsr .write_uint8
    lda 20h ; Space
    jsr .write_byte
    inx
    cpx 6d
    bne .loop
  end: ;; Exit when X = 6
