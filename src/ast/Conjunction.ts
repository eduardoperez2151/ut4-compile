import {Exp} from './ASTNode';
import {TruthValue} from './AST';
import {State} from "../state/State";
import {CompilationContext} from '../compileCIL/CompilationContext';

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

    unParse(): string {
        return `(${this.lhs.unParse()} && ${this.rhs.unParse()})`;
    }

    optimize(state: State): any {
        let lhsOp = this.lhs.optimize(state);
        let rhsOp = this.rhs.optimize(state);
        if (lhsOp instanceof TruthValue && rhsOp instanceof TruthValue) {
            return new TruthValue(lhsOp.value && rhsOp.value);
        }
        return new Conjunction(lhsOp, rhsOp);
    }

    compileCIL(context: CompilationContext): CompilationContext {
        this.lhs.compileCIL(context);
        this.rhs.compileCIL(context);
        context.appendInstruction("and");
        return context;
    }

    maxStackIL(value: number): number {
        let lhsStack = this.lhs.maxStackIL(value);
        let rhsStack = this.rhs.maxStackIL(value) + 1;
        return Math.max(lhsStack, rhsStack);
    }


}
