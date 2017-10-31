import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import {Numeral} from "./Numeral";
import {State} from "../state/State";

/**
  Representación de multiplicaciones.
*/
export class Multiplication implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `Multiplication(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unParse(): string {
    return `(${this.lhs.unParse()} * ${this.rhs.unParse()})`;
  }

    optimize(state: State): Exp {
        let leftOptimized = this.lhs.optimize(state);
        let rightOptimized = this.rhs.optimize(state);
        if (leftOptimized instanceof Numeral) {
            if (leftOptimized.value === 0) {
                return new Numeral(0);
            }
            if (rightOptimized instanceof Numeral) {
                return new Numeral(leftOptimized.value * rightOptimized.value)
            }
        } else {
            if (rightOptimized instanceof Numeral) {
                if (rightOptimized.value === 0) {
                    return new Numeral(0);
                }
            }
        }
        return new Multiplication(leftOptimized,rightOptimized);
    }

  compileCIL(context: CompilationContext): CompilationContext {
    this.lhs.compileCIL(context);
    this.rhs.compileCIL(context);
    context.appendInstruction("mul");
    return context;
  }

  maxStackIL(value: number): number {
    var lhsStack = this.lhs.maxStackIL(value);
    var rhsStack = this.rhs.maxStackIL(value)+ 1;
    return Math.max(lhsStack,rhsStack);
  }
}
