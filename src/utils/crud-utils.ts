
const ITENS_POR_PAGINA_DEFAULT = 15;

export function montarPaginacao(pagina: number, itensPorPagina?: number) {
  const qtd = itensPorPagina || ITENS_POR_PAGINA_DEFAULT;

  return {
    offset: (pagina - 1) * qtd,
    limit: qtd
  };
};

export function montarConteudoPagina(lista: any[], pagina: number, itensPorPagina?: number) {

  return {
    conteudo: lista,
    pagina: pagina,
    itensPorPagina: itensPorPagina || ITENS_POR_PAGINA_DEFAULT,
    total: 0
  }
}