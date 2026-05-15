;; A simple `cat` clone, reading a file from stdin and outputting it to stdout

_start:
  jsr .read_byte
  bcs .end
  jsr .write_byte
  jmp .start
  end: ; Halt on EOF
