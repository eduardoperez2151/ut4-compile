import {Exp} from './ASTNode';
import {CompilationContext} from '../compileCIL/CompilationContext';
import {State} from "../state/State";
import {TruthValue} from "./TruthValue";

/**
 Representación de las negaciones de expresiones booleanas.
 */
export class Negation implements Exp {

    exp: Exp;

    constructor(exp: Exp) {
        this.exp = exp;
    }

    toString(): string {
        return `Negation(${this.exp.toString()})`;
    }

    unParse(): string {
        return `(!${this.exp.unParse()})`;
    }

    optimize(state: State) {
        let expressionOptimized = this.exp.optimize(state);
        if (expressionOptimized instanceof TruthValue) {
            return new TruthValue(!expressionOptimized.value);
        }
        return new Negation(expressionOptimized);
    }

    compileCIL(context: CompilationContext): CompilationContext {
        this.exp.compileCIL(context);
        context.appendInstruction("neg");
        return context;
    }

    maxStackIL(value: number): number {
        return value;
    }
}
