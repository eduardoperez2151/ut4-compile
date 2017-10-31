import {Exp} from './ASTNode';
import {CompilationContext} from '../compileCIL/CompilationContext';
import {State} from "../state/State";
import {Numeral} from "./Numeral";
import {TruthValue} from "./TruthValue";

/**
 Representación de las comparaciones por igual.
 */
export class CompareNotEqual implements Exp {

    lhs: Exp;
    rhs: Exp;

    constructor(lhs: Exp, rhs: Exp) {
        this.lhs = lhs;
        this.rhs = rhs;
    }

    toString(): string {
        return `CompareNotEqual(${this.lhs.toString()}, ${this.rhs.toString()})`;
    }

    unParse(): string {
        return `(${this.lhs.unParse()} != ${this.rhs.unParse()})`;
    }

    optimize(state: State): any {
        let leftSideOptimized = this.lhs.optimize(state);
        let rightSideOptimized = this.rhs.optimize(state);

        if (leftSideOptimized instanceof Numeral && rightSideOptimized instanceof Numeral) {
            return new TruthValue(leftSideOptimized.value !== rightSideOptimized.value);
        }

        if (leftSideOptimized instanceof TruthValue && rightSideOptimized instanceof TruthValue) {
            return new TruthValue(leftSideOptimized.value !== rightSideOptimized.value);
        }

        return new CompareNotEqual(leftSideOptimized, rightSideOptimized);
    }

    compileCIL(context: CompilationContext): CompilationContext {
        this.lhs.compileCIL(context);
        this.rhs.compileCIL(context);
        context.appendInstruction("ceq");
        context.appendInstruction("not");
        return context;
    }

    maxStackIL(value: number): number {
        var lhsStack = this.lhs.maxStackIL(value);
        var rhsStack = this.rhs.maxStackIL(value) + 1;
        return Math.max(lhsStack, rhsStack);
    }
}
