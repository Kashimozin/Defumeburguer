# Dêfumê Burger — HTML / CSS / JS

Versão 100% estática da landing page. Sem build, sem React, sem Node.

## Como usar
Abra `index.html` no navegador (duplo clique) ou publique a pasta inteira em qualquer hospedagem estática:
- Netlify, Vercel, GitHub Pages, Cloudflare Pages
- Hospedagem tradicional (cPanel, Hostgator, Locaweb...): envie os arquivos por FTP para a raiz do site.

## Estrutura
```
index.html      -> markup da página
styles.css      -> tema, layout e animações (CSS puro)
script.js       -> parallax, reveal, contadores, modal, lightbox
assets/         -> imagens
```

## Personalizar
- Cardápio: edite o array `PRODUCTS` no topo de `script.js`.
- WhatsApp: troque a constante `WA` em `script.js`.
- Cores/fontes: variáveis CSS em `:root` no topo de `styles.css`.
- Textos institucionais: direto no `index.html`.
