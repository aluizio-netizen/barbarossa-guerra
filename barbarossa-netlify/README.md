# Gabinete de Guerra — Operação Barbarossa
## Deploy no Netlify (múltiplos usuários, chave API protegida)

### Estrutura do projeto
```
barbarossa-netlify/
├── netlify.toml                  ← configuração do Netlify
├── netlify/
│   └── functions/
│       └── proxy.js              ← função serverless (guarda a chave API)
└── public/
    ├── index.html                ← interface principal
    └── app.js                    ← lógica do jogo
```

### Passo a passo para publicar

**1. Crie uma conta no Netlify**
→ https://app.netlify.com/signup (gratuito)

**2. Instale o Netlify CLI (opcional, para deploy local)**
```bash
npm install -g netlify-cli
```

**3. Faça o deploy**

**Opção A — Via GitHub (recomendado):**
1. Suba esta pasta para um repositório GitHub
2. No Netlify: "Add new site" → "Import an existing project" → conecte o GitHub
3. Configure:
   - Build command: (deixe vazio)
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
4. Clique em "Deploy site"

**Opção B — Via CLI:**
```bash
cd barbarossa-netlify
netlify deploy --prod --dir=public --functions=netlify/functions
```

**Opção C — Arraste e solte:**
No Netlify dashboard, arraste a pasta `public` para a área de deploy.
⚠️ Neste caso, a função proxy NÃO será incluída automaticamente — use o GitHub.

**4. Configure a variável de ambiente (OBRIGATÓRIO)**
No Netlify dashboard:
→ Site configuration → Environment variables → Add a variable
- Key: `ANTHROPIC_API_KEY`
- Value: `sk-ant-...` (sua chave da Anthropic)

Depois: **Deploys → Trigger deploy** para recarregar com a variável.

**5. Acesse e compartilhe**
O Netlify fornecerá uma URL como:
`https://seu-site.netlify.app`

Compartilhe essa URL com todos os usuários. Ninguém verá a chave API.

---

### Como funciona a proteção

```
Usuário (navegador)
      ↓  POST /.netlify/functions/proxy
Netlify Function (servidor)
      ↓  adiciona x-api-key do ambiente
API Anthropic
      ↓  resposta
Netlify Function
      ↓  repassa ao navegador
Usuário recebe a resposta
```

A chave API **nunca sai do servidor**. Nem inspecionando o código-fonte, nem o tráfego de rede do navegador, a chave fica visível.

---

### Controle de custos

Para limitar o gasto, no console da Anthropic:
→ https://console.anthropic.com → Settings → Limits
Configure um limite mensal em USD.

### Plano gratuito do Netlify

O plano gratuito inclui:
- 100 GB de banda/mês
- 125.000 chamadas de função serverless/mês
- Mais que suficiente para uso em sala de aula

---

### Suporte
Desenvolvido com Claude (Anthropic) — Simulação educacional Model UN.
