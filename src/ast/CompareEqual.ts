import { Exp } from './ASTNode';
import { TruthValue } from './AST';
import { Numeral } from './AST';
import { CompilationContext } from '../compileCIL/CompilationContext';

/**
  Representación de las comparaciones por igual.
*/
export class CompareEqual implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `CompareEqual(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unparse(): string {
    return `(${this.lhs.unparse()} == ${this.rhs.unparse()})`;
  }

  compileCIL(context: CompilationContext): CompilationContext {
    this.lhs.compileCIL(context);
    this.rhs.compileCIL(context);
    context.appendInstruction("ceq")
    return context;
  }

  maxStackIL(value: number): number {
    var lhsStack = this.lhs.maxStackIL(value);
    var rhsStack = this.rhs.maxStackIL(value)+ 1;
    return Math.max(lhsStack,rhsStack);
  }
  optimization(state:State):Exp {
    var lhsOp = this.optimization(state);
    var rhsOp = this.optimization(state);

    if (lhsOp instanceof TruthValue && rhsOp instanceof TruthValue){
        var op = lhsOp == rhsOp
        return new TruthValue(op);
    }
    if (lhsOp instanceof Numeral && rhsOp instanceof Numeral){
        var op = lhsOp == rhsOp
        return new TruthValue(op);
    }
    return new CompareEqual(lhsOp, rhsOp);
  }
}
