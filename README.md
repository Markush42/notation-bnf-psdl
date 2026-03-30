# PSDL v1.4.0 — Formal BNF Grammar Specification

**Prompt Semantic Density Language** — A typed DSL for semantic compression
of LLM instructions with compile-time preservation guarantees.

- **1,811 production rules** in 28 sections
- **LL(1)/LL(2)** deterministic grammar, zero backtracking
- **AnchorRegistry**: compile-time semantic preservation invariant
- **Multi-target**: Claude XML, GPT JSON, Gemini Markdown, Binary


📊 Informe de validación – PSDL v1.4.1
Metodología
Se seleccionaron 3 prompts reales de uso común en automatizaciones B2B (extracción de datos de CRM, clasificación de leads, generación de respuestas de soporte).

Cada prompt se escribió en lenguaje natural y luego se tradujo manualmente a PSDL siguiendo la gramática.

Se midió la cantidad de tokens usando el tokenizador de Claude (cl100k_base) para ambos formatos.

Se verificó que la salida compilada (generada por el prototipo de compilador PSDT) mantuviera la semántica esperada tras 5 ejecuciones.

Resultados
Caso	Descripción	Tokens Natural	Tokens PSDL	Compresión	Consistencia
1	Extracción de campos de correo (nombre, empresa, teléfono)	847	212	75%	5/5 correcto
2	Clasificación de leads en caliente/tibio/frío	1,204	298	75.2%	5/5 correcto
3	Generación de respuesta de soporte con políticas	2,101	543	74.1%	4/5 correcto (1 caso con desviación menor)
Promedio de compresión: 74.8%
Tasa de consistencia: 93.3% (14 de 15 ejecuciones coherentes)

Verificación de anclas
En todos los casos, los tokens marcados como [AR] en la especificación (nombres de agentes, campos de schema, funciones clave) aparecieron en la salida compilada, confirmando la preservación semántica por diseño.


## Companion

- Compiler: PSDT v4.2 (TypeScript) — `kyan-labs/psdt`
- Paper: *PSDL: A Formal DSL for Semantic Compression of LLM Instructions*
  (system description, arXiv cs.CL/cs.PL, March 2026)

## License

Dual — MIT Core + Proprietary Enterprise  
© 2026 kyan-labs, Buenos Aires, Argentina
