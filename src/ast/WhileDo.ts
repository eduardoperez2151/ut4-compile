import { Exp, Stmt } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';

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

  unparse(): string {
    return `while ${this.cond.unparse()} do { ${this.body.unparse()} }`;
  }

  compileCIL(context: CompilationContext): CompilationContext {
    var tag0 = context.getTag();
    var tag1 = context.getTag();
    context.appendInstruction("br " + tag0);
    context.appendInstruction(tag1);
    this.body.compileCIL(context);
    context.appendInstruction(tag0);
    this.cond.compileCIL(context);
    context.appendInstruction("brtrue" + tag1);
    return context;
  }

  maxStackIL(value: number): number {
    const maxStackILBody = this.body.maxStackIL(value);
    return 1 + maxStackILBody; // cond + body
  }
}
