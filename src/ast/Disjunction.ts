import {Exp} from './ASTNode';
import {TruthValue} from './AST';
import {CompilationContext} from '../compileCIL/CompilationContext';
import {State} from "../state/State";

/**
  Representación de conjunciones booleanas (AND).
*/
export class Disjunction implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `Disjunction(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unParse(): string {
    return `(${this.lhs.unParse()} || ${this.rhs.unParse()})`;
  }

    optimize(state: State): any {
        let lhsOp = this.lhs.optimize(state);
        let rhsOp = this.rhs.optimize(state);
        if (lhsOp instanceof TruthValue && rhsOp instanceof TruthValue) {
            return new TruthValue(lhsOp.value || rhsOp.value);
        }
        return new Disjunction(lhsOp, rhsOp);
    }

    compileCIL(context: CompilationContext): CompilationContext {
    this.lhs.compileCIL(context);
    this.rhs.compileCIL(context);
    context.appendInstruction("or");
    return context;
  }

  maxStackIL(value: number): number {
    var lhsStack = this.lhs.maxStackIL(value);
    var rhsStack = this.rhs.maxStackIL(value)+1;
    return Math.max(lhsStack,rhsStack);
  }

}
