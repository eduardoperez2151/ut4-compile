import {Exp} from './ASTNode';
import {CompilationContext} from '../compileCIL/CompilationContext';
import {State} from "../state/State";
import {Numeral} from "./Numeral";
import {TruthValue} from "./TruthValue";

/**
 Representación de usos de variable en expresiones.
 */
export class Variable implements Exp {


    id: string;

    constructor(id: string) {
        this.id = id;
    }

    toString(): string {
        return `Variable(${this.id})`;
    }

    unParse(): string {
        return this.id;
    }

    optimize(state: State) {
        let variable = state.get(this.id);
        if (typeof  variable === 'number') {
            return new Numeral(variable);
        }
        if (typeof  variable === 'boolean') {
            return new TruthValue(variable);
        }
        return this;
    }

    compileCIL(context: CompilationContext): CompilationContext {
        let index = context.getVar(this.id);
        context.appendInstruction("ldloc " + index);
        return context;
    }

    maxStackIL(value: number): number {
        return value + 1;
    }
}
