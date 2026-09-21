# ECO — Código Perdido

## Sobre

**ECO — Código Perdido** é um aplicativo de jogo de adivinhação desenvolvido em React Native com Expo, onde o sistema ECO (uma inteligência artificial de recuperação de dados) tenta descobrir um código numérico secreto informado pelo usuário.

A ECO utiliza um **algoritmo de busca binária** para reduzir progressivamente o intervalo de possibilidades, encontrando o código com eficiência máxima. O usuário guia a ECO informando se o palpite é **maior** ou **menor** que o código secreto.

### Mecânica

1. O usuário escolhe um código secreto (número).
2. A ECO gera um palpite usando busca binária.
3. O usuário informa se o código é **maior** ou **menor** que o palpite.
4. A ECO ajusta o intervalo e gera um novo palpite.
5. O processo se repete até a ECO encontrar o código.
6. O desempenho é avaliado com um sistema de **estrelas** (1 a 3).

## Desenvolvedores

- **Luiz Gabriel Leli Pereira**

> Projeto acadêmico desenvolvido para a disciplina de Aplicativos Móveis — IFSP Campus Araraquara.

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React Native | Framework mobile |
| Expo (SDK 57) | Plataforma de desenvolvimento |
| JavaScript | Linguagem de programação |
| AsyncStorage | Persistência do recorde |
| Expo Font | Fontes personalizadas (Orbitron, Inter) |
| Expo Haptics | Vibração/feedback tátil |
| Expo Audio | Efeitos sonoros (clique e vitória) |
| Expo Linear Gradient | Gradiente de fundo |

## Pré-requisitos

- **Node.js 18+**
- **Expo Go** (app instalado no dispositivo)
- npm ou yarn

## Instalação

```bash
git clone <url-do-repositorio>
cd EcoCodigoPerdido
npm install
```

## Execução

```bash
npx expo start
```

Escaneie o QR code com o **Expo Go** no seu dispositivo, ou pressione `a` para abrir no emulador Android.

## Como jogar

1. **Escolha a dificuldade:**
   - 🛡️ **RECUPERAÇÃO** — Códigos de 1 a 50
   - 💻 **SISTEMA** — Códigos de 1 a 99
   - ⚠️ **COLAPSO** — Códigos de 1 a 200

2. **Digite o código secreto** que a ECO deverá encontrar.

3. **Pressione "INICIAR RECUPERAÇÃO"** para começar.

4. A ECO mostrará um palpite. Informe se o código é:
   - **MAIOR ↑** — o código secreto é maior que o palpite
   - **MENOR ↓** — o código secreto é menor que o palpite

5. Continue respondendo até a ECO encontrar o código.

6. Na tela de vitória, veja:
   - Número de tentativas
   - Avaliação com estrelas (★★★ para 1–5 tentativas)
   - Recorde da sessão

7. Pressione **"NOVA RECUPERAÇÃO"** para jogar novamente.

> ⚠️ A ECO detecta dicas contraditórias! Se você informar que o código é menor quando na verdade é maior, a ECO alertará a inconsistência.

## Estrutura

```
EcoCodigoPerdido/
├── App.js                          # Controlador de navegação e estados globais
├── screens/
│   ├── StartGameScreen.js          # Tela inicial (entrada + dificuldade)
│   ├── GameScreen.js               # Tela do jogo (busca binária)
│   ├── GameOverScreen.js           # Tela de vitória (resultado + animação)
│   └── EvilGameScreen.js           # Easter egg — Modo ??? (jogo invertido)
├── components/
│   ├── ui/
│   │   ├── Title.js                # Título reutilizável (props.children)
│   │   ├── Card.js                 # Container estilizado
│   │   ├── NumberContainer.js      # Exibição de número em destaque
│   │   └── ButtonsContainer.js     # Container horizontal para botões
│   └── game/
│       ├── PrimaryButton.js        # Botão principal (Pressable + ripple + som)
│       ├── GuessLogItem.js         # Item do histórico de tentativas
│       ├── DifficultySelector.js   # Seletor de dificuldade (3 modos)
│       └── StarRating.js           # Sistema de estrelas (avaliação)
├── constants/
│   └── Colors.js                   # Paleta de cores centralizada
├── assets/
│   ├── images/
│   │   └── bg.png                  # Imagem de fundo (circuitos digitais)
│   └── sounds/
│       ├── click.mp3               # Som de clique nos botões
│       └── sucess.mp3              # Som de vitória
└── app.json                        # Configuração do Expo
```

## Funcionalidades

- ✅ Busca binária real com redução progressiva do intervalo
- ✅ Validação de entrada (número, intervalo, vazio)
- ✅ Detecção de dicas contraditórias ("A ECO não erra")
- ✅ 3 modos de dificuldade (1–50, 1–99, 1–200)
- ✅ Histórico de tentativas com FlatList
- ✅ Sistema de estrelas (3 níveis de eficiência)
- ✅ Recorde da sessão com persistência (AsyncStorage)
- ✅ Animações de vitória (Animated API)
- ✅ Vibração/haptic feedback
- ✅ Efeitos sonoros (clique e vitória)
- ✅ Representação visual do intervalo de busca
- ✅ Fontes personalizadas (Orbitron + Inter)
- ✅ Tema escuro futurista/tecnológico
- ✅ Componentes reutilizáveis

## Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Tela Inicial</strong></td>
      <td align="center"><strong>Jogo em Andamento</strong></td>
    </tr>
    <tr>
      <td><img src="https://i.imgur.com/mGFsDf5.png" width="280" alt="Tela Inicial" /></td>
      <td><img src="https://i.imgur.com/T3qlEp5.png" width="280" alt="Jogo em Andamento - o palpite é 54" /></td>
    </tr>
    <tr>
      <td align="center"><strong>Usuário adiciona uma informação inconstante no palpite</strong></td>
      <td align="center"><strong>Tela de vitória</strong></td>
    </tr>
    <tr>
      <td><img src="https://i.imgur.com/GeBwaEQ.png" width="280" alt="Tela de Vitória" /></td>
      <td><img src="https://i.imgur.com/2YeSkNa.png" width="280" alt="Easter Egg — Modo ???" /></td>
    </tr>
  </table>
</div>