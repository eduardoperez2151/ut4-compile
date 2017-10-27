import {Exp} from './ASTNode';
import {CompilationContext} from '../compileCIL/CompilationContext';
import {State} from "../state/State";
import {Numeral} from "./Numeral";
import {Variable} from "./Variable";

/**
 Representación de sumas.
 */
export class Addition implements Exp {

    lhs: Exp;
    rhs: Exp;

    constructor(lhs: Exp, rhs: Exp) {
        this.lhs = lhs;
        this.rhs = rhs;
    }

    toString(): string {
        return `Addition(${this.lhs.toString()}, ${this.rhs.toString()})`;
    }

    unparse(): string {
        return `(${this.lhs.unparse()} + ${this.rhs.unparse()})`;
    }

    optimize(state: State): Exp {
        let leftOptimized = this.lhs.optimize(state);
        let rightOptimized = this.rhs.optimize(state);
        if (leftOptimized instanceof Numeral) {
            if (leftOptimized.value == 0) {
                return rightOptimized;
            }
            if (rightOptimized instanceof Numeral) {
                return new Numeral(leftOptimized.value + rightOptimized.value)
            }
        } else {
            if (rightOptimized instanceof Numeral) {
                if (rightOptimized.value == 0) {
                    return leftOptimized;
                }
            }
        }
        return new Addition(leftOptimized,rightOptimized);
    }

    compileCIL(context: CompilationContext): CompilationContext {
        this.lhs.compileCIL(context);
        this.rhs.compileCIL(context);
        context.appendInstruction("add")
        return context;
    }

    maxStackIL(value: number): number {
        var lhsStack = this.lhs.maxStackIL(value);
        var rhsStack = this.rhs.maxStackIL(value) + 1;
        return Math.max(lhsStack, rhsStack);
    }
}
