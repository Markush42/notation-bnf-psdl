// src/compiler/ast/types.ts

export type TokenType = 
  | 'TAG_OPEN'      // <
  | 'TAG_CLOSE'     // >
  | 'SLASH'         // /
  | 'EQUALS'        // =
  | 'STRING'        // "value"
  | 'IDENTIFIER'    // system, user, context
  | 'TEXT_CONTENT'  // Texto natural o mezclado
  | 'CODE_BLOCK'    // ```código```
  | 'MATH_BLOCK'    // $$ math $$ o $ math $
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

// Representación base de los nodos AST que luego consumirá Phase 2.5
export type ASTNodeType = 'Document' | 'Element' | 'Text' | 'CodeBlock' | 'MathBlock';

export interface BaseNode {
  type: ASTNodeType;
  line: number;
  column: number;
}

export interface ASTDocument extends BaseNode {
  type: 'Document';
  children: ASTNode[];
}

export interface ASTElement extends BaseNode {
  type: 'Element';
  tag: string;
  attributes: Record<string, string>;
  children: ASTNode[];
}

export interface ASTContentNode extends BaseNode {
  type: 'Text' | 'CodeBlock' | 'MathBlock';
  content: string;
}

export type ASTNode = ASTDocument | ASTElement | ASTContentNode;