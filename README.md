# Rodrigues Açaí — Monte Seu Pedido (modo independente)

Montador mobile no mesmo estilo roxo e verde do projeto Rodrigues, com **catálogo estático** (arquivo `catalogo-estatico.json`), sacola local, cálculo dos complementos e compartilhamento pelo WhatsApp. Sem chamadas a Supabase ou Firebase ao montar o pedido.

## Arquivos

- `index.html`: interface e montagem com 8 etapas (incluindo sacola).
- `catalogo-estatico.json`: snapshot de bases, tamanhos, acompanhamentos, coberturas e adicionais ativos, atualizado em 21/11/2026.
- `sw.js`: cache de páginas, catálogo e imagens visitadas quando o navegador permite.
- `manifest.webmanifest` e `icon.svg`: instalação como PWA.

## Publicação

Hospede todos os arquivos **juntos, no mesmo diretório**, em Firebase Hosting, Netlify ou GitHub Pages. Não precisa de chaves de banco. O único acesso de catálogo é a um arquivo JSON estático no próprio domínio.

As imagens têm endereços fixos de serviços de imagens já utilizados no cadastro da loja (em geral i.ibb.co). Elas não consultam Supabase nem Firebase, mas ainda dependem do serviço de imagens na primeira visita. Para independência completa, é necessário mover fotos próprias/licenciadas para uma pasta local e trocar os endereços no JSON; o Service Worker pode manter cópias das que já foram visualizadas.

O backup **não recebe pedidos em um banco**: gera resumo para copiar ou enviar pelo WhatsApp e exige confirmação da loja. Preços e disponibilidade ficam congelados até uma nova publicação. O preço Nutella 60 ml foi ajustado para R$ 8,50 conforme orientação da loja, apesar de o registro antigo ainda conter R$ 8,00.

Não conecte um checkout automático a esse backup antes de implementar armazenamento e confirmação confiáveis, com prevenção de duplicidade.
