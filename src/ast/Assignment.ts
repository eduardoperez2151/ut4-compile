import { Exp, Stmt } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import {Numeral} from "./Numeral";
import {State} from "../state/State";

/**
  Representación de las asignaciones de valores a variables.
*/
export class Assignment implements Stmt {

  id: string;
  exp: Exp;

  constructor(id: string, exp: Exp) {
    this.id = id;
    this.exp = exp;
  }

  toString(): string {
    return `Assignment(${this.id}, ${this.exp.toString()})`;
  }

  unparse(): string {
    return `${this.id} = ${this.exp.unparse()}`;
  }

    optimize(state: State): Stmt {
        let optimizedExpression= this.exp.optimize(state);


        if(optimizedExpression instanceof Numeral || optimizedExpression instanceof TruthValue){
          state.set(this.id,optimizedExpression.value);
        }else if (state.get(this.id)){
          state.delete(this.id);
        }
        return new Assignment(this.id,optimizedExpression);
    }



  compileCIL(context: CompilationContext): CompilationContext {
    this.exp.compileCIL(context);
    var index = context.getVar(this.id);
    if (index == -1){
        index = context.addVar(this.id,"int32");
    }
    context.appendInstruction("stloc " + index);
    return context;
  }
  maxStackIL(value: number): number {
    return this.exp.maxStackIL(value);
  }
}
