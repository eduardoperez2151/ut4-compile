///<reference path="../compileCIL/CompilationContext.ts"/>
import {Stmt} from "./ASTNode";
import {CompilationContext} from "../compileCIL/CompilationContext";
import {State} from "../state/State";

export class Skip implements Stmt {

    compileCIL(context: CompilationContext): CompilationContext {
        return null;
    }

    maxStackIL(value: number): number {
        return value;
    }

    toString(): string {
        return "Skip()"
    }

    unParse(): string {
        return '()';
    }

    optimize(state: State) {
        return new Skip();
    }

}