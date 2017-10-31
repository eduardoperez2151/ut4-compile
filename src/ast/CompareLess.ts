import {Exp} from './ASTNode';
import {CompilationContext} from '../compileCIL/CompilationContext';
import {State} from "../state/State";
import {TruthValue} from "./TruthValue";
import {Numeral} from "./Numeral";

/**
 Representación de las comparaciones por menor o igual.
 */
export class CompareLess implements Exp {

    lhs: Exp;
    rhs: Exp;

    constructor(lhs: Exp, rhs: Exp) {
        this.lhs = lhs;
        this.rhs = rhs;
    }

    toString(): string {
        return `CompareLess(${this.lhs.toString()}, ${this.rhs.toString()})`;
    }

    unParse(): string {
        return `(${this.lhs.unParse()} < ${this.rhs.unParse()})`;
    }

    optimize(state: State): any {
        let leftSideOptimized = this.lhs.optimize(state);
        let rightSideOptimized = this.rhs.optimize(state);

        if (leftSideOptimized instanceof Numeral && rightSideOptimized instanceof Numeral) {
            return new TruthValue(leftSideOptimized < rightSideOptimized);
        }

        if (leftSideOptimized instanceof TruthValue && rightSideOptimized instanceof TruthValue) {
            return new TruthValue(leftSideOptimized < rightSideOptimized);
        }

        return new CompareLess(leftSideOptimized, rightSideOptimized);
    }

    compileCIL(context: CompilationContext): CompilationContext {
        this.lhs.compileCIL(context);
        this.rhs.compileCIL(context);
        context.appendInstruction("clt")
        return context;
    }

    maxStackIL(value: number): number {
        var lhsStack = this.lhs.maxStackIL(value);
        var rhsStack = this.rhs.maxStackIL(value) + 1;
        return Math.max(lhsStack, rhsStack);
    }
}
