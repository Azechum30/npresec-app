import { cn } from "@/lib/utils";

interface FormattedTextProps {
  text: string | null;
  className?: string;
  fallbackText?: string;
  format?: "plain" | "html" | "markdown";
  splitBy?: "paragraphs" | "sentences" | "lines";
}

export const FormattedText = ({
  text,
  className,
  fallbackText = "No content available",
  format = "plain",
  splitBy = "paragraphs",
}: FormattedTextProps) => {
  if (!text) {
    return (
      <p className={cn("text-sm text-muted-foreground italic", className)}>
        {fallbackText}
      </p>
    );
  }

  // Handle HTML content
  if (format === "html") {
    return (
      <div
        className={cn("prose prose-sm max-w-none", className)}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  // Handle Markdown content (basic)
  if (format === "markdown") {
    const formatMarkdown = (content: string) => {
      return content
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
        .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
        .replace(/\n\n/g, "</p><p>") // Paragraphs
        .replace(/\n/g, "<br>"); // Line breaks
    };

    const htmlContent = `<p>${formatMarkdown(text)}</p>`;

    return (
      <div
        className={cn(
          "prose prose-sm max-w-none space-y-4 dark:text-muted-foreground",
          className
        )}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  // Handle plain text
  const formatText = () => {
    switch (splitBy) {
      case "paragraphs":
        return text.split("\n\n").filter((p) => p.trim());
      case "sentences":
        return text.split(/[.!?]+/).filter((s) => s.trim());
      case "lines":
        return text.split("\n").filter((l) => l.trim());
      default:
        return [text];
    }
  };

  const formattedText = formatText();

  return (
    <div className={cn("space-y-4", className)}>
      {formattedText.map((paragraph, index) => (
        <p key={index} className="text-sm text-muted-foreground">
          {paragraph.trim()}
        </p>
      ))}
    </div>
  );
};

// Alternative component for rich text formatting
interface RichFormattedTextProps {
  text: string | null;
  className?: string;
  fallbackText?: string;
  preserveLineBreaks?: boolean;
}

export const RichFormattedText = ({
  text,
  className,
  fallbackText = "No content available",
  preserveLineBreaks = true,
}: RichFormattedTextProps) => {
  if (!text) {
    return (
      <p className={cn("text-sm text-muted-foreground italic", className)}>
        {fallbackText}
      </p>
    );
  }

  const formatRichText = (content: string) => {
    if (!preserveLineBreaks) {
      return content;
    }

    // Split by double line breaks for paragraphs
    const paragraphs = content.split("\n\n");

    return paragraphs.map((paragraph, index) => {
      // Handle single line breaks within paragraphs
      const lines = paragraph.split("\n");

      if (lines.length === 1) {
        return (
          <p
            key={index}
            className="text-sm text-muted-foreground leading-relaxed mb-4">
            {paragraph.trim()}
          </p>
        );
      }

      return (
        <p
          key={index}
          className="text-sm text-muted-foreground leading-relaxed mb-4">
          {lines.map((line, lineIndex) => (
            <span key={lineIndex}>
              {line.trim()}
              {lineIndex < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
  };

  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      {formatRichText(text)}
    </div>
  );
};
