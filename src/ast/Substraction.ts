import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import {Numeral} from "./Numeral";
import {State} from "../state/State";

/**
  Representación de restas.
*/
export class Substraction implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `Substraction(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unParse(): string {
    return `(${this.lhs.unParse()} - ${this.rhs.unParse()})`;
  }

    optimize(state: State): Exp {
        let leftOptimized = this.lhs.optimize(state);
        let rightOptimized = this.rhs.optimize(state);
        if (leftOptimized instanceof Numeral) {
            if (leftOptimized.value === 0) {
                return rightOptimized;
            }
            if (rightOptimized instanceof Numeral) {
                return new Numeral(leftOptimized.value - rightOptimized.value)
            }
        } else {
            if (rightOptimized instanceof Numeral) {
                if (rightOptimized.value === 0) {
                    return leftOptimized;
                }
            }
        }
        return new Substraction(leftOptimized,rightOptimized);
    }

  compileCIL(context: CompilationContext): CompilationContext {
    this.lhs.compileCIL(context);
    this.rhs.compileCIL(context);
    context.appendInstruction("sub");
    return context;
  }

  maxStackIL(value: number): number {
    var lhsStack = this.lhs.maxStackIL(value);
    var rhsStack = this.rhs.maxStackIL(value)+ 1;
    return Math.max(lhsStack,rhsStack);
  }
}
