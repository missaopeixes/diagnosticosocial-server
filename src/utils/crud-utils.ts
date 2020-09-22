

export function montarPaginacao(pagina: number, itensPorPagina: number) {

  return {
    offset: (pagina - 1) * itensPorPagina,
    limit: itensPorPagina
  };
};

export function montarConteudoPagina(lista: any[], pagina?: number, itensPorPagina?: number) {

  return {
    conteudo: lista,
    pagina: pagina,
    itensPorPagina: itensPorPagina,
    total: 0
  }
}