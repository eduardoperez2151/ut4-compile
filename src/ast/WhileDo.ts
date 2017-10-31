import {Exp, Stmt} from './ASTNode';
import {TruthValue} from './AST';
import {CompilationContext} from '../compileCIL/CompilationContext';
import {State} from "../state/State";
import {Skip} from "./Skip";

/**
 Representación de las iteraciones while-do.
 */
export class WhileDo implements Stmt {
    cond: Exp;
    body: Stmt;

    constructor(cond: Exp, body: Stmt) {
        this.cond = cond;
        this.body = body;
    }

    toString(): string {
        return `WhileDo(${this.cond.toString()}, ${this.body.toString()})`;
    }

    unParse(): string {
        return `while ${this.cond.unParse()} do { ${this.body.unParse()} }`;
    }

    optimize(state: State): Stmt {
        let condOp = this.cond.optimize(state);
        let bodyOp = this.optimize(state);

        if (condOp instanceof TruthValue) {
            if (!condOp.value) {
                return new Skip();
            }
        }
        return new WhileDo(condOp, bodyOp);
    }


    compileCIL(context: CompilationContext): CompilationContext {
        let tag0 = context.getTag();
        let tag1 = context.getTag();
        context.appendInstruction("br " + tag0);
        context.appendInstruction(tag1 + ":");
        this.body.compileCIL(context);
        context.appendInstruction(tag0 + ":");
        this.cond.compileCIL(context);
        context.appendInstruction("brtrue " + tag1);
        return context;
    }

    maxStackIL(value: number): number {
        const maxStackILBody = this.body.maxStackIL(value);
        return 1 + maxStackILBody;
    }
}
