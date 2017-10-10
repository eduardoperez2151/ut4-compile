import { Exp, Stmt } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';

/**
  Representación de las sentencias condicionales.
*/
export class IfThenElse implements Stmt {
  cond: Exp;
  thenBody: Stmt;
  elseBody: Stmt;

  constructor(cond: Exp, thenBody: Stmt, elseBody: Stmt) {
    this.cond = cond;
    this.thenBody = thenBody;
    this.elseBody = elseBody;
  }

  toString(): string {
    return `IfThenElse(${this.cond.toString()}, ${this.thenBody.toString()}, ${this.elseBody.toString()})`;
  }

  unparse(): string {
    return `if ${this.cond.unparse()} then { ${this.thenBody.unparse()} } else { ${this.elseBody.unparse()} }`;
  }

  compileCIL(context: CompilationContext): CompilationContext {
    var tag1=context.getTag();
    var tag2=context.getTag();
    this.cond.compileCIL(context);
    context.appendInstruction("brtrue "+tag1);
    this.elseBody.compileCIL(context);
    context.appendInstruction("br "+tag2);
    context.appendInstruction(tag1);
    this.thenBody.compileCIL(context);
    context.appendInstruction(tag2);
    return context;
  }

  maxStackIL(value: number): number {
    const maxStackILThen = this.thenBody.maxStackIL(value);
    const maxStackILElse = this.elseBody.maxStackIL(value);
    return 1 + Math.max(maxStackILThen, maxStackILElse); // cond + max of the two branches
  }
}
