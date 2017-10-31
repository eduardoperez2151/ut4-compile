import {Stmt} from './ASTNode';
import {CompilationContext} from '../compileCIL/CompilationContext';
import {State} from "../state/State";
import {Skip} from "./Skip";

/**
 Representación de las secuencias de sentencias.
 */
export class Sequence implements Stmt {

    statements: [Stmt];

    constructor(statements: [Stmt]) {
        this.statements = statements;
    }

    toString(): string {
        const statements = this.statements
            .filter((stmt) => (stmt !== undefined))
            .map((stmt) => (stmt.toString()))
            .join(", ");
        return `Sequence(${statements})`
    }

    optimize(state: State) {
        let optimizedStatements = this.statements.map((stmt: Stmt) => stmt.optimize(state)).filter((stmt: Stmt) => !(stmt instanceof Skip));
        return optimizedStatements.length > 0 ? new Sequence(optimizedStatements as [Stmt]) : new Skip();
    }

    unParse(): string {
        const statements = this.statements
            .filter((stmt) => (stmt !== undefined))
            .map((stmt) => (stmt.toString()))
            .join(" ");
        return `{ ${statements} }`
    }

    compileCIL(context: CompilationContext): CompilationContext {
        context = this.statements.reduce((context: CompilationContext, stmt: Stmt) => stmt.compileCIL(context), context);
        return context;

    }

    maxStackIL(value: number): number {
        let maxStack = value;
        for (let stmt of this.statements) {
            value = stmt.maxStackIL(value)
            maxStack = Math.max(maxStack, value);
        }
        return maxStack;
    }
}
