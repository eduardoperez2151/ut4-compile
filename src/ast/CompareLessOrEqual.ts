import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';

/**
  Representación de las comparaciones por menor o igual.
*/
export class CompareLessOrEqual implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `CompareLessOrEqual(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unparse(): string {
    return `(${this.lhs.unparse()} <= ${this.rhs.unparse()})`;
  }

  compileCIL(context: CompilationContext): CompilationContext {
    this.lhs.compileCIL(context);
    this.rhs.compileCIL(context);
    context.appendInstruction("cgt");
    context.appendInstruction("not");
    return context;
  }

  maxStackIL(value: number): number {
    var lhsStack = this.lhs.maxStackIL(value);
    var rhsStack = this.rhs.maxStackIL(value)+1;
    return Math.max(lhsStack,rhsStack);
  }
}
