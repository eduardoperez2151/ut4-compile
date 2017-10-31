import * as readlineSync from "readline-sync";

import {Parser} from "nearley";

import {tokens} from "./parser/Tokens";
import {MyLexer} from "./parser/Lexer"
import {ParserRules, ParserStart} from "./parser/Grammar";

import {Stmt} from './ast/AST';

import {CompilationContext} from './compileCIL/CompilationContext';
import {State} from "./state/State";


console.log("While :: REPL");

let context = new CompilationContext();
let state = new State();

while (true) {
    const lexer = new MyLexer(tokens);
    const parser = new Parser(ParserRules, ParserStart, {lexer});

    const input = readlineSync.question('> ');

    try {
        // Parse user input
        parser.feed(input);
        // Print result
        const nodes: Stmt[] = parser.results;

        switch (nodes.length) {
            case 0: {
                console.log("Parse failed!!");
                break;
            }
            case 1: {
                let node = nodes[0];
                let optimizedNode = node.optimize(state);
                context = optimizedNode.compileCIL(context);
                console.log(context.getCIL(node.maxStackIL(0)));
                break;
            }
            default: {
                console.log("Warning!! Grammar is ambiguous, multiple parse results.\n");
                nodes.map((node) => console.log(node.toString()));
                break;
            }
        }

    } catch (parseError) {
        console.log(parseError);
    }
}
