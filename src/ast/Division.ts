import {Exp} from './ASTNode';
import {CompilationContext} from '../compileCIL/CompilationContext';
import {State} from "../state/State";
import {Numeral} from "./Numeral";

/**
 Representación de multiplicaciones.
 */
export class Division implements Exp {

    lhs: Exp;
    rhs: Exp;

    constructor(lhs: Exp, rhs: Exp) {
        this.lhs = lhs;
        this.rhs = rhs;
    }

    toString(): string {
        return `Division(${this.lhs.toString()}, ${this.rhs.toString()})`;
    }

    unParse(): string {
        return `(${this.lhs.unParse()} / ${this.rhs.unParse()})`;
    }

    optimize(state: State): Exp {
        let leftOptimized = this.lhs.optimize(state);
        let rightOptimized = this.rhs.optimize(state);
        if (leftOptimized instanceof Numeral) {
            if (leftOptimized.value == 0) {
                return new Numeral(0);
            }
            if (rightOptimized instanceof Numeral) {
                return new Numeral(leftOptimized.value / rightOptimized.value)
            }
        } else {
            if (rightOptimized instanceof Numeral) {
                if (rightOptimized.value == 0) {
                    throw new EvalError('No se puede dividir entre 0');
                }
            }
        }
        return new Division(leftOptimized, rightOptimized);
    }

    compileCIL(context: CompilationContext): CompilationContext {
        this.lhs.compileCIL(context);
        this.rhs.compileCIL(context);
        context.appendInstruction("div");
        return context;
    }

    maxStackIL(value: number): number {
        var lhsStack = this.lhs.maxStackIL(value);
        var rhsStack = this.rhs.maxStackIL(value) + 1;
        return Math.max(lhsStack, rhsStack);
    }
}
