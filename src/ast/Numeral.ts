import {Exp} from './ASTNode';
import {CompilationContext} from '../compileCIL/CompilationContext';
import {State} from "../state/State";


export class Numeral implements Exp {

    value: number;

    constructor(value: number) {
        this.value = value;
    }

    toString(): string {
        return `Numeral(${this.value})`;
    }

    unParse(): string {
        return `${this.value}`;
    }

    optimize(state: State) {
        return this;
    }

    compileCIL(context: CompilationContext): CompilationContext {
        context.appendInstruction("ldc.i4 " + this.value);
        return context;
    }

    maxStackIL(value: number): number {
        return value + 1;
    }


}
