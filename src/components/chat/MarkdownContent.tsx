"use client";

import React from "react";

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; start: number; items: string[] }
  | { type: "code"; content: string }
  | { type: "blockquote"; lines: string[] }
  | { type: "hr" }
  | { type: "paragraph"; text: string };

const INLINE_TOKEN_PATTERN =
  "(`[^`]+`|\\*\\*\\*[^*]+\\*\\*\\*|___[^_]+___|(?<!\\*)\\*\\*(?!\\*)[\\s\\S]+?\\*\\*(?!\\*)|(?<!_)__(?!_)[\\s\\S]+?__(?!_)|(?<!\\*)\\*(?!\\*)([^*\n]+?)\\*(?!\\*)|(?<![\\w])_(?!_)([^_\n]+?)_(?![\\w])|~~[^~]+~~)";

/**
 * Parses inline markdown tokens (bold, italic, bold+italic, strikethrough, inline code)
 * into React nodes without dangerouslySetInnerHTML.
 */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const tokenRe = new RegExp(INLINE_TOKEN_PATTERN, "g");
  let lastIndex = 0;
  let matchIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-tok-${matchIndex++}`;

    if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[0.85em] font-mono text-white/95"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (
      (token.startsWith("***") && token.endsWith("***")) ||
      (token.startsWith("___") && token.endsWith("___"))
    ) {
      nodes.push(
        <strong key={key} className="font-semibold text-white">
          <em className="italic">{renderInline(token.slice(3, -3), key)}</em>
        </strong>
      );
    } else if (
      (token.startsWith("**") && token.endsWith("**")) ||
      (token.startsWith("__") && token.endsWith("__"))
    ) {
      nodes.push(
        <strong key={key} className="font-semibold text-white">
          {renderInline(token.slice(2, -2), key)}
        </strong>
      );
    } else if (
      (token.startsWith("*") && token.endsWith("*")) ||
      (token.startsWith("_") && token.endsWith("_"))
    ) {
      nodes.push(
        <em key={key} className="italic text-white/95">
          {renderInline(token.slice(1, -1), key)}
        </em>
      );
    } else if (token.startsWith("~~") && token.endsWith("~~")) {
      nodes.push(
        <del key={key} className="line-through text-white/60">
          {renderInline(token.slice(2, -2), key)}
        </del>
      );
    } else {
      nodes.push(token);
    }

    lastIndex = tokenRe.lastIndex;
    if (token.length === 0) tokenRe.lastIndex++;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Fenced code block
    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      blocks.push({ type: "code", content: codeLines.join("\n") });
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Heading (# .. ####)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "blockquote", lines: quoteLines });
      continue;
    }

    // Unordered list (-, *, •)
    if (/^\s*[-*•]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length) {
        if (/^\s*[-*•]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*[-*•]\s+/, ""));
          i++;
        } else if (!lines[i].trim() && i + 1 < lines.length && /^\s*[-*•]\s+/.test(lines[i + 1])) {
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered / indexed list (1. or 1))
    const olFirst = line.match(/^\s*(\d+)[.)]\s+(.+)$/);
    if (olFirst) {
      const start = Number(olFirst[1]) || 1;
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\s*\d+[.)]\s+(.+)$/);
        if (m) {
          items.push(m[1]);
          i++;
        } else if (
          !lines[i].trim() &&
          i + 1 < lines.length &&
          /^\s*\d+[.)]\s+(.+)$/.test(lines[i + 1])
        ) {
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: "ol", start, items });
      continue;
    }

    // Paragraph (collect consecutive plain lines)
    const paraLines: string[] = [];
    while (i < lines.length) {
      const curr = lines[i];
      const currTrimmed = curr.trim();
      if (
        !currTrimmed ||
        currTrimmed.startsWith("```") ||
        /^(-{3,}|\*{3,}|_{3,})$/.test(currTrimmed) ||
        /^#{1,4}\s+/.test(currTrimmed) ||
        currTrimmed.startsWith(">") ||
        /^\s*[-*•]\s+/.test(curr) ||
        /^\s*\d+[.)]\s+/.test(curr)
      ) {
        break;
      }
      paraLines.push(currTrimmed);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", text: paraLines.join(" ") });
    }
  }

  return blocks;
}

export interface MarkdownContentProps {
  content: string;
  trailingCursor?: React.ReactNode;
}

export function MarkdownContent({ content, trailingCursor }: MarkdownContentProps) {
  const blocks = parseBlocks(content);
  if (blocks.length === 0) {
    return trailingCursor ? <>{trailingCursor}</> : null;
  }

  return (
    <>
      {blocks.map((block, idx) => {
        const isLast = idx === blocks.length - 1;
        const key = `block-${idx}`;

        switch (block.type) {
          case "heading": {
            const sizeClass =
              block.level === 1
                ? "text-base font-semibold text-white"
                : block.level === 2
                  ? "text-[15px] font-semibold text-white"
                  : "text-sm font-semibold text-white";
            return (
              <p key={key} className={sizeClass}>
                {renderInline(block.text, key)}
                {isLast && trailingCursor}
              </p>
            );
          }

          case "ul":
            return (
              <ul key={key} className="list-disc pl-5 space-y-1.5">
                {block.items.map((item, itemIdx) => {
                  const isLastItem = isLast && itemIdx === block.items.length - 1;
                  return (
                    <li key={`${key}-li-${itemIdx}`} className="pl-0.5">
                      {renderInline(item, `${key}-li-${itemIdx}`)}
                      {isLastItem && trailingCursor}
                    </li>
                  );
                })}
              </ul>
            );

          case "ol":
            return (
              <ol key={key} start={block.start} className="list-decimal pl-5 space-y-1.5">
                {block.items.map((item, itemIdx) => {
                  const isLastItem = isLast && itemIdx === block.items.length - 1;
                  return (
                    <li key={`${key}-li-${itemIdx}`} className="pl-0.5">
                      {renderInline(item, `${key}-li-${itemIdx}`)}
                      {isLastItem && trailingCursor}
                    </li>
                  );
                })}
              </ol>
            );

          case "code":
            return (
              <pre
                key={key}
                className="overflow-x-auto rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-mono text-white/90"
              >
                <code>{block.content}</code>
              </pre>
            );

          case "blockquote":
            return (
              <blockquote
                key={key}
                className="border-l-2 border-white/25 pl-3 text-white/75 italic space-y-1"
              >
                {block.lines.map((l, lIdx) => (
                  <p key={`${key}-q-${lIdx}`}>
                    {renderInline(l, `${key}-q-${lIdx}`)}
                    {isLast && lIdx === block.lines.length - 1 && trailingCursor}
                  </p>
                ))}
              </blockquote>
            );

          case "hr":
            return <hr key={key} className="border-white/10 my-2" />;

          case "paragraph":
            return (
              <p key={key}>
                {renderInline(block.text, key)}
                {isLast && trailingCursor}
              </p>
            );
        }
      })}
    </>
  );
}
