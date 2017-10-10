import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';

/**
  Representación de valores de verdad (cierto o falso).
*/
export class TruthValue implements Exp {

  value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }

  toString(): string {
    return `TruthValue(${this.value})`;
  }

  unparse(): string {
    return this.value ? "true" : "false";
  }

  compileCIL(context: CompilationContext): CompilationContext {
    this.value
    ? context.appendInstruction("ldc.i4.1")
    : context.appendInstruction("ldc.i4.0")
    return context;
  }

  maxStackIL(value: number): number {
    return value + 1;
  }
}
