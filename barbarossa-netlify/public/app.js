// ── PROXY ENDPOINT ────────────────────────────────────
const API = '/.netlify/functions/proxy';

async function callAPI(body) {
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

// ── GAME DATA ─────────────────────────────────────────
const DAYS=[
  {day:1,date:'22 Jun 1941',time:'03:15h',situation:[{l:'Wehrmacht',v:'Avançando',c:'g'},{l:'Luftwaffe',v:'Superioridade',c:'g'},{l:'URSS Defesa',v:'Desorientada',c:'r'},{l:'Comunic. SV',v:'Cortadas',c:'r'},{l:'Suprimento',v:'Monit.',c:'a'}],forces:[{l:'Avanço Centro',v:'0–30 km'},{l:'Avanço Norte',v:'0–20 km'},{l:'Avanço Sul',v:'0–15 km'},{l:'Aviões SV destr.',v:'~800'}],quick:[{i:'🎯',t:'Qual é o objetivo prioritário: Moscou, Leningrado ou Kiev?'},{i:'🛡️',t:'Qual a velocidade de avanço esperada dos Grupos Panzer?'},{i:'🇷🇺',t:'Como reorganizar a defesa soviética após o ataque surpresa?'},{i:'📦',t:'Quais são os maiores riscos logísticos da operação?'},{i:'⚔️',t:'Devemos avançar sobre Moscou ou consolidar flancos primeiro?'}]},
  {day:3,date:'24 Jun 1941',time:'06:00h',situation:[{l:'Wehrmacht',v:'Avanço Rápido',c:'g'},{l:'Luftwaffe',v:'Dominante',c:'g'},{l:'URSS Defesa',v:'Colapsando',c:'r'},{l:'Cerco Bialystok',v:'Em curso',c:'a'},{l:'Suprimento',v:'Tenso',c:'a'}],forces:[{l:'Avanço Centro',v:'~150 km'},{l:'Avanço Norte',v:'~100 km'},{l:'Avanço Sul',v:'~80 km'},{l:'Aviões SV destr.',v:'~2.000'}],quick:[{i:'🎯',t:'O cerco de Bialystok está se fechando — quais são os próximos passos?'},{i:'🛡️',t:'Os Panzers devem parar para esperar a infantaria ou continuar?'},{i:'🇷🇺',t:'Como Stalin está reagindo ao colapso das defesas?'},{i:'📦',t:'As linhas de suprimento acompanham o avanço?'},{i:'⚔️',t:'Minsk pode ser cercada antes que os soviéticos recuem?'}]},
  {day:7,date:'28 Jun 1941',time:'12:00h',situation:[{l:'Wehrmacht',v:'Cercos Ativos',c:'g'},{l:'Luftwaffe',v:'Superioridade',c:'g'},{l:'Cerco Minsk',v:'Fechado',c:'a'},{l:'URSS Reservas',v:'Mobilizando',c:'a'},{l:'Suprimento',v:'Crítico',c:'r'}],forces:[{l:'Avanço Centro',v:'~320 km'},{l:'Avanço Norte',v:'~250 km'},{l:'Avanço Sul',v:'~150 km'},{l:'Prisioneiros SV',v:'~300.000'}],quick:[{i:'🎯',t:'Minsk foi cercada — devemos avançar para Smolensk?'},{i:'🛡️',t:'Como lidar com os prisioneiros soviéticos capturados?'},{i:'🇷🇺',t:'Stalin declarou guerra total — como isso muda a situação?'},{i:'📦',t:'O suprimento está crítico — como resolver?'},{i:'⚔️',t:'Os soviéticos contraatacam — qual a melhor resposta?'}]},
  {day:14,date:'5 Jul 1941',time:'08:00h',situation:[{l:'Wehrmacht',v:'Avançando',c:'g'},{l:'Luftwaffe',v:'Ativa',c:'g'},{l:'URSS Defesa',v:'Reorganizando',c:'a'},{l:'Resistência SV',v:'Aumentando',c:'a'},{l:'Suprimento',v:'Grave',c:'r'}],forces:[{l:'Avanço Centro',v:'~500 km'},{l:'Avanço Norte',v:'~400 km'},{l:'Avanço Sul',v:'~250 km'},{l:'Prisioneiros SV',v:'~600.000'}],quick:[{i:'🎯',t:'Smolensk está à vista — como garantir sua captura?'},{i:'🛡️',t:'Os Panzers estão desgastados — pausar para manutenção?'},{i:'🇷🇺',t:'As novas divisões soviéticas chegam — como neutralizá-las?'},{i:'📦',t:'A logística está falhando — soluções imediatas?'},{i:'⚔️',t:'Desviar forças para ajudar o Grupo Sul em Kiev?'}]},
  {day:30,date:'22 Jul 1941',time:'10:00h',situation:[{l:'Wehrmacht',v:'Desacelerando',c:'a'},{l:'Luftwaffe',v:'Ativa',c:'g'},{l:'Smolensk',v:'Cercada',c:'a'},{l:'Resistência SV',v:'Feroz',c:'r'},{l:'Suprimento',v:'Crítico',c:'r'}],forces:[{l:'Avanço Centro',v:'~700 km'},{l:'Avanço Norte',v:'~550 km'},{l:'Avanço Sul',v:'~350 km'},{l:'Baixas Eixo',v:'~100.000'}],quick:[{i:'🎯',t:'A resistência soviética aumentou — o que mudou?'},{i:'🛡️',t:'Devemos priorizar Moscou ou consolidar Smolensk?'},{i:'🇷🇺',t:'A URSS está recebendo ajuda externa — qual o impacto?'},{i:'📦',t:'As perdas de tanques são alarmantes — como reequipar?'},{i:'⚔️',t:'Hitler quer desviar Panzers para o sul — você concorda?'}]},
  {day:54,date:'14 Ago 1941',time:'09:00h',situation:[{l:'Wehrmacht',v:'Reorganizando',c:'a'},{l:'Leningrado',v:'Sitiada',c:'a'},{l:'Grupo Centro',v:'Pausado',c:'a'},{l:'Grupo Sul',v:'Avançando',c:'g'},{l:'Suprimento',v:'Crítico',c:'r'}],forces:[{l:'Avanço Norte',v:'~700 km'},{l:'Avanço Sul (Kiev)',v:'~600 km'},{l:'Leningrado',v:'Cerco iniciado'},{l:'Baixas Eixo',v:'~200.000'}],quick:[{i:'🎯',t:'Hitler ordenou pausa no Grupo Centro — estratégia correta?'},{i:'🛡️',t:'O cerco a Leningrado está se fechando — qual o próximo passo?'},{i:'🇷🇺',t:'Como a URSS está resistindo ao cerco de Leningrado?'},{i:'📦',t:'Os suprimentos para o Grupo Norte estão críticos — soluções?'},{i:'⚔️',t:'Devemos tomar Leningrado pelo assalto ou pelo bloqueio?'}]},
  {day:82,date:'12 Set 1941',time:'07:00h',situation:[{l:'Wehrmacht',v:'Envolvendo Kiev',c:'g'},{l:'Leningrado',v:'Bloqueada',c:'a'},{l:'Grupo Centro',v:'Reagrupando',c:'a'},{l:'URSS',v:'Perdas Enormes',c:'r'},{l:'Suprimento',v:'Grave',c:'r'}],forces:[{l:'Cerco de Kiev',v:'Fechando'},{l:'Prisioneiros SV',v:'~1.500.000'},{l:'Leningrado',v:'Isolada'},{l:'Baixas Eixo',v:'~350.000'}],quick:[{i:'🎯',t:'O cerco de Kiev está quase completo — impacto estratégico?'},{i:'🛡️',t:'Guderian foi desviado para o sul — ele concorda com a decisão?'},{i:'🇷🇺',t:'Jukov foi removido do comando — o que isso significa?'},{i:'📦',t:'As linhas de suprimento estão colapsando — como resolver?'},{i:'⚔️',t:'Com Kiev tomada, é possível ainda atacar Moscou em 1941?'}]},
  {day:100,date:'30 Set 1941',time:'05:30h',situation:[{l:'Operação Tufão',v:'Iniciada',c:'g'},{l:'Kiev',v:'Capturada',c:'g'},{l:'Grupo Centro',v:'Avançando',c:'g'},{l:'URSS Defesa',v:'Desesperada',c:'r'},{l:'Inverno',v:'Aproximando',c:'a'}],forces:[{l:'Avanço sobre Moscou',v:'Retomado'},{l:'Panzers disponíveis',v:'~50% do original'},{l:'Prisioneiros SV',v:'~2.500.000'},{l:'Baixas Eixo',v:'~500.000'}],quick:[{i:'🎯',t:'A Operação Tufão foi lançada — é tarde demais para vencer?'},{i:'🛡️',t:'Os Panzers estão desgastados — conseguirão chegar a Moscou?'},{i:'🇷🇺',t:'Moscou será evacuada ou defendida até o fim?'},{i:'📦',t:'O inverno está chegando — as tropas estão equipadas?'},{i:'⚔️',t:'Vyazma e Bryansk estão cercadas — qual o próximo objetivo?'}]},
  {day:120,date:'20 Out 1941',time:'08:00h',situation:[{l:'Cerco Vyazma',v:'Concluído',c:'g'},{l:'Lama Outonal',v:'Rasputitsa',c:'r'},{l:'Avanço',v:'Paralisado',c:'r'},{l:'URSS',v:'Mobilizando Sibéria',c:'a'},{l:'Moral Eixo',v:'Abalado',c:'a'}],forces:[{l:'Avanço sobre Moscou',v:'~100 km'},{l:'Panzers operacionais',v:'~30%'},{l:'Prisioneiros SV',v:'~3.000.000'},{l:'Baixas Eixo',v:'~650.000'}],quick:[{i:'🎯',t:'A lama paralisou o avanço — esperar o inverno congelar o solo?'},{i:'🛡️',t:'As divisões siberianas estão chegando — como neutralizá-las?'},{i:'🇷🇺',t:'Stalin permaneceu em Moscou — qual o impacto no moral soviético?'},{i:'📦',t:'Sem equipamento de inverno — quem é responsável por esse erro?'},{i:'⚔️',t:'O general Inverno está chegando — devemos recuar para posições defensivas?'}]},
  {day:145,date:'15 Nov 1941',time:'06:00h',situation:[{l:'Solo Congelado',v:'Avanço retomado',c:'a'},{l:'Temperatura',v:'-15°C',c:'r'},{l:'Moscou',v:'~50 km',c:'a'},{l:'Reforços SV',v:'Chegando',c:'r'},{l:'Suprimento',v:'Colapsado',c:'r'}],forces:[{l:'Distância de Moscou',v:'~50 km'},{l:'Tanques operacionais',v:'~20%'},{l:'Infantaria',v:'Exausta'},{l:'Baixas Eixo',v:'~800.000'}],quick:[{i:'🎯',t:'Moscou está a 50 km — um último esforço pode tomá-la?'},{i:'🛡️',t:'As tropas não têm equipamento de inverno — como combater assim?'},{i:'🇷🇺',t:'Jukov assumiu a defesa de Moscou — qual sua estratégia?'},{i:'📦',t:'As linhas de suprimento estão completamente colapsadas — o que fazer?'},{i:'⚔️',t:'Devemos suspender o ataque e consolidar posições para o inverno?'}]},
  {day:163,date:'3 Dez 1941',time:'04:00h',situation:[{l:'Avanço Alemão',v:'Estagnado',c:'r'},{l:'Temperatura',v:'-35°C',c:'r'},{l:'Moscou',v:'Não tomada',c:'r'},{l:'Cont. Soviético',v:'Iminente',c:'r'},{l:'Moral Eixo',v:'Crítico',c:'r'}],forces:[{l:'Distância de Moscou',v:'~30 km'},{l:'Divisões combatentes',v:'Esgotadas'},{l:'Reforços SV',v:'20+ divisões'},{l:'Baixas Eixo',v:'~900.000'}],quick:[{i:'🎯',t:'O avanço foi definitivamente detido — quando recuar?'},{i:'🛡️',t:'Hitler proibiu recuos — como sobreviver ao inverno russo?'},{i:'🇷🇺',t:'O contraataque soviético está prestes a começar — qual a magnitude?'},{i:'📦',t:'Homens estão morrendo de frio — quem será responsabilizado?'},{i:'⚔️',t:'Brauchitsch pediu demissão — quem deve comandar agora?'}]},
  {day:175,date:'15 Dez 1941',time:'03:00h',situation:[{l:'Cont. Soviético',v:'Em curso',c:'r'},{l:'Wehrmacht',v:'Recuando',c:'r'},{l:'Hitler',v:'Proibiu recuos',c:'r'},{l:'Leningrado',v:'Sitiada',c:'a'},{l:'Japão x EUA',v:'Guerra declarada',c:'a'}],forces:[{l:'Recuo Grupo Centro',v:'Em andamento'},{l:'Baixas totais Eixo',v:'~1.000.000'},{l:'Divisões SV ativas',v:'280+'},{l:'Frente estabilizada',v:'Não'}],quick:[{i:'🎯',t:'O contraataque soviético surpreendeu — a Barbarossa fracassou?'},{i:'🛡️',t:'Hitler assumiu o comando direto do Exército — consequências?'},{i:'🇷🇺',t:'As divisões siberianas foram decisivas — por que não foram previstas?'},{i:'📦',t:'A logística alemã colapsou completamente — lições aprendidas?'},{i:'⚔️',t:'Os EUA entraram na guerra — como isso muda o quadro estratégico?'}]},
  {day:192,date:'31 Dez 1941',time:'23:59h',situation:[{l:'Barbarossa',v:'Fracassada',c:'r'},{l:'Wehrmacht',v:'Na defensiva',c:'r'},{l:'URSS',v:'Contra-ofensiva',c:'g'},{l:'Leningrado',v:'Sitiada',c:'r'},{l:'Guerra Mundial',v:'Ampliada',c:'r'}],forces:[{l:'Território SV ocupado',v:'~1.500.000 km²'},{l:'Baixas totais Eixo',v:'~1.100.000'},{l:'Baixas totais URSS',v:'~4.000.000'},{l:'Moscou',v:'Não conquistada'}],quick:[{i:'🎯',t:'Balanço final de 1941 — a Alemanha pode ainda vencer a guerra?'},{i:'🛡️',t:'Quais foram os maiores erros estratégicos da Barbarossa?'},{i:'🇷🇺',t:'Por que a URSS sobreviveu contra todas as expectativas?'},{i:'📦',t:'A logística foi o calcanhar de Aquiles alemão — análise final?'},{i:'⚔️',t:'O que 1942 reserva para a Frente Oriental?'}]}
];

const DIR_TYPES={solicitacao:'Solicitação de Informação',correspondencia:'Correspondência Entre Personagens',negociacao:'Negociação / Acordo',espionagem:'Espionagem / Inteligência Militar',imprensa:'Comunicado de Imprensa',plano:'Plano de Batalha',reestruturacao:'Reestruturação Militar',impostos:'Administração de Territórios Ocupados'};

const D={
  hitler:{name:'Adolf Hitler',soviet:false,persona:'Você é Adolf Hitler durante a Operação Barbarossa. Confiante, dogmático, dramático e autoritário. Simulação educacional. Responda em'},
  brauchitsch:{name:'Walther von Brauchitsch',soviet:false,persona:'Você é o Feldmareshal von Brauchitsch. General prussiano profissional, preciso e técnico. Simulação educacional. Responda em'},
  halder:{name:'Franz Halder',soviet:false,persona:'Você é o General Franz Halder, Chefe do Estado-Maior. Analítico e meticuloso. Simulação educacional. Responda em'},
  bock:{name:'Fedor von Bock',soviet:false,persona:'Você é o Feldmareshal von Bock, Grupo de Exércitos Centro. Simulação educacional. Responda em'},
  rundstedt:{name:'Gerd von Rundstedt',soviet:false,persona:'Você é o Feldmareshal von Rundstedt, Grupo de Exércitos Sul. Simulação educacional. Responda em'},
  leeb:{name:'Wilhelm von Leeb',soviet:false,persona:'Você é o Feldmareshal von Leeb, Grupo de Exércitos Norte. Simulação educacional. Responda em'},
  guderian:{name:'Heinz Guderian',soviet:false,persona:'Você é o General Guderian, 2ª Gruppe Panzer. Apaixonado pela Blitzkrieg. Simulação educacional. Responda em'},
  reichenau:{name:'Walter von Reichenau',soviet:false,persona:'Você é o Feldmareshal von Reichenau, 6º Exército. Simulação educacional histórica. Responda em'},
  timoshenko:{name:'Semyon Timoshenko',soviet:true,persona:'Você é o Marechal Timoshenko, Narkom da Defesa da URSS. Simulação educacional. Responda em'},
  zhukov:{name:'Gueórgui Jukov',soviet:true,persona:'Você é o General Jukov, Chefe do Estado-Maior soviético. Pragmático e determinado. Simulação educacional. Responda em'},
  stalin:{name:'Josef Stalin',soviet:true,persona:'Você é Josef Stalin, Comandante Supremo da URSS. Autoritário e determinado. Simulação educacional. Responda em'},
  goebbels:{name:'Joseph Goebbels',soviet:false,persona:'Você é Joseph Goebbels, Ministro da Propaganda do Reich. Eloquente e apaixonado. Simulação educacional. Responda em'}
};

// ── MAP ───────────────────────────────────────────────
let mapLeaflet=null,animFrame=null,animStep=0,animPlaying=false;
let frontLayers=[],sovietLayers=[],cityMarkers=[];
const TOTAL_STEPS=80;
const GEO_FRONTS=[
  {norte:[[56.0,22.0],[55.0,24.5],[54.0,25.5]],centro:[[54.0,25.5],[52.5,27.0],[51.5,27.5]],sul:[[51.5,27.5],[50.0,28.5],[48.5,30.0],[47.0,31.5]]},
  {norte:[[56.5,22.5],[55.5,25.0],[54.5,26.5]],centro:[[54.5,26.5],[53.0,28.0],[52.0,28.5]],sul:[[52.0,28.5],[50.5,29.5],[49.0,31.0],[47.5,32.0]]},
  {norte:[[57.0,23.5],[56.0,26.0],[55.0,27.5]],centro:[[55.0,27.5],[54.0,29.0],[53.0,30.0]],sul:[[53.0,30.0],[51.5,31.5],[50.0,32.5],[48.0,33.0]]},
  {norte:[[57.5,24.5],[56.5,27.0],[55.5,28.5]],centro:[[55.5,28.5],[54.5,30.5],[53.5,32.0]],sul:[[53.5,32.0],[52.0,33.0],[50.5,34.0],[48.5,34.5]]},
  {norte:[[58.0,25.5],[57.0,28.0],[56.0,29.5]],centro:[[56.0,29.5],[55.0,31.5],[54.0,33.0]],sul:[[54.0,33.0],[52.5,34.0],[51.0,35.5],[49.0,36.0]]},
  {norte:[[59.5,27.0],[58.5,29.5],[57.5,30.5]],centro:[[57.5,30.5],[56.0,32.0],[55.0,33.5]],sul:[[55.0,33.5],[53.5,34.5],[52.0,36.0],[50.0,37.0]]},
  {norte:[[60.0,28.0],[59.0,30.5],[58.0,31.5]],centro:[[58.0,31.5],[56.5,33.0],[55.5,34.5]],sul:[[55.5,34.5],[54.0,35.5],[52.0,37.0],[50.5,38.0]]},
  {norte:[[60.5,28.5],[59.5,31.0],[58.5,32.5]],centro:[[58.5,32.5],[57.0,34.0],[56.0,35.5]],sul:[[56.0,35.5],[54.5,36.5],[53.0,37.5],[51.0,38.5]]},
  {norte:[[60.5,29.0],[59.5,31.5],[58.5,33.0]],centro:[[58.5,33.0],[57.0,34.5],[56.0,36.0]],sul:[[56.0,36.0],[54.5,37.0],[53.0,38.0],[51.5,39.0]]},
  {norte:[[60.5,29.5],[59.5,32.0],[58.5,33.5]],centro:[[58.5,33.5],[57.5,35.5],[56.5,37.0]],sul:[[56.5,37.0],[55.0,38.0],[53.5,39.0],[52.0,40.0]]},
  {norte:[[60.5,29.5],[59.5,32.0],[58.5,33.5]],centro:[[58.5,33.5],[57.5,36.0],[56.5,37.5]],sul:[[56.5,37.5],[55.0,38.5],[53.5,39.5],[52.0,40.5]]},
  {norte:[[60.5,29.0],[59.5,31.5],[58.5,33.0]],centro:[[58.5,33.0],[57.0,35.0],[56.0,36.5]],sul:[[56.0,36.5],[54.5,37.5],[53.0,38.5],[51.5,39.5]]},
  {norte:[[60.0,28.5],[59.0,31.0],[58.0,32.5]],centro:[[58.0,32.5],[56.5,34.0],[55.5,35.5]],sul:[[55.5,35.5],[54.0,36.5],[52.5,37.5],[51.0,38.5]]}
];
const GEO_SOVIET=[
  [[57.5,28.0],[56.0,30.0],[55.0,31.0],[53.5,32.0],[52.0,33.0],[50.0,34.5]],
  [[58.0,29.0],[57.0,31.0],[55.5,32.5],[54.0,33.5],[52.5,34.5],[50.5,35.5]],
  [[58.5,30.5],[57.5,32.5],[56.0,34.0],[54.5,35.0],[53.0,36.0],[51.0,37.0]],
  [[59.0,31.5],[58.0,33.5],[56.5,35.0],[55.0,36.0],[53.5,37.0],[51.5,38.0]],
  [[59.5,32.5],[58.5,34.5],[57.0,36.0],[55.5,37.0],[54.0,38.0],[52.0,39.0]],
  [[60.0,33.5],[59.0,35.5],[57.5,37.0],[56.0,38.0],[54.5,39.0],[52.5,40.0]],
  [[60.5,34.5],[59.5,36.5],[58.0,38.0],[56.5,39.0],[55.0,40.0],[53.0,41.0]],
  [[60.5,35.0],[59.5,37.0],[58.0,38.5],[56.5,39.5],[55.0,40.5],[53.5,41.5]],
  [[60.5,35.5],[59.5,37.5],[58.0,39.0],[56.5,40.0],[55.0,41.0],[53.5,42.0]],
  [[60.5,36.0],[59.5,38.0],[58.5,39.5],[57.0,40.5],[55.5,41.5],[54.0,42.5]],
  [[60.5,36.5],[59.5,38.5],[58.5,40.0],[57.0,41.0],[55.5,42.0],[54.0,43.0]],
  [[60.5,35.5],[59.5,37.5],[58.0,39.0],[56.5,40.0],[55.0,41.0],[53.5,42.0]],
  [[60.5,34.5],[59.0,36.5],[57.5,38.0],[56.0,39.0],[54.5,40.0],[53.0,41.0]]
];
const GEO_CITIES=[
  {name:'Berlim',lat:52.5,lng:13.4,major:true,axis:true,conqueredDay:-1},
  {name:'Varsóvia',lat:52.2,lng:21.0,major:true,axis:true,conqueredDay:-1},
  {name:'Königsberg',lat:54.7,lng:20.5,major:false,axis:true,conqueredDay:-1},
  {name:'Riga',lat:56.9,lng:24.1,major:true,axis:false,conqueredDay:1},
  {name:'Vilnius',lat:54.7,lng:25.3,major:false,axis:false,conqueredDay:0},
  {name:'Minsk',lat:53.9,lng:27.6,major:true,axis:false,conqueredDay:2},
  {name:'Smolensk',lat:54.8,lng:32.0,major:true,axis:false,conqueredDay:4},
  {name:'Moscou',lat:55.75,lng:37.6,major:true,axis:false,conqueredDay:-1},
  {name:'Leningrado',lat:59.95,lng:30.3,major:true,axis:false,conqueredDay:-1},
  {name:'Kiev',lat:50.45,lng:30.5,major:true,axis:false,conqueredDay:6},
  {name:'Odessa',lat:46.5,lng:30.7,major:false,axis:false,conqueredDay:7},
  {name:'Brest',lat:52.1,lng:23.7,major:false,axis:false,conqueredDay:0},
  {name:'Lviv',lat:49.84,lng:24.0,major:false,axis:false,conqueredDay:0},
  {name:'Bialystok',lat:53.1,lng:23.2,major:false,axis:false,conqueredDay:0},
  {name:'Vyazma',lat:55.2,lng:34.3,major:false,axis:false,conqueredDay:7},
  {name:'Bryansk',lat:53.25,lng:34.4,major:false,axis:false,conqueredDay:7},
  {name:'Tula',lat:54.2,lng:37.6,major:false,axis:false,conqueredDay:-1},
  {name:'Kharkiv',lat:50.0,lng:36.25,major:false,axis:false,conqueredDay:8}
];

function initMap(){
  if(mapLeaflet){mapLeaflet.invalidateSize();return;}
  const container=document.getElementById('mapLeaflet');
  mapLeaflet=L.map(container,{zoomControl:true,attributionControl:false}).setView([54,30],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:8,minZoom:4,opacity:0.6}).addTo(mapLeaflet);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',{maxZoom:8,minZoom:4,opacity:0.55}).addTo(mapLeaflet);
  drawGeoMap(0,1);
  setTimeout(()=>mapLeaflet.invalidateSize(),100);
}
function clearMapLayers(){
  frontLayers.forEach(l=>mapLeaflet.removeLayer(l));
  sovietLayers.forEach(l=>mapLeaflet.removeLayer(l));
  cityMarkers.forEach(l=>mapLeaflet.removeLayer(l));
  frontLayers=[];sovietLayers=[];cityMarkers=[];
}
function lerpLatLng(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
function lerpGeoLine(lineA,lineB,t){const len=Math.min(lineA.length,lineB.length);return Array.from({length:len},(_,i)=>lerpLatLng(lineA[i],lineB[i],t));}
function drawGeoMap(dayIdx,progress){
  if(!mapLeaflet)return;
  clearMapLayers();
  const si=Math.min(dayIdx,GEO_FRONTS.length-1);
  const ni=Math.min(si+1,GEO_FRONTS.length-1);
  const t=Math.min(progress,1);
  const fA=GEO_FRONTS[si],fB=GEO_FRONTS[ni];
  const norte=lerpGeoLine(fA.norte,fB.norte,t);
  const centro=lerpGeoLine(fA.centro,fB.centro,t);
  const sul=lerpGeoLine(fA.sul,fB.sul,t);
  const svA=GEO_SOVIET[Math.min(si,GEO_SOVIET.length-1)];
  const svB=GEO_SOVIET[Math.min(ni,GEO_SOVIET.length-1)];
  const sv=lerpGeoLine(svA,svB,t);
  const axisStyle={color:'#4a7adc',weight:3,opacity:0.9};
  frontLayers.push(L.polyline(norte,axisStyle).addTo(mapLeaflet));
  frontLayers.push(L.polyline(centro,axisStyle).addTo(mapLeaflet));
  frontLayers.push(L.polyline(sul,axisStyle).addTo(mapLeaflet));
  [norte,centro,sul].forEach(line=>{
    const last=line[line.length-1];
    frontLayers.push(L.circleMarker(last,{radius:5,color:'#4a7adc',fillColor:'#4a7adc',fillOpacity:1,weight:0}).addTo(mapLeaflet));
  });
  frontLayers.push(L.polyline(sv,{color:'#c84a4a',weight:2,opacity:0.85,dashArray:'8,5'}).addTo(mapLeaflet));
  GEO_CITIES.forEach(c=>{
    const conquered=c.conqueredDay>=0&&c.conqueredDay<=si;
    const isAxis=c.axis;
    let color=isAxis?'#c8a84a':conquered?'#4a7adc':'#c84a4a';
    const m=L.circleMarker([c.lat,c.lng],{radius:c.major?7:4,color,fillColor:color,fillOpacity:conquered||isAxis?0.9:0.4,weight:2})
      .bindTooltip(`<div style="font-family:Share Tech Mono;font-size:11px;background:#111009;border:1px solid #c8a84a;color:#ede0c4;padding:4px 8px">${c.name}${conquered?' ✓ TOMADA':''}</div>`,{permanent:false,sticky:true}).addTo(mapLeaflet);
    if(c.major){
      const icon=L.divIcon({className:'',html:`<div style="font-family:Share Tech Mono;font-size:9px;color:${color};white-space:nowrap;text-shadow:0 0 3px #000;margin-top:-2px;margin-left:9px">${c.name}</div>`,iconAnchor:[0,0]});
      cityMarkers.push(L.marker([c.lat,c.lng],{icon,interactive:false}).addTo(mapLeaflet));
    }
    cityMarkers.push(m);
  });
  const d=DAYS[Math.min(dayIdx,DAYS.length-1)];
  document.getElementById('animLabel').textContent=`Dia ${d.day} — ${d.date}`;
}
function toggleAnim(){
  if(animPlaying){animPlaying=false;cancelAnimationFrame(animFrame);document.getElementById('btnPlay').textContent='▶ ANIMAR';}
  else{animPlaying=true;document.getElementById('btnPlay').textContent='⏸ PAUSAR';runAnim();}
}
function resetAnim(){
  animPlaying=false;cancelAnimationFrame(animFrame);animStep=0;
  document.getElementById('btnPlay').textContent='▶ ANIMAR';drawGeoMap(0,1);
}
function runAnim(){
  if(!animPlaying)return;
  const totalSteps=TOTAL_STEPS*(DAYS.length-1);
  animStep=Math.min(animStep+1,totalSteps);
  const dayIdx=Math.min(Math.floor(animStep/TOTAL_STEPS),GEO_FRONTS.length-1);
  const progress=(animStep%TOTAL_STEPS)/TOTAL_STEPS;
  drawGeoMap(dayIdx,progress);
  if(animStep>=totalSteps){animPlaying=false;document.getElementById('btnPlay').textContent='▶ ANIMAR';return;}
  animFrame=requestAnimationFrame(runAnim);
}

// ── STATE ─────────────────────────────────────────────
let curDay=0,cur='hitler',hist=[];
let lastDirectiveText='',lastAnalysisText='',lastReplyText='';
let lastNP=null,lastNPEdition='de',lastNPDay=null;

// ── NEWSPAPER ─────────────────────────────────────────
async function generateNewspaper(){
  const edition=document.getElementById('newsEdition').value;
  const dayIdx=parseInt(document.getElementById('newsDay').value);
  const context=document.getElementById('newsContext').value.trim();
  const dayInfo=DAYS[dayIdx];
  const btn=document.getElementById('newsGenBtn');
  btn.disabled=true;btn.textContent='⏳ GERANDO...';
  document.getElementById('newsPdfBtn').style.display='none';
  const wrap=document.getElementById('newsPreviewWrap');
  wrap.innerHTML=`<div class="news-loading"><div class="news-spinner"></div><div>COMPONDO TIPOGRAFIA · REDIGINDO MATÉRIAS</div></div>`;
  const isDE=edition==='de';
  const sysPrompt=`Você é um especialista em história da Segunda Guerra Mundial e redator de jornais históricos de 1941. Responda SEMPRE e EXCLUSIVAMENTE com um objeto JSON válido, sem nenhum texto antes ou depois, sem markdown, sem blocos de código. Apenas o JSON puro começando com { e terminando com }.`;
  const userPrompt=isDE
    ?`Crie o conteúdo do Völkischer Beobachter para o Dia ${dayInfo.day} — ${dayInfo.date}. Tom triunfalista, em português brasileiro exceto manchete alemã. Situação: ${dayInfo.situation.map(s=>s.l+': '+s.v).join(', ')}. Avanço: ${dayInfo.forces.map(f=>f.l+': '+f.v).join(', ')}. ${context?'Enfoque: '+context:''}
Retorne este JSON preenchido (só JSON, sem markdown): {"manchete_de":"manchete em alemão","manchete_pt":"tradução em português","deck":"subtítulo dramático","kicker":"CATEGORIA EM MAIÚSCULAS","artigo1_titulo":"título","artigo1_corpo":"p1\\n\\np2\\n\\np3","artigo2_titulo":"título","artigo2_corpo":"p1\\n\\np2\\n\\np3","editorial_titulo":"título","editorial_corpo":"p1\\n\\np2","nota_lateral_titulo":"título","nota_lateral":"texto curto","caption":"legenda foto"}`
    :`Crie o conteúdo da Pravda para o Dia ${dayInfo.day} — ${dayInfo.date}. Tom heroico, em português brasileiro exceto manchete em russo transliterado. Situação: ${dayInfo.situation.map(s=>s.l+': '+s.v).join(', ')}. Forças: ${dayInfo.forces.map(f=>f.l+': '+f.v).join(', ')}. ${context?'Enfoque: '+context:''}
Retorne este JSON preenchido (só JSON, sem markdown): {"manchete_ru":"manchete transliterada","manchete_pt":"tradução em português","deck":"subtítulo heroico","kicker":"CATEGORIA EM MAIÚSCULAS","artigo1_titulo":"título","artigo1_corpo":"p1\\n\\np2\\n\\np3","artigo2_titulo":"título","artigo2_corpo":"p1\\n\\np2\\n\\np3","editorial_titulo":"título","editorial_corpo":"p1\\n\\np2","nota_lateral_titulo":"título","nota_lateral":"texto curto","caption":"legenda foto"}`;
  try{
    const data=await callAPI({model:'claude-sonnet-4-5',max_tokens:2500,system:sysPrompt,messages:[{role:'user',content:userPrompt}]});
    let raw=data.content?.map(c=>c.text||'').join('')||'';
    raw=raw.replace(/```json|```/g,'').trim();
    const match=raw.match(/\{[\s\S]*\}/);
    let np=null;
    if(match){try{np=JSON.parse(match[0]);}catch(e){np=null;}}
    if(!np){wrap.innerHTML=`<div class="newspaper-placeholder"><div class="icon">⚠️</div><div>Erro ao processar resposta. Tente novamente.</div></div>`;btn.disabled=false;btn.textContent='📰 GERAR JORNAL';return;}
    lastNP=np;lastNPEdition=edition;lastNPDay=dayInfo;
    wrap.innerHTML=isDE?buildDE(np,dayInfo):buildRU(np,dayInfo);
    document.getElementById('newsPdfBtn').style.display='inline-flex';
  }catch(e){
    wrap.innerHTML=`<div class="newspaper-placeholder"><div class="icon">⚠️</div><div>Erro de conexão. Tente novamente.</div></div>`;
  }
  btn.disabled=false;btn.textContent='📰 GERAR JORNAL';
}

function buildDE(np,dayInfo){
  const paras1=(np.artigo1_corpo||'').split('\n\n');
  const paras2=(np.artigo2_corpo||'').split('\n\n');
  const parasEd=(np.editorial_corpo||'').split('\n\n');
  return `<div id="newspaperDE"><div class="np-noise"></div><div class="np-header"><div class="np-motto">Kampfblatt der national-sozialistischen Bewegung Großdeutschlands · Amtliches Organ der NSDAP</div><div class="np-nameplate">Völkischer Beobachter</div><div class="np-subheader"><span>BERLINER AUSGABE · NR. 173</span><span>${dayInfo.date.toUpperCase()} · TAG ${dayInfo.day}</span><span>PREIS: 10 PFENNIG</span></div></div><div class="np-body"><div class="np-banner"><div class="np-kicker">${np.kicker||'FRENTE ORIENTAL'}</div><div class="np-headline">${np.manchete_de||''}</div><div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:#5a4e38;letter-spacing:2px;margin:4px 0">[${np.manchete_pt||''}]</div><div class="np-deck">${np.deck||''}</div></div><div class="np-col-rule cols-3"><div class="np-col"><div class="np-col-head">${np.artigo1_titulo||''}</div>${paras1.map((p,i)=>i===0?`<p><span class="np-drop">${p.charAt(0)}</span>${p.slice(1)}</p>`:`<p>${p}</p>`).join('')}</div><div class="np-col"><div class="np-col-head">${np.artigo2_titulo||''}</div>${paras2.map((p,i)=>i===0?`<p><span class="np-drop">${p.charAt(0)}</span>${p.slice(1)}</p>`:`<p>${p}</p>`).join('')}</div><div class="np-col"><div class="np-col-head">${np.editorial_titulo||''}</div>${parasEd.map(p=>`<p>${p}</p>`).join('')}<hr class="np-divider"><div class="np-sidebar"><div class="np-sidebar-title">${np.nota_lateral_titulo||'Do Fronte'}</div><p>${np.nota_lateral||''}</p></div></div></div><div class="np-caption">[ FOTO: ${np.caption||''} ] · FOTOGRAF DES REICHES</div></div><div class="np-footer"><span>VÖLKISCHER BEOBACHTER · BERLIN · ${dayInfo.date.toUpperCase()}</span><span>TAG ${dayInfo.day} · OPERATION BARBAROSSA</span><span>SIMULAÇÃO EDUCACIONAL</span></div></div>`;
}

function buildRU(np,dayInfo){
  const paras1=(np.artigo1_corpo||'').split('\n\n');
  const paras2=(np.artigo2_corpo||'').split('\n\n');
  const parasEd=(np.editorial_corpo||'').split('\n\n');
  return `<div id="newspaperRU"><div class="np-noise"></div><div class="np-header"><div class="np-motto">Орган Центрального Комитета и МК ВКП(б) · Orgão do Comitê Central do Partido Comunista</div><div class="np-nameplate">ПРАВДА</div><div class="np-subheader"><span>МОСКВА · № 173</span><span>${dayInfo.date.toUpperCase()} · DIA ${dayInfo.day}</span><span>ЦЕНА: 10 КОП.</span></div></div><div class="np-body"><div class="np-banner"><div class="np-kicker">${np.kicker||'GRANDE GUERRA PATRIÓTICA'}</div><div class="np-headline">${np.manchete_ru||''}</div><div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:#5a4e38;letter-spacing:2px;margin:4px 0">[${np.manchete_pt||''}]</div><div class="np-deck">${np.deck||''}</div></div><div class="np-col-rule cols-3"><div class="np-col"><div class="np-col-head">${np.artigo1_titulo||''}</div>${paras1.map((p,i)=>i===0?`<p><span class="np-drop">${p.charAt(0)}</span>${p.slice(1)}</p>`:`<p>${p}</p>`).join('')}</div><div class="np-col"><div class="np-col-head">${np.artigo2_titulo||''}</div>${paras2.map((p,i)=>i===0?`<p><span class="np-drop">${p.charAt(0)}</span>${p.slice(1)}</p>`:`<p>${p}</p>`).join('')}</div><div class="np-col"><div class="np-col-head">${np.editorial_titulo||''}</div>${parasEd.map(p=>`<p>${p}</p>`).join('')}<hr class="np-divider"><div class="np-sidebar"><div class="np-sidebar-title">${np.nota_lateral_titulo||'Do Fronte'}</div><p>${np.nota_lateral||''}</p></div></div></div><div class="np-caption">[ ФОТО: ${np.caption||''} ] · ТАСС</div></div><div class="np-footer"><span>ПРАВДА · МОСКВА · ${dayInfo.date.toUpperCase()}</span><span>DIA ${dayInfo.day} · GRANDE GUERRA PATRIÓTICA</span><span>SIMULAÇÃO EDUCACIONAL</span></div></div>`;
}

function exportNewspaperPDF(){
  if(!lastNP){alert('Gere um jornal primeiro.');return;}
  const btn=document.getElementById('newsPdfBtn');
  btn.disabled=true;btn.textContent='⏳ GERANDO PDF...';
  try{
    const {jsPDF}=window.jspdf;
    const isDE=lastNPEdition==='de';
    const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    const W=210,M=14,CW=W-M*2;let y=0;
    function hline(x1,x2,yy,r,g,b,w){doc.setDrawColor(r,g,b);doc.setLineWidth(w||0.2);doc.line(x1,yy,x2,yy);}
    function col3(t1,t2,t3,size,r,g,b,s){doc.setFontSize(size);doc.setTextColor(r,g,b);doc.setFont('helvetica',s||'normal');doc.text(t1||'',M,y,{align:'left'});doc.text(t2||'',W/2,y,{align:'center'});doc.text(t3||'',W-M,y,{align:'right'});y+=size*0.45;}
    if(isDE){
      doc.setFillColor(26,18,8);doc.rect(0,0,W,28,'F');y=6;
      doc.setFontSize(7);doc.setTextColor(200,168,74);doc.setFont('helvetica','normal');
      doc.text('Kampfblatt der national-sozialistischen Bewegung Großdeutschlands',W/2,y,{align:'center'});
      y+=4;hline(M,W-M,y,200,168,74,0.3);y+=4;
      doc.setFontSize(22);doc.setTextColor(245,240,224);doc.setFont('helvetica','bold');
      doc.text('Völkischer Beobachter',W/2,y,{align:'center'});y+=7;
      hline(M,W-M,y,200,168,74,0.3);y+=3;
      col3('BERLINER AUSGABE · NR.173',lastNPDay.date.toUpperCase(),'PREIS: 10 PFENNIG',7,200,168,74,'normal');y=30;
      hline(M,W-M,y,26,18,8,0.8);y+=5;
      doc.setFontSize(9);doc.setTextColor(138,16,16);doc.setFont('helvetica','bold');
      doc.text((lastNP.kicker||'').toUpperCase(),W/2,y,{align:'center'});y+=5;
      doc.setFontSize(18);doc.setTextColor(26,18,8);doc.setFont('helvetica','bold');
      const hlLines=doc.splitTextToSize(lastNP.manchete_de||'',CW);
      doc.text(hlLines,W/2,y,{align:'center'});y+=hlLines.length*7+1;
      doc.setFontSize(9);doc.setTextColor(80,60,20);doc.setFont('helvetica','italic');
      const hlpt=doc.splitTextToSize('['+lastNP.manchete_pt+']',CW);
      doc.text(hlpt,W/2,y,{align:'center'});y+=hlpt.length*4+2;
      doc.setFontSize(10);doc.setTextColor(40,30,10);doc.setFont('helvetica','italic');
      const deck=doc.splitTextToSize(lastNP.deck||'',CW-20);
      doc.text(deck,W/2,y,{align:'center'});y+=deck.length*4.5+3;
      hline(M,W-M,y,26,18,8,0.8);y+=2;hline(M,W-M,y,26,18,8,0.2);y+=5;
      const c1x=M,c2x=M+CW/3+2,c3x=M+2*CW/3+4,cw=CW/3-3,yTop=y;
      doc.setFontSize(8);doc.setTextColor(138,16,16);doc.setFont('helvetica','bold');
      doc.text((lastNP.artigo1_titulo||'').toUpperCase(),c1x,y);y+=4;hline(c1x,c1x+cw,y,138,16,16,0.4);y+=3;
      doc.setFontSize(8.5);doc.setTextColor(26,18,8);doc.setFont('helvetica','normal');
      const a1=doc.splitTextToSize(lastNP.artigo1_corpo||'',cw);doc.text(a1,c1x,y);const yA1=y+a1.length*3.6;
      y=yTop;doc.setFontSize(8);doc.setTextColor(138,16,16);doc.setFont('helvetica','bold');
      doc.text((lastNP.artigo2_titulo||'').toUpperCase(),c2x,y);y+=4;hline(c2x,c2x+cw,y,138,16,16,0.4);y+=3;
      doc.setFontSize(8.5);doc.setTextColor(26,18,8);doc.setFont('helvetica','normal');
      const a2=doc.splitTextToSize(lastNP.artigo2_corpo||'',cw);doc.text(a2,c2x,y);const yA2=y+a2.length*3.6;
      y=yTop;doc.setFontSize(8);doc.setTextColor(138,16,16);doc.setFont('helvetica','bold');
      doc.text((lastNP.editorial_titulo||'').toUpperCase(),c3x,y);y+=4;hline(c3x,c3x+cw,y,138,16,16,0.4);y+=3;
      doc.setFontSize(8.5);doc.setTextColor(26,18,8);doc.setFont('helvetica','normal');
      const ed=doc.splitTextToSize(lastNP.editorial_corpo||'',cw);doc.text(ed,c3x,y);y+=ed.length*3.6+4;
      doc.setFillColor(232,224,196);doc.rect(c3x,y,cw,28,'F');doc.setDrawColor(200,184,144);doc.setLineWidth(0.3);doc.rect(c3x,y,cw,28,'S');y+=4;
      doc.setFontSize(7);doc.setTextColor(138,16,16);doc.setFont('helvetica','bold');
      doc.text((lastNP.nota_lateral_titulo||'DO FRONTE').toUpperCase(),c3x+2,y);y+=3.5;
      doc.setFontSize(8);doc.setTextColor(26,18,8);doc.setFont('helvetica','normal');
      const sl=doc.splitTextToSize(lastNP.nota_lateral||'',cw-4);doc.text(sl,c3x+2,y);const yA3=y+sl.length*3.6+10;
      y=Math.max(yA1,yA2,yA3)+4;
      doc.setDrawColor(200,184,144);doc.setLineWidth(0.2);doc.line(c2x-2,yTop,c2x-2,y);doc.line(c3x-2,yTop,c3x-2,y);
      hline(M,W-M,y,200,184,144,0.3);y+=3;
      doc.setFontSize(7);doc.setTextColor(90,78,56);doc.setFont('helvetica','italic');
      doc.text('[ FOTO: '+(lastNP.caption||'')+' ] · FOTOGRAF DES REICHES',W/2,y,{align:'center'});y+=6;
      doc.setFillColor(26,18,8);doc.rect(0,y,W,10,'F');y+=4;
      doc.setFontSize(7);doc.setTextColor(200,168,74);doc.setFont('helvetica','normal');
      doc.text('VÖLKISCHER BEOBACHTER · BERLIN · '+lastNPDay.date.toUpperCase(),M,y);
      doc.text('SIMULAÇÃO EDUCACIONAL',W-M,y,{align:'right'});
    }else{
      doc.setFillColor(138,16,16);doc.rect(0,0,W,28,'F');y=6;
      doc.setFontSize(7);doc.setTextColor(255,220,220);doc.setFont('helvetica','normal');
      doc.text('Орган Центрального Комитета и МК ВКП(б)',W/2,y,{align:'center'});
      y+=4;hline(M,W-M,y,200,80,80,0.3);y+=4;
      doc.setFontSize(24);doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');
      doc.text('PRAVDA — ПРАВДА',W/2,y,{align:'center'});y+=7;
      hline(M,W-M,y,200,80,80,0.3);y+=3;
      col3('МОСКВА · № 173',lastNPDay.date.toUpperCase(),'ЦЕНА: 10 КОП.',7,255,204,204,'normal');y=30;
      hline(M,W-M,y,138,16,16,1.2);y+=5;
      doc.setFontSize(9);doc.setTextColor(138,16,16);doc.setFont('helvetica','bold');
      doc.text((lastNP.kicker||'').toUpperCase(),W/2,y,{align:'center'});y+=5;
      doc.setFontSize(16);doc.setTextColor(16,12,8);doc.setFont('helvetica','bold');
      const hlRu=doc.splitTextToSize(lastNP.manchete_ru||'',CW);
      doc.text(hlRu,W/2,y,{align:'center'});y+=hlRu.length*6.5+1;
      doc.setFontSize(9);doc.setTextColor(80,40,10);doc.setFont('helvetica','italic');
      const hlptRu=doc.splitTextToSize('['+lastNP.manchete_pt+']',CW);
      doc.text(hlptRu,W/2,y,{align:'center'});y+=hlptRu.length*4+2;
      doc.setFontSize(10);doc.setTextColor(40,20,8);doc.setFont('helvetica','italic');
      const deckRu=doc.splitTextToSize(lastNP.deck||'',CW-20);
      doc.text(deckRu,W/2,y,{align:'center'});y+=deckRu.length*4.5+3;
      hline(M,W-M,y,138,16,16,1.2);y+=2;hline(M,W-M,y,138,16,16,0.3);y+=5;
      const c1x=M,c2x=M+CW/3+2,c3x=M+2*CW/3+4,cw=CW/3-3,yTop=y;
      doc.setFontSize(8);doc.setTextColor(138,16,16);doc.setFont('helvetica','bold');
      doc.text((lastNP.artigo1_titulo||'').toUpperCase(),c1x,y);y+=4;hline(c1x,c1x+cw,y,138,16,16,0.4);y+=3;
      doc.setFontSize(8.5);doc.setTextColor(16,12,8);doc.setFont('helvetica','normal');
      const ra1=doc.splitTextToSize(lastNP.artigo1_corpo||'',cw);doc.text(ra1,c1x,y);const ryA1=y+ra1.length*3.6;
      y=yTop;doc.setFontSize(8);doc.setTextColor(138,16,16);doc.setFont('helvetica','bold');
      doc.text((lastNP.artigo2_titulo||'').toUpperCase(),c2x,y);y+=4;hline(c2x,c2x+cw,y,138,16,16,0.4);y+=3;
      doc.setFontSize(8.5);doc.setTextColor(16,12,8);doc.setFont('helvetica','normal');
      const ra2=doc.splitTextToSize(lastNP.artigo2_corpo||'',cw);doc.text(ra2,c2x,y);const ryA2=y+ra2.length*3.6;
      y=yTop;doc.setFontSize(8);doc.setTextColor(138,16,16);doc.setFont('helvetica','bold');
      doc.text((lastNP.editorial_titulo||'').toUpperCase(),c3x,y);y+=4;hline(c3x,c3x+cw,y,138,16,16,0.4);y+=3;
      doc.setFontSize(8.5);doc.setTextColor(16,12,8);doc.setFont('helvetica','normal');
      const red=doc.splitTextToSize(lastNP.editorial_corpo||'',cw);doc.text(red,c3x,y);y+=red.length*3.6+4;
      doc.setFillColor(224,216,192);doc.rect(c3x,y,cw,28,'F');doc.setDrawColor(138,16,16);doc.setLineWidth(0.6);doc.line(c3x,y,c3x,y+28);doc.setLineWidth(0.2);doc.rect(c3x,y,cw,28,'S');y+=4;
      doc.setFontSize(7);doc.setTextColor(138,16,16);doc.setFont('helvetica','bold');
      doc.text((lastNP.nota_lateral_titulo||'DO FRONTE').toUpperCase(),c3x+3,y);y+=3.5;
      doc.setFontSize(8);doc.setTextColor(16,12,8);doc.setFont('helvetica','normal');
      const rsl=doc.splitTextToSize(lastNP.nota_lateral||'',cw-5);doc.text(rsl,c3x+3,y);const ryA3=y+rsl.length*3.6+10;
      y=Math.max(ryA1,ryA2,ryA3)+4;
      doc.setDrawColor(200,160,160);doc.setLineWidth(0.2);doc.line(c2x-2,yTop,c2x-2,y);doc.line(c3x-2,yTop,c3x-2,y);
      hline(M,W-M,y,200,160,160,0.3);y+=3;
      doc.setFontSize(7);doc.setTextColor(90,60,50);doc.setFont('helvetica','italic');
      doc.text('[ ФОТО: '+(lastNP.caption||'')+' ] · ТАСС',W/2,y,{align:'center'});y+=6;
      doc.setFillColor(138,16,16);doc.rect(0,y,W,10,'F');y+=4;
      doc.setFontSize(7);doc.setTextColor(255,204,204);doc.setFont('helvetica','normal');
      doc.text('ПРАВДА · МОСКВА · '+lastNPDay.date.toUpperCase(),M,y);
      doc.text('SIMULAÇÃO EDUCACIONAL',W-M,y,{align:'right'});
    }
    const fname=lastNPEdition==='de'?`Voelkischer_Beobachter_Dia${lastNPDay.day}.pdf`:`Pravda_Dia${lastNPDay.day}.pdf`;
    doc.save(fname);
  }catch(e){alert('Erro ao gerar PDF: '+e.message);}
  btn.disabled=false;btn.textContent='📄 EXPORTAR PDF';
}

// ── PDF DIRECTIVE ─────────────────────────────────────
async function exportPDF(){
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const margin=18,pageW=210,contentW=pageW-margin*2;let y=20;
  function addSection(title,text,color=[0,0,0]){
    doc.setFontSize(9);doc.setTextColor(150,120,60);doc.text(title,margin,y);y+=5;
    doc.setDrawColor(150,120,60);doc.line(margin,y,pageW-margin,y);y+=5;
    doc.setFontSize(10);doc.setTextColor(...color);
    const clean=text.replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&');
    const lines=doc.splitTextToSize(clean,contentW);
    lines.forEach(l=>{if(y>275){doc.addPage();y=20;}doc.text(l,margin,y);y+=5;});y+=6;
  }
  doc.setFillColor(20,16,8);doc.rect(0,0,210,297,'F');
  doc.setFontSize(14);doc.setTextColor(200,168,74);doc.setFont('helvetica','bold');
  doc.text('GABINETE DE GUERRA — OPERAÇÃO BARBAROSSA',margin,y);y+=7;
  doc.setFontSize(9);doc.setTextColor(138,122,96);
  doc.text(`${DAYS[curDay].date} · Dia ${DAYS[curDay].day} · ${document.getElementById('dirClassif')?.value||'RESERVADO'}`,margin,y);y+=10;
  doc.setDrawColor(200,168,74);doc.line(margin,y,pageW-margin,y);y+=8;
  if(lastDirectiveText) addSection('📜 DIRETIVA OFICIAL',lastDirectiveText,[220,210,180]);
  if(lastAnalysisText) addSection('📊 ANÁLISE HISTÓRICA',lastAnalysisText,[180,180,220]);
  if(lastReplyText) addSection('↩️ RESPOSTA OFICIAL',lastReplyText,[220,180,180]);
  doc.setFontSize(8);doc.setTextColor(80,70,50);
  doc.text('Simulação educacional — Gabinete de Guerra · Operação Barbarossa',margin,288);
  doc.save(`Diretiva_Barbarossa_Dia${DAYS[curDay].day}.pdf`);
}

// ── UI ────────────────────────────────────────────────
function renderDay(){
  const d=DAYS[curDay];
  document.getElementById('dayLabel').textContent=`Dia ${d.day}`;
  document.getElementById('dayDate').textContent=d.date;
  document.getElementById('hdrDate').textContent=`${d.date.toUpperCase()} · ${d.time}`;
  document.getElementById('btnPrev').disabled=curDay===0;
  document.getElementById('btnNext').disabled=curDay===DAYS.length-1;
  document.getElementById('situationRows').innerHTML=d.situation.map(r=>`<div class="irow"><span>${r.l}</span><span class="ival ${r.c}">${r.v}</span></div>`).join('');
  document.getElementById('forcesRows').innerHTML=d.forces.map(r=>`<div class="irow"><span>${r.l}</span><span class="ival">${r.v}</span></div>`).join('');
  const qa=document.getElementById('quickActions');qa.innerHTML='';
  d.quick.forEach(q=>{const b=document.createElement('button');b.className='actbtn';b.textContent=`${q.i} ${q.t.substring(0,32)}...`;b.addEventListener('click',()=>quick(q.t));qa.appendChild(b);});
}
function changeDay(dir){
  curDay=Math.max(0,Math.min(DAYS.length-1,curDay+dir));
  renderDay();
  const d=DAYS[curDay];
  const n=['Início da invasão. O ataque surpresa devastou as defesas soviéticas.','Os Panzers avançam rapidamente.','Minsk foi cercada. 300.000 soldados soviéticos encurralados.','Smolensk está no horizonte.','O avanço desacelera. Logística em colapso.','Hitler pausa o Grupo Centro. Leningrado sitiada.','O cerco de Kiev fecha. Maior derrota soviética da história.','Operação Tufão lançada. Objetivo: Moscou.','A lama do outono paralisa o avanço.','Solo congelado. Moscou a 50 km. O inverno mata.','Avanço estagnado. Catástrofe se aproxima.','Contraataque soviético iniciado. Wehrmacht recua.','Fim de 1941. Barbarossa fracassou.'];
  addSysMsg(`📅 <strong>Avançando para ${d.date} — Dia ${d.day}.</strong> ${n[curDay]||''}`);
  if(document.getElementById('tab-map').classList.contains('active')) drawGeoMap(curDay,1);
}
function switchTab(t){
  const tabs=['chat','directive','map','newspaper'];
  tabs.forEach((id,i)=>{
    document.querySelectorAll('.tab')[i].classList.toggle('active',id===t);
    document.getElementById(`tab-${id}`).classList.toggle('active',id===t);
  });
  if(t==='map'){setTimeout(()=>initMap(),80);}
}
function selDel(btn){
  document.querySelectorAll('.dbtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');cur=btn.dataset.id;
  const df=document.getElementById('dirFrom');
  if(df)for(let o of df.options)if(o.value===cur){o.selected=true;break;}
}
function quick(t){switchTab('chat');document.getElementById('inp').value=t;send();}
function addSysMsg(html){
  const log=document.getElementById('chatLog');
  const d=document.createElement('div');d.className='msg system';
  d.innerHTML=`<div class="mtext">${html}</div>`;
  log.appendChild(d);log.scrollTop=log.scrollHeight;
}
function addMsg(role,name,text,soviet){
  const log=document.getElementById('chatLog');
  const d=document.createElement('div');
  d.className='msg '+(role==='user'?'user':'ai'+(soviet?' soviet-msg':''));
  d.innerHTML=`<div class="mhdr${soviet?' soviet-hdr':''}">${name}</div><div class="mtext">${text}</div>`;
  log.appendChild(d);log.scrollTop=log.scrollHeight;
}
function addDirectiveBlock(title,html,cssClass){
  const log=document.getElementById('chatLog');
  const d=document.createElement('div');d.className=`msg ${cssClass}`;
  d.innerHTML=`<div class="mhdr" style="color:var(--gold2);margin-bottom:8px;font-size:10px;letter-spacing:3px">${title}</div><div class="mtext" style="font-family:'Special Elite',serif;font-size:12px;line-height:1.85">${html}</div>`;
  log.appendChild(d);log.scrollTop=log.scrollHeight;
}
function buildProbBar(pct,factors){
  const color=pct>=70?'#4a9a40':pct>=40?'#c8a84a':'#a02020';
  return `<div class="prob-block"><div class="prob-label">Probabilidade de Sucesso</div><div class="prob-bar-wrap"><div class="prob-bar" data-pct="${pct}%" style="width:${pct}%;background:${color}"></div></div><div class="prob-factors">${(factors||[]).map(f=>`<div class="pfactor"><span>${f.label}</span><span class="pf-val ${f.tipo==='pos'?'pos':f.tipo==='neg'?'neg':'neu'}">${f.valor}</span></div>`).join('')}</div></div>`;
}
function buildReplySelector(enc){
  const btns=Object.entries(D).map(([k,v])=>`<button class="reply-btn" onclick="generateReply('${k}','${enc}')">${v.soviet?'🇷🇺':'🇩🇪'} ${v.name.split(' ').slice(-1)[0]}</button>`).join('');
  return `<div class="reply-selector"><p>// ESCOLHA QUEM ELABORA A RESPOSTA:</p><div class="reply-grid">${btns}</div></div>`;
}
function addPDFBtn(){
  const log=document.getElementById('chatLog');
  const d=document.createElement('div');d.className='msg system';
  d.innerHTML=`<button class="pdf-btn" onclick="exportPDF()">📄 EXPORTAR DIRETIVA COMPLETA EM PDF</button>`;
  log.appendChild(d);log.scrollTop=log.scrollHeight;
}

// ── CHAT ──────────────────────────────────────────────
async function send(){
  const inp=document.getElementById('inp');
  const t=inp.value.trim();if(!t)return;
  const del=D[cur];const dayInfo=DAYS[curDay];
  const btn=document.getElementById('sbtn');btn.disabled=true;inp.value='';
  addMsg('user','📨 Você',t,false);hist.push({role:'user',content:t});
  const typ=document.getElementById('typing');
  typ.textContent=`${del.name.split(' ').slice(-1)[0]} redigindo despacho...`;typ.classList.add('on');
  const sys=`${del.persona} português brasileiro. Você é ${del.name}. Contexto: ${dayInfo.date}, Dia ${dayInfo.day} da Operação Barbarossa. Responda SEMPRE em português brasileiro, em caráter histórico. Respostas concisas (3-4 parágrafos).`;
  try{
    const data=await callAPI({model:'claude-sonnet-4-5',max_tokens:1000,system:sys,messages:hist});
    const reply=data.content?.map(c=>c.text||'').join('')||'Sem resposta.';
    hist.push({role:'assistant',content:reply});typ.classList.remove('on');
    addMsg('ai',`[${del.name} · ${dayInfo.date}]`,reply.replace(/\n/g,'<br>'),del.soviet);
  }catch(e){typ.classList.remove('on');addMsg('ai','Sistema','Erro de conexão.',false);}
  btn.disabled=false;inp.focus();
}

// ── DIRECTIVE ─────────────────────────────────────────
async function generateDirective(){
  const tipo=document.getElementById('dirType').value;
  const to=document.getElementById('dirTo').value.trim();
  const subject=document.getElementById('dirSubject').value.trim();
  const content=document.getElementById('dirContent').value.trim();
  const classif=document.getElementById('dirClassif').value;
  const dayInfo=DAYS[curDay];
  if(!to||!subject||!content){alert('Preencha todos os campos.');return;}
  const btn=document.getElementById('dirBtn');
  btn.disabled=true;btn.textContent='⏳ GERANDO...';
  const fromName=document.getElementById('dirFrom').options[document.getElementById('dirFrom').selectedIndex].text;
  const tipoLabel=DIR_TYPES[tipo];
  lastDirectiveText='';lastAnalysisText='';lastReplyText='';
  const sysDir=`Você é um especialista em história militar da Segunda Guerra Mundial. Formate diretivas oficiais de gabinete de guerra no estilo histórico de 1941, SEMPRE em português brasileiro. Inclua: cabeçalho, classificação, protocolo fictício, data/hora, remetente, destinatário, assunto, corpo em linguagem militar formal histórica, assinatura.`;
  const promptDir=`TIPO: ${tipoLabel}\nREMETENTE: ${fromName}\nDESTINATÁRIO: ${to}\nASSUNTO: ${subject}\nDATA: ${dayInfo.date} — Dia ${dayInfo.day}\nCLASSIFICAÇÃO: ${classif}\nCONTEÚDO: ${content}`;
  const sysAna=`Historiador militar especialista em Frente Oriental 1941. Analise diretivas e retorne SOMENTE JSON válido (sem markdown): {"probabilidade":85,"veredicto":"texto","justificativa":"2 frases.","fatores":[{"label":"texto","valor":"+15%","tipo":"pos"}]}. Tipos: pos, neg, neu. Entre 3 e 5 fatores.`;
  const promptAna=`Analise a probabilidade de sucesso:\nTIPO: ${tipoLabel}\nREMETENTE: ${fromName}\nDESTINATÁRIO: ${to}\nASSUNTO: ${subject}\nDIA: ${dayInfo.day} (${dayInfo.date})\nCONTEÚDO: ${content}`;
  try{
    const [dDir,dAna]=await Promise.all([
      callAPI({model:'claude-sonnet-4-5',max_tokens:1200,system:sysDir,messages:[{role:'user',content:promptDir}]}),
      callAPI({model:'claude-sonnet-4-5',max_tokens:600,system:sysAna,messages:[{role:'user',content:promptAna}]})
    ]);
    const directiveText=dDir.content?.map(c=>c.text||'').join('')||'Sem resposta.';
    let ana={probabilidade:50,veredicto:'Indeterminado',justificativa:'Análise indisponível.',fatores:[]};
    try{const raw=dAna.content?.map(c=>c.text||'').join('')||'{}';ana=JSON.parse(raw.replace(/```json|```/g,'').trim());}catch(e){}
    lastDirectiveText=directiveText;
    switchTab('chat');
    addDirectiveBlock(`📜 DIRETIVA OFICIAL — ${tipoLabel.toUpperCase()} · ${classif}`,directiveText.replace(/\n/g,'<br>'),'directive');
    const pct=Math.min(100,Math.max(0,ana.probabilidade||50));
    const anaHtml=`${buildProbBar(pct,ana.fatores)}<div style="margin-top:10px;font-size:11px;color:var(--text);line-height:1.7"><strong style="color:#8a8acc">${ana.veredicto}</strong><br>${ana.justificativa}</div>`;
    lastAnalysisText=`Probabilidade: ${pct}%\n${ana.veredicto}\n${ana.justificativa}\n\nFatores:\n${(ana.fatores||[]).map(f=>`• ${f.label}: ${f.valor}`).join('\n')}`;
    addDirectiveBlock('📊 ANÁLISE HISTÓRICA DE PROBABILIDADE',anaHtml,'analysis');
    const enc=encodeURIComponent(directiveText);
    const rs=document.createElement('div');rs.className='msg analysis';rs.innerHTML=buildReplySelector(enc);
    document.getElementById('chatLog').appendChild(rs);
    document.getElementById('chatLog').scrollTop=99999;
  }catch(e){alert('Erro ao gerar diretiva.');}
  btn.disabled=false;btn.textContent='⚡ GERAR DIRETIVA + ANÁLISE';
}

async function generateReply(responderId,encodedDirective){
  const directiveText=decodeURIComponent(encodedDirective);
  const responder=D[responderId];const dayInfo=DAYS[curDay];
  document.querySelectorAll('.reply-selector').forEach(el=>el.remove());
  addSysMsg(`✉️ <strong>${responder.name}</strong> está elaborando a resposta...`);
  const sys=`Você é ${responder.name} durante a Operação Barbarossa em ${dayInfo.date}. Responda SEMPRE em português brasileiro. Elabore uma RESPOSTA FORMAL no estilo de gabinete de guerra de 1941: cabeçalho, protocolo, posicionamento oficial, argumentação histórica, assinatura.`;
  try{
    const data=await callAPI({model:'claude-sonnet-4-5',max_tokens:1200,system:sys,messages:[{role:'user',content:`DIRETIVA RECEBIDA:\n${directiveText}\n\nElabore sua resposta oficial em português brasileiro.`}]});
    const reply=data.content?.map(c=>c.text||'').join('')||'Sem resposta.';
    lastReplyText=reply;
    addDirectiveBlock(`↩️ RESPOSTA OFICIAL — ${responder.name.toUpperCase()} · ${dayInfo.date}`,reply.replace(/\n/g,'<br>'),'reply-dir');
    addPDFBtn();
  }catch(e){addSysMsg('Erro ao gerar resposta.');}
}

function clearForm(){
  document.getElementById('dirTo').value='';
  document.getElementById('dirSubject').value='';
  document.getElementById('dirContent').value='';
}

renderDay();
