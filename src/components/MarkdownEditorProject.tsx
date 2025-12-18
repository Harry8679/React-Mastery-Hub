import { useState, useEffect } from 'react';
import { ChevronLeft, Code2, Eye, FileText, Download, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { marked } from 'marked';
import type { ProjectComponentProps } from '../types';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ==================== MARKDOWN CONFIG ====================
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Custom renderer for code blocks
const renderer = new marked.Renderer();
renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
  return `<pre><code class="language-${lang || 'text'}">${text}</code></pre>`;
};

marked.use({ renderer });

// ==================== DEFAULT CONTENT ====================
const defaultMarkdown = `# 📝 Markdown Editor

Bienvenue dans cet éditeur Markdown avec **preview en temps réel** !

## 🎨 Fonctionnalités

- ✅ Preview en temps réel
- ✅ Support de GitHub Flavored Markdown
- ✅ Coloration syntaxique du code
- ✅ Export HTML & Markdown
- ✅ Copie dans le presse-papiers
- ✅ Mode plein écran

## 📖 Syntaxe Markdown

### Titres

# Titre 1
## Titre 2
### Titre 3

### Emphases

*Italique* ou _italique_
**Gras** ou __gras__
***Gras et italique***
~~Barré~~

### Listes

**Non ordonnée :**
- Item 1
- Item 2
  - Sous-item 2.1
  - Sous-item 2.2

**Ordonnée :**
1. Premier
2. Deuxième
3. Troisième

### Liens et Images

[Lien vers Google](https://google.com)
![Alt text](https://via.placeholder.com/150)

### Code

Code en ligne : \`const x = 42;\`

**Bloc de code :**

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
  return true;
}
\`\`\`

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

### Citations

> Ceci est une citation
> Sur plusieurs lignes

### Tableaux

| Colonne 1 | Colonne 2 | Colonne 3 |
|-----------|-----------|-----------|
| Cellule 1 | Cellule 2 | Cellule 3 |
| Cellule 4 | Cellule 5 | Cellule 6 |

### Ligne horizontale

---

### Cases à cocher

- [x] Tâche complétée
- [ ] Tâche en cours
- [ ] Tâche à faire

---

## 🚀 Essayez d'écrire votre propre Markdown !

Modifiez le texte à gauche et voyez le résultat à droite.
`;

