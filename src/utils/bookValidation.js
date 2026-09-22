export const GENEROS = [
  'Ficção',
  'Romance',
  'Fantasia',
  'Terror/Suspense',
  'Biografia',
  'Autoajuda',
  'Técnico/Acadêmico',
  'Infantil',
  'Outro',
];

const ANO_ATUAL = new Date().getFullYear();

export function validateBookForm({ titulo, autor, editora, anoPublicacao, genero, opiniao }) {
  if (!titulo || !titulo.trim()) {
    return 'Informe o nome do livro.';
  }
  if (!autor || !autor.trim()) {
    return 'Informe o autor do livro.';
  }
  if (!editora || !editora.trim()) {
    return 'Informe a editora.';
  }
  if (!anoPublicacao || !String(anoPublicacao).trim()) {
    return 'Informe o ano de publicação.';
  }
  if (!/^\d{4}$/.test(String(anoPublicacao).trim())) {
    return 'Informe um ano válido (4 dígitos), ex: 2020.';
  }
  const ano = Number(anoPublicacao);
  if (ano < 1400 || ano > ANO_ATUAL + 1) {
    return `Informe um ano entre 1400 e ${ANO_ATUAL + 1}.`;
  }
  if (!genero) {
    return 'Selecione um gênero.';
  }
  if (!opiniao || !opiniao.trim()) {
    return 'Escreva sua opinião sobre o livro.';
  }
  return null;
}
