// src/compiler/phases/01-lexer/lexer.ts
import { Token, TokenType } from '../../ast/types';

export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(input: string) {
    this.input = input;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    while (this.position < this.input.length) {
      const char = this.peek();

      if (this.isWhitespace(char)) {
        this.advance();
        continue;
      }

      if (char === '<') {
        tokens.push(this.createToken('TAG_OPEN', this.advance()));
        continue;
      }
      
      if (char === '>') {
        tokens.push(this.createToken('TAG_CLOSE', this.advance()));
        continue;
      }

      if (char === '/') {
        tokens.push(this.createToken('SLASH', this.advance()));
        continue;
      }

      if (char === '=') {
        tokens.push(this.createToken('EQUALS', this.advance()));
        continue;
      }

      if (this.isAlpha(char)) {
        tokens.push(this.readIdentifier());
        continue;
      }

      // Fallback a Text Content (simplificado para el boilerplate)
      tokens.push(this.readTextContent());
    }

    tokens.push(this.createToken('EOF', ''));
    return tokens;
  }

  private peek(): string {
    return this.input[this.position];
  }

  private advance(): string {
    const char = this.input[this.position++];
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  private readIdentifier(): Token {
    const startCol = this.column;
    let value = '';
    while (this.position < this.input.length && this.isAlphaNumeric(this.peek())) {
      value += this.advance();
    }
    return { type: 'IDENTIFIER', value, line: this.line, column: startCol };
  }

  private readTextContent(): Token {
    const startCol = this.column;
    let value = '';
    while (this.position < this.input.length && !['<', '>', '='].includes(this.peek())) {
      value += this.advance();
    }
    return { type: 'TEXT_CONTENT', value: value.trim(), line: this.line, column: startCol };
  }

  private isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }

  private isAlpha(char: string): boolean {
    return /[a-zA-Z_]/.test(char);
  }

  private isAlphaNumeric(char: string): boolean {
    return /[a-zA-Z0-9_-]/.test(char);
  }

  private createToken(type: TokenType, value: string): Token {
    return { type, value, line: this.line, column: this.column - value.length };
  }
}