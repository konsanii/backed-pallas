// API atualizada para o jogo "7 Erros" com apenas 3 blocos (HTML, CSS, JS), exibindo um aleatório por vez.

import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static('.'));

const codeBlocks = [
  {
    language: 'html',
    correct: [
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '  <title>Página Exemplo</title>',
      '</head>',
      '<body>',
      '  <h1>Bem vindo ao site</h1>',
      '  <img src="imagem.jpg" alt="Imagem">',
      '  <p>Este é um parágrafo</p>',
      '  <ul>',
      '    <li>Item 1</li>',
      '    <li>Item 2</li>',
      '  </ul>',
      '  <div class="conteudo">',
      '    <div>Outro conteúdo</div>',
      '  </div>',
      '</body>',
      '</html>'
    ]
  },
  {
    language: 'css',
    correct: [
      'body {',
      '  background-color: #f0f0f0;',
      '  font-family: Arial, sans-serif;',
      '  color: #333;',
      '}',
      '',
      '.container {',
      '  width: 80%;',
      '  margin: auto;',
      '  padding: 20px;',
      '  background-color: #fff;',
      '  border: 1px solid #000;',
      '}'
    ]
  },
  {
    language: 'javascript',
    correct: [
      'const nome = "Maria";',
      '',
      'if (nome === "Maria") {',
      '  console.log("Olá, Maria!");',
      '}',
      '',
      'function soma(a, b) {',
      '  return a + b;',
      '}',
      '',
      'let resultado = soma(2, 3);',
      'console.log("Resultado:", resultado);',
      '',
      'const idade = 25;'
    ]
  }
];

function inserirErros(linhas: string[], linguagem: string): string[] {
  let linhasComErro = [...linhas];

  if (linguagem === 'html') {
    linhasComErro = [
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '  <title>Página Exemplo<title>',
      '</head>',
      '<body>',
      '  <h1>Bem vindo ao site<h1>',
      '  <img src="imagem.jpg">',
      '  <p>Este é um parágrafo',
      '  <ul>',
      '    <li>Item 1',
      '    <li>Item 2</li>',
      '  </ul>',
      '  <div class="conteudo>',
      '  <div>Outro conteúdo</div',
      '</body>',
      '</html>'
    ];
  }

  if (linguagem === 'css') {
    linhasComErro = [
      'body {',
      '  background-color #f0f0f0;',
      '  font-family Arial, sans-serif',
      '  color: #333;',
      '}',
      '',
      '.container {',
      '  widht: 80%;',
      '  margin auto;',
      '  padding 20px',
      '  background-color: #fff;',
      '  border 1px solid #000',
      '}'
    ];
  }

  if (linguagem === 'javascript') {
    linhasComErro = [
      'const nome = "Maria"',
      '',
      'if nome === "Maria" {',
      '  console.log("Olá, Maria!")',
      '}',
      '',
      'function soma(a, b) {',
      '  return a + b',
      '}',
      '',
      'let resultado = soma(2 3)',
      'console.log("Resultado:" resultado);',
      '',
      'const idade;'
    ];
  }

  return linhasComErro;
}

app.get('/api/codes', (req: Request, res: Response) => {
  const selected = codeBlocks[Math.floor(Math.random() * codeBlocks.length)];
  const withErrors = inserirErros(selected.correct, selected.language);
  app.locals.currentGame = { original: withErrors, correct: selected.correct };
  res.json(withErrors);
});

app.post('/api/correct', (req: Request, res: Response) => {
  const { userAnswers } = req.body as { userAnswers: string[] };
  const correctBlock = app.locals.currentGame;

  if (!correctBlock || !Array.isArray(userAnswers)) {
     res.status(400).json({ error: 'Jogo não iniciado ou respostas inválidas.' });
  }

  let score = 7;
  const feedback: any[] = [];

  correctBlock.correct.forEach((line: string, i: number) => {
    const userLine = userAnswers[i]?.trim() || "";
    const correctLine = line.trim();
    if (userLine === correctLine) {
      feedback.push({ line: userLine, status: 'acertou' });
    } else {
      feedback.push({ line: userLine, status: 'errou', certo: correctLine });
      score--;
    }
  });

  res.json({ score: Math.max(score, 0), feedback });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
