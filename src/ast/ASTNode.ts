import {State} from "../state/State";
import {CompilationContext} from '../compileCIL/CompilationContext';

export interface ASTNode {

    toString(): string;

    unParse(): string;

    optimize(state: State): any;
}

/**
 Categoría sintáctica de las expresiones de While, las
 construcciones del lenguaje que evalúan a un valor.
 */
export interface Exp extends ASTNode {

    compileCIL(context: CompilationContext): CompilationContext;

    maxStackIL(value: number): number;

}

/**
 Categoría sintáctica de las sentencias (statements) de While, las
 construcciones del lenguaje que modifican (potencialmente) los
 valores de las variables en el estado del programa.
 */
export interface Stmt extends ASTNode {

    compileCIL(context: CompilationContext): CompilationContext;

    maxStackIL(value: number): number;

}
