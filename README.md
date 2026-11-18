# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Pagamentos Pix (Pixzy)

### Variáveis de ambiente

| Variável | Obrigatória | Onde configurar |
| --- | --- | --- |
| `PIXZY_API_TOKEN` | Sim | Vercel → Project Settings → Environment Variables (somente servidor) |
| `PIXZY_WEBHOOK_SECRET` | Opcional | Segredo compartilhado para validar a assinatura HMAC do webhook |
| `PUBLIC_APP_URL` | Opcional | URL pública usada para montar o `webhook_url` enviado à Pixzy |

O token é lido apenas no servidor, via `process.env.PIXZY_API_TOKEN`, dentro dos handlers.
Nunca use `NEXT_PUBLIC_PIXZY_API_TOKEN`, não coloque o valor real em `.env.example`, no
frontend, em logs ou no banco. Se a variável faltar, a API responde com erro genérico e
registra apenas "configuração ausente".

### Endpoints criados

| Endpoint | Método | Função |
| --- | --- | --- |
| `/api/pix` | POST | Valida os dados, calcula o valor no servidor, cria o pedido interno e a cobrança Pix na Pixzy. Idempotente por `checkoutRef`. |
| `/api/pix/status?orderId=...` | GET | Status oficial do pedido para o frontend (`pending`, `paid`, `expired`, `failed`, `cancelled`). |
| `/api/public/webhooks/pixzy` | POST | Recebe os eventos `paid`, `expired` e `failed` da Pixzy. |

### Fluxo

1. O cliente preenche identificação, endereço, frete e seguro no checkout.
2. A tela do Pix envia o pedido para `/api/pix` (nunca para a Pixzy diretamente).
3. O backend valida nome, e-mail, CPF/CNPJ, telefone, itens, frete e garantia.
4. O valor é calculado a partir do catálogo do servidor (`src/lib/pixzy-core.ts`); qualquer
   valor enviado pelo frontend é ignorado.
5. O pedido é gravado em `orders`; se já existir cobrança pendente para o mesmo
   `checkoutRef`, ela é reutilizada em vez de gerar uma nova.
6. A Pixzy devolve o `br_code`, salvo em `payments` e exibido como Pix copia e cola.
7. Ao receber o pagamento, a Pixzy chama o webhook; o backend valida evento, pedido,
   transação, valor e status, grava o evento em `payment_events` (idempotência) e muda o
   pedido para `paid`.
8. A tela do Pix consulta `/api/pix/status` a cada 5 segundos e mostra "Pagamento aprovado!"
   somente quando o backend confirma.

Valor divergente entre webhook e pedido nunca marca como pago: o pedido permanece pendente
e o evento fica registrado como `valor_divergente`.

### Testar em desenvolvimento

```bash
bun install
bun run dev
bunx vitest run          # testes de validação, preço, status e idempotência
```

Sem `PIXZY_API_TOKEN` configurado, `/api/pix` responde com a mensagem amigável
"Pagamento indisponível no momento" — nenhum Pix falso é gerado.

### Testar o webhook

```bash
curl -X POST http://localhost:8080/api/public/webhooks/pixzy \
  -H 'Content-Type: application/json' \
  -d '{"event":"paid","transaction":{"id":8492,"amount":4990,"status":"paid","metadata":{"pedido_id":"ML-SEUCODIGO"}}}'
```

Use o `orderCode` retornado por `/api/pix` como `pedido_id`. Repetir o mesmo POST não altera
o pedido novamente (idempotência). Com `PIXZY_WEBHOOK_SECRET` definido, envie o header
`x-pixzy-signature` com o HMAC SHA-256 hexadecimal do corpo bruto.

### Banco de dados

- `orders` — pedido interno, valor em centavos, cliente, endereço, itens, frete e status.
- `payments` — provedor, `provider_transaction_id`, `br_code`, valor, status, datas.
- `payment_events` — eventos recebidos, com chave única para idempotência.

Nenhuma dessas tabelas é acessível pelo navegador: o acesso é exclusivo do servidor.
