import { readFile } from 'node:fs/promises';
import { parse, SyntaxError } from './codegen/parser.js';
import type { PathLike } from 'node:fs';
import type { Program, Result } from './types.d.ts';

export async function parseFile(filename: PathLike): Promise<Result<Program>> {
  const input = await readFile(filename, { encoding: 'utf-8' });

  try {
    return {
      success: true,
      value: parse(input, { grammarSource: filename }) as Program,
    };
  } catch (exn: unknown) {
    if (exn instanceof SyntaxError) {
      return {
        success: false,
        error: exn.format([{ source: filename, text: input }])
      };
    } else {
      throw exn;
    }
  }
}
