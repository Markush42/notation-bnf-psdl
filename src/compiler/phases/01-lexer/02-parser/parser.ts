// src/compiler/phases/02-parser/parser.ts
import { Token, ASTNode, ASTDocument, ASTElement } from '../../ast/types';

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public parse(): ASTDocument {
    const root: ASTDocument = {
      type: 'Document',
      line: 1,
      column: 1,
      children: []
    };

    while (!this.isAtEnd()) {
      const node = this.parseNode();
      if (node) root.children.push(node);
    }

    return root;
  }

  private parseNode(): ASTNode | null {
    const token = this.peek();

    if (token.type === 'TAG_OPEN') {
      return this.parseElement();
    }

    if (token.type === 'TEXT_CONTENT') {
      return {
        type: 'Text',
        content: this.advance().value,
        line: token.line,
        column: token.column
      };
    }

    // Ignorar tokens sueltos no controlados en este baseline
    this.advance();
    return null;
  }

  private parseElement(): ASTElement | null {
    const openTagToken = this.advance(); // Consumir '<'
    
    // Evitar fallos si no hay identificador (ej: typo en el prompt)
    if (this.peek().type !== 'IDENTIFIER') return null;
    
    const tagToken = this.advance();
    const tagName = tagToken.value;

    // Parsear atributos (omitido por brevedad en el boilerplate, avanza hasta '>')
    while (!this.isAtEnd() && this.peek().type !== 'TAG_CLOSE' && this.peek().type !== 'TAG_OPEN') {
      this.advance();
    }

    // Auto-closing tags vs Full tags
    let isSelfClosing = false;
    if (this.peek().type === 'SLASH') {
      isSelfClosing = true;
      this.advance();
    }

    if (this.peek().type === 'TAG_CLOSE') {
      this.advance();
    }

    const element: ASTElement = {
      type: 'Element',
      tag: tagName,
      attributes: {},
      children: [],
      line: openTagToken.line,
      column: openTagToken.column
    };

    if (isSelfClosing) return element;

    // Parsear hijos hasta encontrar la etiqueta de cierre correspondiente
    while (!this.isAtEnd()) {
      if (this.peek().type === 'TAG_OPEN' && this.peekNext()?.type === 'SLASH') {
        // Es una etiqueta de cierre, consumimos </tag>
        this.advance(); // <
        this.advance(); // /
        this.advance(); // tag
        this.advance(); // >
        break;
      }
      
      const child = this.parseNode();
      if (child) element.children.push(child);
    }

    return element;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private peekNext(): Token | null {
    if (this.current + 1 >= this.tokens.length) return null;
    return this.tokens[this.current + 1];
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }
}