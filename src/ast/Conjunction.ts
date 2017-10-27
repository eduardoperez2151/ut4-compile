import { Exp } from './ASTNode';
import { TruthValue } from './AST';
import { CompilationContext } from '../compileCIL/CompilationContext';

/**
  Representación de conjunciones booleanas (AND).
*/
export class Conjunction implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `Conjunction(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unparse(): string {
    return `(${this.lhs.unparse()} && ${this.rhs.unparse()})`;
  }

  compileCIL(context: CompilationContext): CompilationContext {
    this.lhs.compileCIL(context);
    this.rhs.compileCIL(context);
    context.appendInstruction("and");
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
    if(lhsOp instanceof TruthValue && rhsOp instanceof TruthValue){
      if (!(lhsOp as TruthValue).value || !(lhsOp as TruthValue).value){
        return new TruthValue(false);
      }
      return new TruthValue(true);
    }
    return new Conjunction(lhsOp, rhsOp);
}
