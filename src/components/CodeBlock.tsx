import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock = ({ code, language = 'json', title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCode = (code: string, language: string) => {
    if (language === 'json') {
      try {
        const parsed = JSON.parse(code);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return code;
      }
    }
    return code;
  };

  const highlightJSON = (jsonString: string) => {
    return jsonString
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1":</span>')
      .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="json-number">$1</span>')
      .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>');
  };

  const formattedCode = formatCode(code, language);
  const highlightedCode = language === 'json' ? highlightJSON(formattedCode) : formattedCode;

  return (
    <div className="relative">
      {title && (
        <div className="bg-muted px-4 py-2 border-b text-sm font-medium">
          {title}
        </div>
      )}
      <div className="code-block relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 text-code-foreground hover:bg-code-border"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <pre className="pr-12">
          <code 
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            className="text-sm"
          />
        </pre>
      </div>
    </div>
  );
};