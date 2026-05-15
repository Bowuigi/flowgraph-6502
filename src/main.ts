import { open, readFile } from "node:fs/promises";
import { parseFile } from "./driver.ts";
import { PathLike } from "node:fs";
import type { CPUState, Result } from "./types.d.ts";

async function getMemory(filename: PathLike): Promise<Result<Uint8Array>> {
  let memory = Uint8Array.from({ length: 65535 }, _ => 0);
  let buffer = Buffer.alloc(memory.byteLength, 0);

  try {
    const fd = await open(filename, 'r');
    await fd.read(buffer, 0, memory.byteLength, 0);
  } catch (exn: unknown) {
    if (exn instanceof Error) {
      return { success: false, error: exn.message };
    }
  }

  memory.set(buffer, 0);
  return { success: true, value: memory };
}

async function main() {
  const [_node, _script, assemblyFile, memoryFile] = process.argv;

  const assembly = await parseFile(assemblyFile);
  const memory = await getMemory(memoryFile);

  if (!assembly.success) {
    console.error('While processing assembly file:');
    console.error(assembly.error);
    return;
  }

  if (!memory.success) {
    console.error('While processing memory file:');
    console.error(memory.error);
    return;
  }

  let labels: Record<string, number> = {};
  for (const [ix, stmt] of assembly.value.entries()) {
    if (stmt.is === 'label') {
      labels[stmt.name] = ix;
    }
  }

  let state: CPUState = {
    registers: {A: 0, X: 0, Y: 0},
    flags: {negative: false, overflow: false, zero: false, carry: false},
    memory: memory.value,
    labels
  };

  console.log(assembly, state);
}
main();
