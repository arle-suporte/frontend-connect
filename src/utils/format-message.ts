export const formatMessageText = (text: string): string => {
  if (!text) return '';

  return text
    // Negrito: *texto* -> <strong>texto</strong>
    .replace(/\*([^*\n]+?)\*/g, '<strong>$1</strong>')
    // Itálico: _texto_ -> <em>texto</em>
    .replace(/_([^_\n]+?)_/g, '<em>$1</em>')
    // Riscado: ~texto~ -> <del>texto</del>
    .replace(/~([^~\n]+?)~/g, '<del>$1</del>')
    // Quebras de linha: \n -> <br>
    .replace(/\n/g, '<br>');
};