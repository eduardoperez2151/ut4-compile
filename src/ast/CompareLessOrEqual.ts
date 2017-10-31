import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import {Numeral} from "./Numeral";
import {TruthValue} from "./TruthValue";
import {State} from "../state/State";

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

  unParse(): string {
    return `(${this.lhs.unParse()} <= ${this.rhs.unParse()})`;
  }

    optimize(state: State): any {
        let leftSideOptimized = this.lhs.optimize(state);
        let rightSideOptimized = this.rhs.optimize(state);

        if (leftSideOptimized instanceof Numeral && rightSideOptimized instanceof Numeral) {
            return new TruthValue(leftSideOptimized <= rightSideOptimized);
        }

        if (leftSideOptimized instanceof TruthValue && rightSideOptimized instanceof TruthValue) {
            return new TruthValue(leftSideOptimized <= rightSideOptimized);
        }

        return new CompareLessOrEqual(leftSideOptimized, rightSideOptimized);
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
