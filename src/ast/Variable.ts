import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';

/**
  Representación de usos de variable en expresiones.
*/
export class Variable implements Exp {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  toString(): string {
    return `Variable(${this.id})`;
  }

  unparse(): string {
    return this.id;
  }

  compileCIL(context: CompilationContext): CompilationContext {
    var index = context.getVar(this.id);
    context.appendInstruction("ldloc " + index);
    return context;
  }

  maxStackIL(value: number): number {
    return value + 1;
  }
}
