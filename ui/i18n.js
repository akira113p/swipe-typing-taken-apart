// Every piece of text on the page, in English (the default, for the judges) and Portuguese.
// Strings are our own, so the static ones may contain simple markup (<i>, <b>, footnote links).

const FN1 = '<a class="fn" href="#fn1">1</a>';
const FN2 = '<a class="fn" href="#fn2">2</a>';

export const TEXT = {
  en: {
    langButton: "Português",
    title: "Your finger never types the word",
    lead: `When you swipe across a phone keyboard, it does not work out which letters you crossed. It compares your line
      with the ideal line of every word it knows, {words} of them here, once for its <i>shape</i> and once for its
      <i>place</i> on the keys, and lets common words win close calls.${FN1}`,
    plate: "Plate I.",
    heading: "Swipe a word",
    hint: "Slide your finger (or mouse) across the keys. Or try:",
    keyboardLabel: "A keyboard you can swipe on",
    boardCaption: `Black: your swipe. Blue: the ideal line of the word you picked, with its tunnel in yellow and a red
      line from each point of your swipe to the matching point of the word.`,
    loading: "Loading the dictionary…",
    loadFailed: "The word list could not be loaded. Open the page through a web server.",
    takeApart: "Take it apart",
    shapeSwitch: "<b>Shape judge</b>: compares the drawing, ignoring its size and where you drew it.",
    placeSwitch: "<b>Place judge</b>: checks where on the keys you drew.",
    priorSwitch: "<b>Word frequency</b>: lets common words win close calls.",
    tipHint: `Try <i>tip</i>, then switch word frequency off: <i>tip</i> and <i>top</i> draw the same straight line,
      so nothing else can tell them apart.`,
    underHood: "Under the hood",
    thWord: "Word", thShape: "Shape gap", thPlace: "Place gap", thFrequency: "Per million words", thVote: "Vote",
    underCaption: `Shape gap: the average distance between matching points once both lines are scaled to the same box.
      Place gap: the same on the real keys, weighted towards the ends, or 0 if your swipe stays in the word's tunnel.
      Each gap becomes a likelihood with a bell curve, the judges are multiplied, and the result is multiplied by the
      word's frequency to the power 0.25.${FN2}`,
    honest: `<b>What is computed and what is drawn by hand.</b> Every line, number and vote is computed in your
      browser by our own code from your swipe. The keyboard drawing and the colours are decoration. The demo buttons
      slide along the word's keys with rounded corners; they are not recorded swipes.`,
    fn1: `The method is SHARK<sup>2</sup>: P.O. Kristensson and S. Zhai, “SHARK2: A Large Vocabulary Shorthand
      Writing System for Pen-based Computers”, UIST 2004. Phones today (Apple's QuickPath, Google's Gboard) add machine
      learning on top; their exact methods are not public.`,
    fn2: `The paper does not publish its tolerances. Ours (shape 0.12, place 0.5 keys, frequency weight 0.25) were
      tuned on simulated swipes. Word frequencies: <i>FrequencyWords</i> by Hermit Dave, from OpenSubtitles 2018,
      CC BY-SA 4.0.`,
    ofTheVote: "{share} of the vote",
    aheadOf: ", ahead of {word} ({share})",
    noWord: "No word is close enough to that line. Try again, or switch a judge off.",
    off: "off",
    inTunnel: "0 (in the tunnel)",
    keys: "{n} keys",
    stage_dictionary: "words in the dictionary",
    stage_ends: "start and end near your swipe",
    stage_shape: "close in shape",
    stage_place: "close in place",
    stage_vote: "in the final vote",
  },
  pt: {
    langButton: "English",
    title: "Seu dedo nunca digita a palavra",
    lead: `Quando você desliza o dedo no teclado do celular, ele não descobre por quais letras você passou. Ele compara
      a sua linha com a linha ideal de cada palavra que conhece, {words} aqui, uma vez pela <i>forma</i> e outra pelo
      <i>lugar</i> nas teclas, e deixa as palavras mais comuns ganharem os empates.${FN1}`,
    plate: "Prancha I.",
    heading: "Deslize uma palavra",
    hint: "Deslize o dedo (ou o mouse) pelas teclas. O dicionário é em inglês. Ou experimente:",
    keyboardLabel: "Um teclado para deslizar o dedo",
    boardCaption: `Preto: o seu traço. Azul: a linha ideal da palavra escolhida, com o túnel em amarelo e uma linha
      vermelha de cada ponto do seu traço até o ponto correspondente da palavra.`,
    loading: "Carregando o dicionário…",
    loadFailed: "Não foi possível carregar a lista de palavras. Abra a página por um servidor web.",
    takeApart: "Desmonte o mecanismo",
    shapeSwitch: "<b>Juiz da forma</b>: compara o desenho, ignorando o tamanho e onde você desenhou.",
    placeSwitch: "<b>Juiz do lugar</b>: confere em que parte do teclado você desenhou.",
    priorSwitch: "<b>Frequência da palavra</b>: deixa as palavras mais comuns ganharem os empates.",
    tipHint: `Experimente <i>tip</i> e depois desligue a frequência: <i>tip</i> e <i>top</i> desenham a mesma linha
      reta, então nada mais consegue separar as duas.`,
    underHood: "Por dentro",
    thWord: "Palavra", thShape: "Distância da forma", thPlace: "Distância do lugar", thFrequency: "Por milhão de palavras",
    thVote: "Voto",
    underCaption: `Distância da forma: a distância média entre os pontos correspondentes depois que as duas linhas são
      ajustadas à mesma caixa. Distância do lugar: o mesmo nas teclas de verdade, com mais peso nas pontas, ou 0 se o
      seu traço fica dentro do túnel da palavra. Cada distância vira uma probabilidade por uma curva de sino, os juízes
      são multiplicados e o resultado é multiplicado pela frequência da palavra elevada a 0,25.${FN2}`,
    honest: `<b>O que é calculado e o que é desenhado à mão.</b> Cada linha, número e voto é calculado no seu
      navegador pelo nosso próprio código, a partir do seu traço. O desenho do teclado e as cores são decoração. Os
      botões de exemplo deslizam pelas teclas da palavra com cantos arredondados; não são traços gravados.`,
    fn1: `O método é o SHARK<sup>2</sup>: P.O. Kristensson e S. Zhai, “SHARK2: A Large Vocabulary Shorthand Writing
      System for Pen-based Computers”, UIST 2004. Os celulares de hoje (QuickPath da Apple, Gboard do Google)
      acrescentam aprendizado de máquina por cima; os métodos exatos deles não são públicos.`,
    fn2: `O artigo não publica as suas tolerâncias. As nossas (forma 0,12, lugar 0,5 tecla, peso da frequência 0,25)
      foram calibradas com traços simulados. Frequência das palavras: <i>FrequencyWords</i>, de Hermit Dave, a partir
      do OpenSubtitles 2018, CC BY-SA 4.0.`,
    ofTheVote: "{share} dos votos",
    aheadOf: ", à frente de {word} ({share})",
    noWord: "Nenhuma palavra chega perto dessa linha. Tente de novo ou desligue um dos juízes.",
    off: "desligado",
    inTunnel: "0 (dentro do túnel)",
    keys: "{n} teclas",
    stage_dictionary: "palavras no dicionário",
    stage_ends: "começam e terminam perto do traço",
    stage_shape: "perto na forma",
    stage_place: "perto no lugar",
    stage_vote: "na votação final",
  },
};

/** Fills {name} placeholders in a translated string. */
export function translate(lang, key, params = {}) {
  const text = TEXT[lang][key] ?? TEXT.en[key];
  return text.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
}
