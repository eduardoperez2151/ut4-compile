import {Exp} from './ASTNode';
import {CompilationContext} from '../compileCIL/CompilationContext';
import {State} from "../state/State";

/**
 Representación de valores de verdad (cierto o falso).
 */
export class TruthValue implements Exp {

    value: boolean;

    constructor(value: boolean) {
        this.value = value;
    }

    toString(): string {
        return `TruthValue(${this.value})`;
    }

    unParse(): string {
        return this.value ? "true" : "false";
    }

    optimize(state: State): Exp {
        return this;
    }

    compileCIL(context: CompilationContext): CompilationContext {
        this.value ? context.appendInstruction("ldc.i4.1") : context.appendInstruction("ldc.i4.0")
        return context;
    }

    maxStackIL(value: number): number {
        return value + 1;
    }

}
