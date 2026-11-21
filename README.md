# Rodrigues Açaí — Monte Seu Pedido (modo independente)

Montador mobile no mesmo estilo roxo e verde do projeto Rodrigues, com **catálogo estático** (arquivo `catalogo-estatico.json`), sacola local, cálculo dos complementos e compartilhamento pelo WhatsApp. Sem chamadas a Supabase ou Firebase ao montar o pedido.

## Arquivos

- `index.html`: interface e montagem com 8 etapas (incluindo sacola).
- `catalogo-estatico.json`: snapshot de bases, tamanhos, acompanhamentos, coberturas e adicionais ativos, atualizado em 21/11/2026.
- `sw.js`: cache de páginas, catálogo e imagens visitadas quando o navegador permite.
- `manifest.webmanifest` e `icon.svg`: instalação como PWA.

## Publicação

Hospede todos os arquivos **juntos, no mesmo diretório**, em Firebase Hosting, Netlify ou GitHub Pages. Não precisa de chaves de banco. O catálogo também está **embutido no HTML**. A montagem não faz nenhuma chamada de rede ao banco nem ao arquivo JSON; o JSON fica como fonte de atualização e para a etapa de preparação das imagens.

As imagens usam links fixos já cadastrados na loja. O script de publicação `scripts/preparar.mjs` tenta copiar imagens de `i.ibb.co` para o site e substitui os caminhos no HTML publicado. Quando a cópia falha, mantém o endereço original como fallback; outras imagens de terceiros permanecem externas. Somente fotos com direitos de uso devem ser republicadas. O Service Worker guarda em cache imagens visitadas quando possível.

O backup **não recebe pedidos em um banco**: gera resumo para copiar ou enviar pelo WhatsApp e exige confirmação da loja. Preços e disponibilidade ficam congelados até uma nova publicação. O preço Nutella 60 ml foi ajustado para R$ 8,50 conforme orientação da loja, apesar de o registro antigo ainda conter R$ 8,00.

Não conecte um checkout automático a esse backup antes de implementar armazenamento e confirmação confiáveis, com prevenção de duplicidade.

## Ativação do site de reserva

A publicação automática usa GitHub Actions + GitHub Pages. Se Pages ainda não estiver ativado, abra **Settings → Pages → Build and deployment → Source: GitHub Actions**, salve e execute o workflow `Publicar Montador Independente` pela aba **Actions**. Não confundir o código criado com uma publicação já ativa.
