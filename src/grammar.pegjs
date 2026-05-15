Program = _ @Statement|.., _| _ !.

//// Statements

Statement = LabelDefinition / Instruction

LabelDefinition = name:Identifier ':' {
  return {is: 'label', name};
}

Instruction = mnemonic:Identifier args:(' ' @Argument|.., ',' _|)? {
  return {is: 'instruction', mnemonic, args: args ?? []};
}

//// Arguments

Argument = LabelArgument / LiteralArgument / PointerArgument / AccumulatorArgument

AccumulatorArgument = 'A' {
  return {is: 'accumulator'};
}

LabelArgument = '.' name:Identifier {
  return {is: 'label', name}
}

PointerArgument = '[' _? base:Number _? offset:('+' _? @[XY])? _? ']' {
  return {is: 'pointer', base, offset: offset ?? null};
}

LiteralArgument = value:Number {
  return {is: 'literal', value}
}

/// Numbers

Number = HexadecimalNumber / DecimalNumber / OctalNumber / BinaryNumber

HexadecimalNumber = value:[0-9a-fA-F]+ 'h' {
  return parseInt(value, 16);
}

DecimalNumber = value:[0-9]+ 'd' {
  return parseInt(value, 10)
}

OctalNumber = value:[0-7]+ 'o' {
  return parseInt(value, 8);
}

BinaryNumber = value:[01]+ 'b' {
  return parseInt(value, 2);
}

//// General helpers

Identifier = [a-z_][a-z0-9_]* {
  return text();
}

_ = (Space / Comment)+
Space = [\n\t ]+
Comment = ';' [^\n]*
