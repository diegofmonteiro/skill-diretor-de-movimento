// Adaptador de busca para o site "<ID>".
// Salvo em $DIRETOR_DE_MOVIMENTO_HOME/adaptadores/<ID>.mjs. Edite só a função buscar.
//
// Regras:
//  - Use `json(url)` ou `texto(url)` para acessar o site. Não use fetch direto:
//    assim valem o modo (automatico / travado / proprio), o tempo limite e a lista
//    de sites que você registrou.
//  - Devolva uma lista de { title, url, w, h, license, creator, page }.
//    `url` é o arquivo da imagem; `license` precisa ser uma das licenças que você
//    declarou ao registrar a fonte (senão o resultado é descartado).
//
// Exemplo para um site com busca em formato JSON:
const SITE = "SEU-SITE"; // troque pelo endereço do site, igual ao que você registrou (sem https://)

export async function buscar(consulta, { json, n = 20 }) {
  const d = await json("https://" + SITE + "/api/busca?q=" + encodeURIComponent(consulta) + "&limit=" + n);
  return (d.resultados || []).map((r) => ({
    title: r.titulo,
    url: r.imagem_url,
    w: r.largura,
    h: r.altura,
    license: r.licenca, // ex.: "CC0"
    creator: r.autor,
    page: r.pagina,
  }));
}
