import { Exp, Stmt } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import {State} from "../state/State";
import {TruthValue} from "./TruthValue";
import {Sequence} from "./Sequence";

/**
  Representación de las sentencias condicionales.
*/
export class IfThen implements Stmt {
  cond: Exp;
  thenBody: Stmt;

  constructor(cond: Exp, thenBody: Stmt) {
    this.cond = cond;
    this.thenBody = thenBody;
  }

  toString(): string {
    return `IfThen(${this.cond.toString()}, ${this.thenBody.toString()})`;
  }

  unparse(): string {
    return `if ${this.cond.unparse()} then { ${this.thenBody.unparse()} }`;
  }

    optimize(state: State): Stmt {
      let optimizedCondition = cond.optimize(state);
      let optimizedBody=this.thenBody.optimize(state);
      if (optimizedCondition instanceof  TruthValue){
          if(optimizedCondition){
            return optimizedBody
          }else{
            return new Skip/// hay que hacerlo;
          }
      }
      return new IfThen(optimizedCondition,optimizedBody);
    }

  compileCIL(context: CompilationContext): CompilationContext {
    var tag1=context.getTag();
    var tag2=context.getTag();
    this.cond.compileCIL(context);
    context.appendInstruction("brtrue "+tag1);
    context.appendInstruction("br "+tag2);
    context.appendInstruction(tag1+":");
    this.thenBody.compileCIL(context);
    context.appendInstruction(tag2+":");
    return context;
  }

  maxStackIL(value: number): number {
    const maxStackILThen = this.thenBody.maxStackIL(value);
    return 1 + maxStackILThen; // cond + then
  }
}