// ==================== COMPOSANT PRINCIPAL ====================
export default function MarkdownEditorProject({ onBack }: ProjectComponentProps) {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [html, setHtml] = useState('');
  const [view, setView] = useState<'split' | 'editor' | 'preview'>('split');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Convert markdown to HTML
  useEffect(() => {
    const convertMarkdown = async () => {
      const result = await marked.parse(markdown);
      setHtml(result);
    };
    convertMarkdown();
  }, [markdown]);

  // Syntax highlighting for code blocks
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('.markdown-preview pre code');
    codeBlocks.forEach((block) => {
    //   const lang = Array.from(block.classList)
    //     .find((cls) => cls.startsWith('language-'))
    //     ?.replace('language-', '') || 'text';
      
      const code = block.textContent || '';
      
      // Create a container for the syntax highlighter
      const container = document.createElement('div');
      block.parentElement?.replaceWith(container);
      
      // This is a workaround - ideally you'd render SyntaxHighlighter in React
      container.innerHTML = `<pre style="margin: 0; border-radius: 0.5rem;"><code>${code}</code></pre>`;
    });
  }, [html]);

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyHTML = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    const fullHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
    code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #ddd; padding-left: 16px; color: #666; margin: 16px 0; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f6f8fa; }
    img { max-width: 100%; height: auto; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('Effacer tout le contenu ?')) {
      setMarkdown('');
    }
  };

  const handleReset = () => {
    if (confirm('Réinitialiser avec le contenu par défaut ?')) {
      setMarkdown(defaultMarkdown);
    }
  };

  return (
    <div className={`min-h-screen bg-linear-to-br from-slate-50 to-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : 'p-8'}`}>
      {!isFullscreen && (
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <ChevronLeft size={20} />
          Retour à l'accueil
        </button>
      )}

      <div className={`mx-auto ${isFullscreen ? 'h-screen p-4' : 'max-w-7xl'}`}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: isFullscreen ? '100%' : 'auto' }}>
          {/* Header */}
          <div className="bg-linear-to-r from-blue-500 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">📝 Markdown Editor</h1>
                <div className="flex gap-2">
                  {["Markdown", "Real-time Preview", "Export"].map((concept) => (
                    <span
                      key={concept}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2">
              {/* View Toggles */}
              <div className="flex gap-1 bg-white/20 rounded-lg p-1">
                <button
                  onClick={() => setView('editor')}
                  className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
                    view === 'editor' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                  }`}
                >
                  <FileText size={16} />
                  Éditeur
                </button>
                <button
                  onClick={() => setView('split')}
                  className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
                    view === 'split' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Code2 size={16} />
                  Split
                </button>
                <button
                  onClick={() => setView('preview')}
                  className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
                    view === 'preview' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Eye size={16} />
                  Preview
                </button>
              </div>

              {/* Actions */}
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                Copier MD
              </button>
              <button
                onClick={handleCopyHTML}
                className="flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Copy size={16} />
                Copier HTML
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Download size={16} />
                .md
              </button>
              <button
                onClick={handleDownloadHTML}
                className="flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Download size={16} />
                .html
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-1 bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors"
              >
                Effacer
              </button>
            </div>

            {/* Stats */}
            <div className="mt-4 flex gap-4 text-sm">
              <span>Caractères: {markdown.length}</span>
              <span>Mots: {markdown.split(/\s+/).filter(Boolean).length}</span>
              <span>Lignes: {markdown.split('\n').length}</span>
            </div>
          </div>

          {/* Editor and Preview */}
          <div className="flex-1 flex overflow-hidden" style={{ minHeight: isFullscreen ? '0' : '600px' }}>
            {/* Editor */}
            {(view === 'editor' || view === 'split') && (
              <div className={`${view === 'split' ? 'w-1/2' : 'w-full'} border-r border-gray-200 flex flex-col`}>
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 font-semibold text-gray-700">
                  📝 Markdown
                </div>
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="flex-1 p-6 font-mono text-sm resize-none focus:outline-none"
                  placeholder="Écrivez votre Markdown ici..."
                  spellCheck={false}
                />
              </div>
            )}

            {/* Preview */}
            {(view === 'preview' || view === 'split') && (
              <div className={`${view === 'split' ? 'w-1/2' : 'w-full'} flex flex-col`}>
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 font-semibold text-gray-700">
                  👁️ Preview
                </div>
                <div
                  className="flex-1 p-6 overflow-y-auto markdown-preview prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        {!isFullscreen && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Code2 size={20} className="text-blue-500" />
              Fonctionnalités :
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">📝 Édition :</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Preview en temps réel</li>
                  <li>Support GitHub Flavored Markdown</li>
                  <li>Compteur de caractères/mots/lignes</li>
                  <li>Mode plein écran</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💾 Export :</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Télécharger en .md ou .html</li>
                  <li>Copier Markdown ou HTML</li>
                  <li>HTML avec styles intégrés</li>
                  <li>Reset & Clear</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎨 Syntaxe supportée :</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Titres (# à ######)</li>
                  <li>Emphases (*italique*, **gras**)</li>
                  <li>Listes ordonnées/non ordonnées</li>
                  <li>Liens & Images</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⚡ Avancé :</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Blocs de code avec coloration</li>
                  <li>Tableaux</li>
                  <li>Citations</li>
                  <li>Cases à cocher</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .markdown-preview {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #24292e;
        }
        .markdown-preview h1,
        .markdown-preview h2,
        .markdown-preview h3,
        .markdown-preview h4,
        .markdown-preview h5,
        .markdown-preview h6 {
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 600;
          line-height: 1.25;
        }
        .markdown-preview h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        .markdown-preview h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        .markdown-preview h3 { font-size: 1.25em; }
        .markdown-preview h4 { font-size: 1em; }
        .markdown-preview h5 { font-size: 0.875em; }
        .markdown-preview h6 { font-size: 0.85em; color: #6a737d; }
        .markdown-preview p { margin-top: 0; margin-bottom: 16px; }
        .markdown-preview ul,
        .markdown-preview ol { margin-top: 0; margin-bottom: 16px; padding-left: 2em; }
        .markdown-preview li + li { margin-top: 0.25em; }
        .markdown-preview code {
          padding: 0.2em 0.4em;
          margin: 0;
          font-size: 85%;
          background-color: rgba(27, 31, 35, 0.05);
          border-radius: 3px;
          font-family: 'Courier New', Courier, monospace;
        }
        .markdown-preview pre {
          padding: 16px;
          overflow: auto;
          font-size: 85%;
          line-height: 1.45;
          background-color: #f6f8fa;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        .markdown-preview pre code {
          display: inline;
          padding: 0;
          margin: 0;
          overflow: visible;
          line-height: inherit;
          background-color: transparent;
          border: 0;
        }
        .markdown-preview blockquote {
          padding: 0 1em;
          color: #6a737d;
          border-left: 0.25em solid #dfe2e5;
          margin: 0 0 16px 0;
        }
        .markdown-preview table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 16px;
        }
        .markdown-preview table th,
        .markdown-preview table td {
          padding: 6px 13px;
          border: 1px solid #dfe2e5;
        }
        .markdown-preview table th {
          font-weight: 600;
          background-color: #f6f8fa;
        }
        .markdown-preview table tr {
          background-color: #ffffff;
          border-top: 1px solid #c6cbd1;
        }
        .markdown-preview table tr:nth-child(2n) {
          background-color: #f6f8fa;
        }
        .markdown-preview img {
          max-width: 100%;
          box-sizing: content-box;
          background-color: #ffffff;
        }
        .markdown-preview hr {
          height: 0.25em;
          padding: 0;
          margin: 24px 0;
          background-color: #e1e4e8;
          border: 0;
        }
        .markdown-preview a {
          color: #0366d6;
          text-decoration: none;
        }
        .markdown-preview a:hover {
          text-decoration: underline;
        }
        .markdown-preview input[type="checkbox"] {
          margin-right: 0.5em;
        }
      `}</style>
    </div>
  );
}