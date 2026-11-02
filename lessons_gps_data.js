// ── Trilha de Prática Diária GPS Tronic ─────────────────────────────────────
// 24 lições (ids 501-524) × 4 mini-lições = 96 mini-lições espelhando as 14 aulas
// do curso exclusivo GPS Tronic (gpstronic_aula_01..14) + aprofundamento técnico
// de oficina, campo, RTK, chicotes, firmware, plantadeiras/pulverizadores e garantia.
// Schema idêntico ao JADSON_LESSONS de lessons.html.

const LESSONS_GPS = [
  {
    id: 501, title: 'GPS Basics Review', emoji: '🛰️',
    verbs: ['To Check', 'To Turn On', 'To Work', 'To Connect'],
    vocab: [
      {en:'GPS receiver',pt:'Receptor de GPS'},{en:'Signal',pt:'Sinal'},{en:'Antenna',pt:'Antena'},
      {en:'Screen',pt:'Tela'},{en:'Cable',pt:'Cabo'},{en:'Battery',pt:'Bateria'},
      {en:'To turn on',pt:'Ligar'},{en:'To turn off',pt:'Desligar'},{en:'To check',pt:'Verificar'},
      {en:'To connect',pt:'Conectar'},{en:'To work',pt:'Funcionar'},{en:'Broken',pt:'Quebrado'},
      {en:'Strong signal',pt:'Sinal forte'},{en:'Weak signal',pt:'Sinal fraco'},{en:'No signal',pt:'Sem sinal'},
      {en:'Error message',pt:'Mensagem de erro'},{en:'Button',pt:'Botão'},{en:'Light',pt:'Luz'},
      {en:'Power',pt:'Energia'},{en:'Device',pt:'Aparelho'},{en:'Equipment',pt:'Equipamento'},
      {en:'Problem',pt:'Problema'},{en:'Easy',pt:'Fácil'},{en:'Difficult',pt:'Difícil'},
      {en:'New',pt:'Novo'},{en:'Old',pt:'Velho'},{en:'Fast',pt:'Rápido'},
      {en:'Slow',pt:'Lento'},{en:'To restart',pt:'Reiniciar'},{en:'To update',pt:'Atualizar'},
    ],
    expressions: [
      {expr:'The GPS is working now',meaning:'O GPS está funcionando agora',example:'I checked the antenna. The GPS is working now.'},
      {expr:'The signal is weak here',meaning:'O sinal está fraco aqui',example:'The signal is weak here, near the trees.'},
      {expr:'First, turn off the device',meaning:'Primeiro, desligue o aparelho',example:'First, turn off the device. Then check the cable.'},
      {expr:'It has an error message',meaning:'Está com uma mensagem de erro',example:'The screen has an error message.'},
    ],
    sentences: [
      'The GPS receiver is on the tractor.','The signal is weak today.',
      'I check the antenna every morning.','First, turn off the device.',
      'The screen shows an error message.','The battery is old and slow.',
      'I connect the cable to the receiver.','The equipment works well now.',
    ],
    grammar: {
      title: 'Presente Simples: rotina de trabalho com o GPS',
      rules: [
        'Use o presente simples para rotinas: I check the antenna every day.',
        'Com he/she/it, o verbo ganha -s: The GPS works well. / She checks the cable.',
        'Negativa com don\'t / doesn\'t: The screen doesn\'t work.',
        'Frases curtas e diretas são melhores no rádio e no telefone: Signal is weak. Device is off.',
      ],
      table: {
        headers: ['Estrutura','Uso','Exemplo','Observação'],
        rows: [
          ['I/You/We/They + verbo','rotina','I check the signal.','sem -s'],
          ['He/She/It + verbo-s','rotina de outra pessoa/coisa','The GPS works.','verbo ganha -s'],
          ['don\'t + verbo','negativa (I/you/we/they)','I don\'t see the error.','forma base'],
          ['doesn\'t + verbo','negativa (he/she/it)','It doesn\'t turn on.','verbo sem -s'],
        ]
      }
    },
    quiz: [
      {q:'The GPS ___ well now.',a:'works',opts:['works','work','working','worked']},
      {q:'First, ___ off the device.',a:'turn',opts:['turn','turns','turning','turned']},
      {q:'The signal ___ weak here.',a:'is',opts:['is','are','be','am']},
      {q:'I ___ the antenna every morning.',a:'check',opts:['check','checks','checking','checked']},
      {q:'The screen ___ work.',a:"doesn't",opts:["doesn't","don't","isn't","not"]},
    ],
    speak: [
      'The GPS is working now.','The signal is weak here.',
      'First, turn off the device.','I check the antenna every morning.',
      'The screen shows an error message.',
    ],
  },
  {
    id: 502, title: 'Tractor & Field Words', emoji: '🚜',
    verbs: ['To Drive', 'To Plant', 'To Harvest', 'To Repair'],
    vocab: [
      {en:'Tractor',pt:'Trator'},{en:'Harvester',pt:'Colheitadeira'},{en:'Planter',pt:'Plantadeira'},
      {en:'Field',pt:'Campo, lavoura'},{en:'Farm',pt:'Fazenda'},{en:'Farmer',pt:'Fazendeiro'},
      {en:'Crop',pt:'Cultura, plantação'},{en:'Soybean',pt:'Soja'},{en:'Corn',pt:'Milho'},
      {en:'Cotton',pt:'Algodão'},{en:'Harvest',pt:'Colheita'},{en:'To plant',pt:'Plantar'},
      {en:'To drive',pt:'Dirigir'},{en:'To repair',pt:'Consertar'},{en:'Machine',pt:'Máquina'},
      {en:'Guidance line',pt:'Linha de orientação'},{en:'Straight line',pt:'Linha reta'},{en:'Autosteer',pt:'Piloto automático'},
      {en:'Accuracy',pt:'Precisão'},{en:'Wheel',pt:'Roda'},{en:'Engine',pt:'Motor'},
      {en:'Cab',pt:'Cabine'},{en:'Monitor',pt:'Monitor'},{en:'Season',pt:'Safra, temporada'},
      {en:'Rain',pt:'Chuva'},{en:'Dust',pt:'Poeira'},{en:'Dirt',pt:'Terra, sujeira'},
      {en:'Big',pt:'Grande'},{en:'Ready',pt:'Pronto'},{en:'Busy',pt:'Ocupado'},
    ],
    expressions: [
      {expr:'The tractor drives in a straight line',meaning:'O trator anda em linha reta',example:'With autosteer, the tractor drives in a straight line.'},
      {expr:'The harvest season is very busy',meaning:'A época de colheita é muito corrida',example:'The harvest season is very busy for farmers.'},
      {expr:'The farmer needs the machine today',meaning:'O fazendeiro precisa da máquina hoje',example:'The farmer needs the machine today. It is harvest time.'},
      {expr:'There is dust on the monitor',meaning:'Tem poeira no monitor',example:'There is dust on the monitor. Please clean it.'},
    ],
    sentences: [
      'The tractor works in the field.','The farmer plants soybean in October.',
      'The harvester is very big.','Autosteer drives in a straight line.',
      'The monitor is in the cab.','The harvest season is busy.',
      'There is dust on the screen.','The machine is ready now.',
    ],
    grammar: {
      title: 'There is / There are: descrevendo o campo e a máquina',
      rules: [
        'There is + singular: There is a problem with the antenna.',
        'There are + plural: There are two tractors on the farm.',
        'Pergunta: Is there a signal here? / Are there new cables?',
        'Muito útil para descrever o que você vê na máquina do cliente.',
      ],
      table: {
        headers: ['Estrutura','Uso','Exemplo','Observação'],
        rows: [
          ['There is + singular','uma coisa existe','There is dust on the monitor.','singular'],
          ['There are + plural','várias coisas existem','There are two error messages.','plural'],
          ['Is there...?','pergunta (singular)','Is there a signal?','resposta: Yes, there is.'],
          ['Are there...?','pergunta (plural)','Are there new parts?','resposta: No, there aren\'t.'],
        ]
      }
    },
    quiz: [
      {q:'There ___ a problem with the antenna.',a:'is',opts:['is','are','be','have']},
      {q:'There ___ two tractors on the farm.',a:'are',opts:['are','is','be','has']},
      {q:'The farmer ___ soybean in October.',a:'plants',opts:['plants','plant','planting','planted']},
      {q:'___ there a signal here?',a:'Is',opts:['Is','Are','Do','Does']},
      {q:'The harvester is very ___.',a:'big',opts:['big','bigs','bigger','biggest']},
    ],
    speak: [
      'The tractor works in the field.','There is dust on the monitor.',
      'The harvest season is very busy.','The farmer needs the machine today.',
      'Autosteer drives in a straight line.',
    ],
  },
  {
    id: 503, title: 'Phone Greetings', emoji: '📞',
    verbs: ['To Answer', 'To Call', 'To Help', 'To Speak'],
    vocab: [
      {en:'Phone call',pt:'Ligação'},{en:'To answer',pt:'Atender'},{en:'To call',pt:'Ligar'},
      {en:'To help',pt:'Ajudar'},{en:'Customer',pt:'Cliente'},{en:'Good morning',pt:'Bom dia'},
      {en:'Good afternoon',pt:'Boa tarde'},{en:'How can I help you?',pt:'Como posso ajudar?'},
      {en:'One moment, please',pt:'Um momento, por favor'},{en:'To wait',pt:'Esperar'},
      {en:'To speak',pt:'Falar'},{en:'Slowly',pt:'Devagar'},{en:'To repeat',pt:'Repetir'},
      {en:'To understand',pt:'Entender'},{en:'Name',pt:'Nome'},{en:'Company',pt:'Empresa'},
      {en:'Message',pt:'Recado, mensagem'},{en:'To call back',pt:'Retornar a ligação'},
      {en:'Busy',pt:'Ocupado'},{en:'Available',pt:'Disponível'},{en:'Of course',pt:'Claro'},
      {en:'Thank you for calling',pt:'Obrigado por ligar'},{en:'You\'re welcome',pt:'De nada'},
      {en:'Excuse me',pt:'Com licença / desculpe'},{en:'Sorry',pt:'Desculpe'},
      {en:'Please',pt:'Por favor'},{en:'Sure',pt:'Com certeza'},{en:'Right away',pt:'Imediatamente'},
      {en:'Later',pt:'Mais tarde'},{en:'Today',pt:'Hoje'},
    ],
    expressions: [
      {expr:'Good morning, GPS Tronic, how can I help you?',meaning:'Bom dia, GPS Tronic, como posso ajudar?',example:'Good morning, GPS Tronic, how can I help you?'},
      {expr:'One moment, please',meaning:'Um momento, por favor',example:'One moment, please. I will check.'},
      {expr:'Can you speak slowly, please?',meaning:'Pode falar devagar, por favor?',example:'Sorry, can you speak slowly, please?'},
      {expr:'Can you repeat that, please?',meaning:'Pode repetir, por favor?',example:'Can you repeat that, please? The line is bad.'},
    ],
    sentences: [
      'Good morning, GPS Tronic, how can I help you?','One moment, please.',
      'Can you speak slowly, please?','Can you repeat that, please?',
      'What is your name, please?','Thank you for calling.',
      'I can help you with that.','He is busy now. Can he call back later?',
    ],
    grammar: {
      title: 'Frases prontas de atendimento (polite phrases)',
      rules: [
        'Comece sempre com a saudação + nome da empresa: Good morning, GPS Tronic.',
        '"Can you...?" + please = pedido educado: Can you repeat that, please?',
        '"Can I...?" para oferecer ajuda: Can I take a message?',
        'Não precisa de frases longas — educado e curto funciona: One moment, please.',
      ],
      table: {
        headers: ['Situação','Frase pronta','Tradução','Dica'],
        rows: [
          ['atender','Good morning, how can I help you?','Bom dia, como posso ajudar?','sorria ao falar'],
          ['pedir pra esperar','One moment, please.','Um momento, por favor.','curto e educado'],
          ['não entendeu','Can you repeat that, please?','Pode repetir, por favor?','sem vergonha de pedir'],
          ['pedir devagar','Can you speak slowly, please?','Pode falar devagar?','todo mundo entende'],
        ]
      }
    },
    quiz: [
      {q:'Good morning, GPS Tronic, how can I ___ you?',a:'help',opts:['help','helps','helping','helped']},
      {q:'One ___, please.',a:'moment',opts:['moment','minute hour','time','wait']},
      {q:'Can you ___ slowly, please?',a:'speak',opts:['speak','speaks','spoke','speaking']},
      {q:'Can you ___ that, please?',a:'repeat',opts:['repeat','repeats','repeating','again']},
      {q:'Thank you for ___.',a:'calling',opts:['calling','call','calls','called']},
    ],
    speak: [
      'Good morning, GPS Tronic, how can I help you?','One moment, please.',
      'Can you speak slowly, please?','What is your name, please?',
      'Thank you for calling.',
    ],
  },
  {
    id: 504, title: 'Customer Questions', emoji: '❓',
    verbs: ['To Ask', 'To Start', 'To Happen', 'To Bring'],
    vocab: [
      {en:'Question',pt:'Pergunta'},{en:'To ask',pt:'Perguntar'},{en:'What',pt:'O quê'},
      {en:'When',pt:'Quando'},{en:'Where',pt:'Onde'},{en:'Why',pt:'Por quê'},
      {en:'How',pt:'Como'},{en:'To happen',pt:'Acontecer'},{en:'To start',pt:'Começar'},
      {en:'Yesterday',pt:'Ontem'},{en:'Last week',pt:'Semana passada'},{en:'This morning',pt:'Hoje de manhã'},
      {en:'To bring',pt:'Trazer'},{en:'To send',pt:'Enviar'},{en:'Photo',pt:'Foto'},
      {en:'Model',pt:'Modelo'},{en:'Brand',pt:'Marca'},{en:'Serial number',pt:'Número de série'},
      {en:'Warranty',pt:'Garantia'},{en:'Appointment',pt:'Agendamento, hora marcada'},
      {en:'Visit',pt:'Visita'},{en:'Address',pt:'Endereço'},{en:'To describe',pt:'Descrever'},
      {en:'Noise',pt:'Barulho'},{en:'To freeze',pt:'Travar (tela)'},{en:'To restart',pt:'Reiniciar'},
      {en:'Sometimes',pt:'Às vezes'},{en:'Always',pt:'Sempre'},{en:'Never',pt:'Nunca'},
      {en:'Every day',pt:'Todos os dias'},
    ],
    expressions: [
      {expr:'What is the problem?',meaning:'Qual é o problema?',example:'What is the problem with the GPS?'},
      {expr:'When did it start?',meaning:'Quando começou?',example:'When did it start? Yesterday?'},
      {expr:'What model is it?',meaning:'Qual é o modelo?',example:'What model is it? Trimble or Ag Leader?'},
      {expr:'Can you send a photo?',meaning:'Pode enviar uma foto?',example:'Can you send a photo of the screen?'},
    ],
    sentences: [
      'What is the problem?','When did it start?',
      'What model is it?','Can you send a photo of the screen?',
      'Does it happen every day?','Is the device under warranty?',
      'Can you bring the device to the shop?','I can visit the farm on Friday.',
    ],
    grammar: {
      title: 'Perguntas do técnico: What / When / How + did',
      rules: [
        'Perguntas com palavra-chave: What (o quê), When (quando), Where (onde), How (como).',
        'Presente: Does it happen every day? (he/she/it usa does).',
        'Passado: When did it start? (did + verbo base, sem -ed).',
        'Faça UMA pergunta de cada vez — mais fácil pra você e pro cliente.',
      ],
      table: {
        headers: ['Pergunta','Uso','Exemplo','Resposta comum'],
        rows: [
          ['What...?','identificar o problema','What is the problem?','The screen is frozen.'],
          ['When did...?','saber quando começou','When did it start?','It started yesterday.'],
          ['Does it...?','frequência (presente)','Does it happen every day?','Yes, every morning.'],
          ['Can you...?','pedir algo ao cliente','Can you send a photo?','Sure, one moment.'],
        ]
      }
    },
    quiz: [
      {q:'___ is the problem?',a:'What',opts:['What','When','Who','Which']},
      {q:'When ___ it start?',a:'did',opts:['did','do','does','is']},
      {q:'___ it happen every day?',a:'Does',opts:['Does','Do','Is','Did']},
      {q:'Can you ___ a photo of the screen?',a:'send',opts:['send','sends','sending','sent']},
      {q:'It started ___.',a:'yesterday',opts:['yesterday','tomorrow','next week','later']},
    ],
    speak: [
      'What is the problem?','When did it start?',
      'What model is it?','Can you send a photo of the screen?',
      'Does it happen every day?',
    ],
  },
  {
    id: 505, title: 'What I Fixed Today', emoji: '🔧',
    verbs: ['To Fix', 'To Replace', 'To Test', 'To Find'],
    vocab: [
      {en:'To fix',pt:'Consertar'},{en:'To replace',pt:'Substituir, trocar'},{en:'To test',pt:'Testar'},
      {en:'To find',pt:'Encontrar'},{en:'To open',pt:'Abrir'},{en:'To clean',pt:'Limpar'},
      {en:'Part',pt:'Peça'},{en:'Spare part',pt:'Peça de reposição'},{en:'New part',pt:'Peça nova'},
      {en:'Fuse',pt:'Fusível'},{en:'Wire',pt:'Fio'},{en:'Connector',pt:'Conector'},
      {en:'Damaged',pt:'Danificado'},{en:'Burned',pt:'Queimado'},{en:'Loose',pt:'Solto, frouxo'},
      {en:'Dirty',pt:'Sujo'},{en:'Inside',pt:'Dentro'},{en:'Outside',pt:'Fora'},
      {en:'Water',pt:'Água'},{en:'Yesterday',pt:'Ontem'},{en:'This morning',pt:'Hoje de manhã'},
      {en:'It was',pt:'Estava / era'},{en:'It works now',pt:'Funciona agora'},
      {en:'Done',pt:'Feito, pronto'},{en:'Finished',pt:'Terminado'},{en:'Result',pt:'Resultado'},
      {en:'Cause',pt:'Causa'},{en:'Solution',pt:'Solução'},{en:'Simple',pt:'Simples'},
      {en:'Serious',pt:'Grave, sério'},
    ],
    expressions: [
      {expr:'I found the problem',meaning:'Eu encontrei o problema',example:'I found the problem. The cable was damaged.'},
      {expr:'The cable was damaged',meaning:'O cabo estava danificado',example:'The cable was damaged by water.'},
      {expr:'I replaced the part',meaning:'Eu troquei a peça',example:'I replaced the part this morning.'},
      {expr:'I tested it and it works now',meaning:'Eu testei e funciona agora',example:'I tested it and it works now. All good!'},
    ],
    sentences: [
      'I found the problem this morning.','The cable was damaged.',
      'I replaced the antenna cable.','I cleaned the connector.',
      'The fuse was burned.','I tested the GPS in the field.',
      'It works now.','The repair was simple.',
    ],
    grammar: {
      title: 'Passado Simples: contando o conserto',
      rules: [
        'Verbos regulares ganham -ed: I checked, I tested, I replaced, I cleaned.',
        'Verbos irregulares mudam: find → found / was, were (verbo to be no passado).',
        'Estrutura de explicação: I found X → X was damaged → I replaced X → It works now.',
        'Essa sequência de 4 frases resolve 90% das explicações pro cliente.',
      ],
      table: {
        headers: ['Etapa','Frase','Tradução','Verbo'],
        rows: [
          ['1. o que achou','I found the problem.','Encontrei o problema.','find → found'],
          ['2. o que estava','The cable was damaged.','O cabo estava danificado.','is → was'],
          ['3. o que fez','I replaced the cable.','Troquei o cabo.','replace + d'],
          ['4. resultado','It works now.','Funciona agora.','presente de novo'],
        ]
      }
    },
    quiz: [
      {q:'I ___ the problem this morning.',a:'found',opts:['found','find','finds','finding']},
      {q:'The cable ___ damaged.',a:'was',opts:['was','is were','are','be']},
      {q:'I ___ the antenna cable.',a:'replaced',opts:['replaced','replace','replaces','replacing']},
      {q:'I ___ the GPS in the field.',a:'tested',opts:['tested','test','tests','testing']},
      {q:'It ___ now.',a:'works',opts:['works','work','worked','working']},
    ],
    speak: [
      'I found the problem this morning.','The cable was damaged.',
      'I replaced the part.','I tested it and it works now.',
      'The repair was simple.',
    ],
  },
  {
    id: 506, title: 'Promising a Deadline', emoji: '📅',
    verbs: ['To Promise', 'To Finish', 'To Deliver', 'To Cost'],
    vocab: [
      {en:'Deadline',pt:'Prazo'},{en:'To promise',pt:'Prometer'},{en:'To finish',pt:'Terminar'},
      {en:'To deliver',pt:'Entregar'},{en:'Ready',pt:'Pronto'},{en:'To cost',pt:'Custar'},
      {en:'Price',pt:'Preço'},{en:'To pay',pt:'Pagar'},{en:'Invoice',pt:'Nota fiscal, fatura'},
      {en:'Cheap',pt:'Barato'},{en:'Expensive',pt:'Caro'},{en:'Discount',pt:'Desconto'},
      {en:'Monday',pt:'Segunda-feira'},{en:'Tuesday',pt:'Terça-feira'},{en:'Wednesday',pt:'Quarta-feira'},
      {en:'Thursday',pt:'Quinta-feira'},{en:'Friday',pt:'Sexta-feira'},{en:'Next week',pt:'Semana que vem'},
      {en:'Tomorrow',pt:'Amanhã'},{en:'In two days',pt:'Em dois dias'},{en:'Late',pt:'Atrasado'},
      {en:'On time',pt:'No prazo'},{en:'To need',pt:'Precisar'},{en:'To order',pt:'Encomendar, pedir'},
      {en:'To arrive',pt:'Chegar'},{en:'Supplier',pt:'Fornecedor'},{en:'To wait for',pt:'Esperar por'},
      {en:'I am sorry',pt:'Sinto muito'},{en:'Sure',pt:'Com certeza'},{en:'No problem',pt:'Sem problema'},
    ],
    expressions: [
      {expr:"It's going to be ready on Friday",meaning:'Vai ficar pronto na sexta',example:"It's going to be ready on Friday morning."},
      {expr:'The part is going to arrive tomorrow',meaning:'A peça vai chegar amanhã',example:'The part is going to arrive tomorrow.'},
      {expr:'I am going to call you when it is ready',meaning:'Vou te ligar quando estiver pronto',example:'I am going to call you when it is ready.'},
      {expr:'It costs two hundred dollars',meaning:'Custa duzentos dólares',example:'The new antenna costs two hundred dollars.'},
    ],
    sentences: [
      "It's going to be ready on Friday.",'The part is going to arrive tomorrow.',
      'I am going to call you when it is ready.','I need to order a new part.',
      'The repair costs three hundred reais.','I am sorry, it is going to take two more days.',
      'We deliver on time.','No problem, I can wait.',
    ],
    grammar: {
      title: 'Going to: prometendo prazos ao cliente',
      rules: [
        '"Going to" para planos e promessas: It is going to be ready on Friday.',
        'Estrutura: am/is/are + going to + verbo base.',
        'Atraso com educação: I am sorry, it is going to take two more days.',
        'Sempre prometa um dia específico — o cliente confia mais: on Friday, tomorrow morning.',
      ],
      table: {
        headers: ['Situação','Frase','Tradução','Dica'],
        rows: [
          ['prometer prazo',"It's going to be ready on Friday.",'Vai ficar pronto sexta.','dia específico'],
          ['peça a caminho','The part is going to arrive tomorrow.','A peça chega amanhã.','tranquiliza o cliente'],
          ['avisar depois','I am going to call you when it is ready.','Te ligo quando ficar pronto.','promessa de contato'],
          ['atraso educado',"I'm sorry, it's going to take two more days.",'Desculpe, vai levar mais 2 dias.','sorry + prazo novo'],
        ]
      }
    },
    quiz: [
      {q:"It's ___ to be ready on Friday.",a:'going',opts:['going','go','goes','went']},
      {q:'The part is going to ___ tomorrow.',a:'arrive',opts:['arrive','arrives','arrived','arriving']},
      {q:'I am going to ___ you when it is ready.',a:'call',opts:['call','calls','called','calling']},
      {q:'The repair ___ three hundred reais.',a:'costs',opts:['costs','cost','costing','costed']},
      {q:'I am sorry, it is going to ___ two more days.',a:'take',opts:['take','takes','took','taking']},
    ],
    speak: [
      "It's going to be ready on Friday.",'The part is going to arrive tomorrow.',
      'I am going to call you when it is ready.','The repair costs three hundred reais.',
      'I am sorry, it is going to take two more days.',
    ],
  },
  {
    id: 507, title: 'Ordering Parts', emoji: '🧩',
    verbs: ['To Order', 'To Send', 'To Arrive', 'To Check'],
    vocab: [
      {en:'Supplier',pt:'Fornecedor'},{en:'To order',pt:'Encomendar'},{en:'In stock',pt:'Em estoque'},
      {en:'Out of stock',pt:'Em falta'},{en:'To send',pt:'Enviar'},{en:'Delivery',pt:'Entrega'},
      {en:'Shipping',pt:'Frete'},{en:'Order number',pt:'Número do pedido'},{en:'To arrive',pt:'Chegar'},
      {en:'To wait',pt:'Esperar'},{en:'Expensive',pt:'Caro'},{en:'Cheap',pt:'Barato'},
      {en:'Available',pt:'Disponível'},{en:'Quantity',pt:'Quantidade'},{en:'Box',pt:'Caixa'},
      {en:'Package',pt:'Pacote, encomenda'},{en:'Model',pt:'Modelo'},{en:'Size',pt:'Tamanho'},
      {en:'To pay',pt:'Pagar'},{en:'To check',pt:'Verificar'},{en:'Email',pt:'E-mail'},
      {en:'To answer',pt:'Responder'},{en:'Urgent',pt:'Urgente'},{en:'Wrong',pt:'Errado'},
      {en:'Right',pt:'Certo'},{en:'To need',pt:'Precisar'},{en:'Please',pt:'Por favor'},
      {en:'Thank you',pt:'Obrigado'},{en:'How much',pt:'Quanto (preço)'},{en:'How long',pt:'Quanto tempo'},
    ],
    expressions: [
      {expr:'Do you have this part in stock?',meaning:'Vocês têm essa peça em estoque?',example:'Hello! Do you have this part in stock?'},
      {expr:'How much is the shipping?',meaning:'Quanto é o frete?',example:'How much is the shipping to Brazil?'},
      {expr:'Can you send it this week?',meaning:'Você consegue enviar essa semana?',example:'Can you send it this week, please?'},
      {expr:'How long does it take?',meaning:'Quanto tempo demora?',example:'How long does it take to arrive?'},
    ],
    sentences: [
      'Do you have this part in stock?','I need two cables, please.',
      'How much is the shipping?','How long does it take?',
      'Can you send it this week?','The part is out of stock.',
      'My order number is 4471.','The package arrived this morning.',
    ],
    grammar: {
      title: 'Perguntas e pedidos: Do you…? / Can you…?',
      rules: [
        'Perguntas no presente: Do + you + verbo BASE. "Do you have this part?" (nunca "Do you has").',
        'Com he/she/it usa Does: "Does it work with Ag Leader?" — e o verbo continua na base.',
        'Pedidos educados: Can you / Could you + verbo BASE. "Can you send it today?"',
        'Preço e tempo: How much (preço) e How long (duração). "How much is it?" / "How long does it take?"',
      ],
      table: {
        headers: ['Situação','Frase','Tradução','Dica'],
        rows: [
          ['perguntar estoque','Do you have this part?','Vocês têm essa peça?','Do + verbo base'],
          ['perguntar preço','How much is the shipping?','Quanto é o frete?','How much + is'],
          ['perguntar prazo','How long does it take?','Quanto tempo demora?','How long + does'],
          ['pedir com educação','Can you send it this week?','Pode enviar essa semana?','Can + verbo base'],
        ]
      }
    },
    quiz: [
      {q:'___ you have this part in stock?',a:'Do',opts:['Do','Does','Are','Is']},
      {q:'Can you ___ it this week?',a:'send',opts:['send','sends','sent','sending']},
      {q:'How ___ is the shipping?',a:'much',opts:['much','many','long','far']},
      {q:'How long ___ it take?',a:'does',opts:['does','do','is','are']},
      {q:'The package ___ this morning.',a:'arrived',opts:['arrived','arrive','arriving','arrives']},
    ],
    speak: [
      'Do you have this part in stock?','How much is the shipping?',
      'How long does it take?','Can you send it this week?',
      'My order number is 4471.',
    ],
  },
  {
    id: 508, title: 'At the Farm', emoji: '🌾',
    verbs: ['To Drive', 'To Show', 'To Find', 'To Clean'],
    vocab: [
      {en:'Farm',pt:'Fazenda'},{en:'Field',pt:'Campo, lavoura'},{en:'Cab',pt:'Cabine'},
      {en:'Roof',pt:'Teto'},{en:'Seat',pt:'Banco'},{en:'Screen',pt:'Tela'},
      {en:'Dust',pt:'Poeira'},{en:'Mud',pt:'Lama'},{en:'Owner',pt:'Dono, produtor'},
      {en:'To show',pt:'Mostrar'},{en:'To drive',pt:'Dirigir'},{en:'To find',pt:'Encontrar'},
      {en:'To clean',pt:'Limpar'},{en:'Harvest',pt:'Colheita'},{en:'Far',pt:'Longe'},
      {en:'Near',pt:'Perto'},{en:'In',pt:'Dentro de'},{en:'On',pt:'Em cima de'},
      {en:'Under',pt:'Embaixo de'},{en:'Next to',pt:'Ao lado de'},{en:'Behind',pt:'Atrás de'},
      {en:'In front of',pt:'Na frente de'},{en:'Shed',pt:'Galpão'},{en:'Gate',pt:'Portão'},
      {en:'Road',pt:'Estrada'},{en:'Nice to meet you',pt:'Prazer em conhecer'},{en:'Hot',pt:'Quente'},
      {en:'Rain',pt:'Chuva'},{en:'Morning',pt:'Manhã'},{en:'Afternoon',pt:'Tarde'},
    ],
    expressions: [
      {expr:'Nice to meet you',meaning:'Prazer em conhecer',example:'Hello, nice to meet you. I am from GPS Tronic.'},
      {expr:'Where is the tractor?',meaning:'Onde está o trator?',example:'Good morning! Where is the tractor?'},
      {expr:'Can you show me the problem?',meaning:'Pode me mostrar o problema?',example:'Can you show me the problem, please?'},
      {expr:'There is a lot of dust here',meaning:'Tem muita poeira aqui',example:'There is a lot of dust on the antenna.'},
    ],
    sentences: [
      'Nice to meet you.','Where is the tractor?',
      'Can you show me the problem?','The monitor is in the cab.',
      'The antenna is on the roof.','The cable is under the seat.',
      'There are two tractors in the field.','The farm is very far from the city.',
    ],
    grammar: {
      title: 'Onde as coisas estão: in / on / under / next to',
      rules: [
        'in = DENTRO de um espaço fechado: "The monitor is in the cab."',
        'on = EM CIMA de uma superfície: "The antenna is on the roof."',
        'under = EMBAIXO: "The cable is under the seat."',
        'next to = AO LADO: "The tractor is next to the shed." Pergunta com Where is…? / Where are…?',
      ],
      table: {
        headers: ['Preposição','Frase','Tradução','Dica'],
        rows: [
          ['in','The monitor is in the cab.','O monitor está na cabine.','dentro'],
          ['on','The antenna is on the roof.','A antena está no teto.','em cima'],
          ['under','The cable is under the seat.','O cabo está embaixo do banco.','embaixo'],
          ['next to','The tractor is next to the shed.','O trator está ao lado do galpão.','ao lado'],
        ]
      }
    },
    quiz: [
      {q:'The monitor is ___ the cab.',a:'in',opts:['in','on','under','next']},
      {q:'The antenna is ___ the roof.',a:'on',opts:['on','in','under','behind']},
      {q:'The cable is ___ the seat.',a:'under',opts:['under','on','in','near']},
      {q:'___ two tractors in the field.',a:'There are',opts:['There are','There is','There have','It are']},
      {q:'Can you ___ me the problem?',a:'show',opts:['show','shows','showed','showing']},
    ],
    speak: [
      'Nice to meet you.','Where is the tractor?',
      'Can you show me the problem?','The antenna is on the roof.',
      'There are two tractors in the field.',
    ],
  },
  {
    id: 509, title: 'Booking the Visit', emoji: '🗓️',
    verbs: ['To Book', 'To Meet', 'To Confirm', 'To Cancel'],
    vocab: [
      {en:'Appointment',pt:'Hora marcada, compromisso'},{en:'To book',pt:'Agendar'},{en:'To meet',pt:'Encontrar'},
      {en:'Schedule',pt:'Agenda, cronograma'},{en:'Free',pt:'Livre, disponível'},{en:'Busy',pt:'Ocupado'},
      {en:'Morning',pt:'Manhã'},{en:'Afternoon',pt:'Tarde'},{en:"O'clock",pt:'Em ponto'},
      {en:'Half past',pt:'E meia'},{en:'Early',pt:'Cedo'},{en:'Late',pt:'Tarde, atrasado'},
      {en:'To confirm',pt:'Confirmar'},{en:'To cancel',pt:'Cancelar'},{en:'Monday',pt:'Segunda-feira'},
      {en:'Tuesday',pt:'Terça-feira'},{en:'Wednesday',pt:'Quarta-feira'},{en:'Thursday',pt:'Quinta-feira'},
      {en:'Friday',pt:'Sexta-feira'},{en:'Saturday',pt:'Sábado'},{en:'This week',pt:'Esta semana'},
      {en:'Next week',pt:'Semana que vem'},{en:'At nine',pt:'Às nove'},{en:'On Tuesday',pt:'Na terça'},
      {en:'In March',pt:'Em março'},{en:'In the morning',pt:'De manhã'},{en:'In the afternoon',pt:'À tarde'},
      {en:'Running late',pt:'Atrasado (a caminho)'},{en:'Visit',pt:'Visita técnica'},{en:'Gate',pt:'Portão da fazenda'},
    ],
    expressions: [
      {expr:'Are you free on Monday?',meaning:'Você está livre na segunda?',example:'Are you free on Monday morning for the visit?'},
      {expr:'Does Tuesday work for you?',meaning:'Terça funciona para você?',example:'Monday is busy. Does Tuesday work for you?'},
      {expr:'I can be there at nine',meaning:'Posso estar aí às nove',example:'I can be there at nine in the morning.'},
      {expr:'I will confirm by message',meaning:'Vou confirmar por mensagem',example:'I will leave early and confirm by message.'},
    ],
    sentences: [
      'Are you free this week?','Does Tuesday work for you?',
      'I can be there at nine in the morning.','Half past ten is perfect.',
      'The visit is on Monday.','We are very busy in March.',
      'I will confirm the visit by message.','Sorry, I am running ten minutes late.',
    ],
    grammar: {
      title: 'Preposições de tempo: AT (hora) · ON (dia) · IN (mês/período)',
      rules: [
        'Use AT para horas exatas: at nine o\'clock, at half past ten.',
        'Use ON para dias da semana e datas: on Monday, on Tuesday morning.',
        'Use IN para meses, anos e partes do dia: in March, in the morning, in the afternoon.',
        'Para propor um dia ao cliente, pergunte: "Does Tuesday work for you?" ou "Are you free on Monday?"',
      ],
      table: {
        headers: ['Preposição','Uso','Exemplo','Tradução'],
        rows: [
          ['at','hora exata','I can be there at nine.','Posso estar aí às nove.'],
          ['on','dia da semana','The visit is on Tuesday.','A visita é na terça.'],
          ['in','mês / período','We are busy in March.','Estamos ocupados em março.'],
          ['in the','manhã / tarde','In the morning / afternoon.','De manhã / à tarde.'],
        ]
      }
    },
    quiz: [
      {q:'I can be there ___ nine o\'clock.',a:'at',opts:['at','on','in','to']},
      {q:'The technical visit is ___ Tuesday.',a:'on',opts:['on','at','in','for']},
      {q:'Does Thursday ___ for you?',a:'work',opts:['work','works','working','worked']},
      {q:'Are you ___ tomorrow morning?',a:'free',opts:['free','schedule','book','appointment']},
      {q:'I will ___ the time by message.',a:'confirm',opts:['confirm','confirms','confirmed','confirming']},
    ],
    speak: [
      'Are you free on Monday?','Does Tuesday work for you?',
      'I can be there at nine in the morning.','Half past ten is perfect.',
      'I will confirm by message.',
    ],
  },
  {
    id: 510, title: 'Price, Quotes & Payment', emoji: '💰',
    verbs: ['To Cost', 'To Pay', 'To Charge', 'To Include'],
    vocab: [
      {en:'Price',pt:'Preço'},{en:'Quote',pt:'Orçamento'},{en:'To cost',pt:'Custar'},
      {en:'To pay',pt:'Pagar'},{en:'Payment',pt:'Pagamento'},{en:'Cash',pt:'Dinheiro à vista'},
      {en:'Discount',pt:'Desconto'},{en:'Included',pt:'Incluído'},{en:'Labour',pt:'Mão de obra'},
      {en:'Total',pt:'Total'},{en:'Cheaper',pt:'Mais barato'},{en:'More expensive',pt:'Mais caro'},
      {en:'More reliable',pt:'Mais confiável'},{en:'To charge',pt:'Cobrar'},{en:'Budget',pt:'Orçamento do cliente'},
      {en:'Invoice',pt:'Nota fiscal'},{en:'Original part',pt:'Peça original'},{en:'Copy',pt:'Peça paralela'},
      {en:'Option',pt:'Opção'},{en:'Difference',pt:'Diferença'},{en:'Warranty',pt:'Garantia'},
      {en:'Free check',pt:'Avaliação gratuita'},{en:'Extra',pt:'Extra, adicional'},{en:'Bank transfer',pt:'Transferência bancária'},
      {en:'Credit card',pt:'Cartão de crédito'},{en:'Installment',pt:'Parcela'},{en:'Receipt',pt:'Recibo'},
      {en:'Fair price',pt:'Preço justo'},{en:'To approve',pt:'Aprovar'},{en:'After the repair',pt:'Depois do conserto'},
    ],
    expressions: [
      {expr:'How much does it cost?',meaning:'Quanto custa?',example:'How much does the new antenna cost?'},
      {expr:'Labour is included in the price',meaning:'A mão de obra está incluída no preço',example:'The total is 550 reais. Labour is included in the price.'},
      {expr:'The original is more expensive, but more reliable',meaning:'A original é mais cara, mas mais confiável',example:'The original is more expensive, but it is more reliable.'},
      {expr:'You can pay after the repair',meaning:'Você pode pagar depois do conserto',example:'No problem — you can pay after the repair.'},
    ],
    sentences: [
      'How much does the repair cost?','I will send you a quote today.',
      'The antenna costs four hundred reais.','Labour is included in the price.',
      'This cable is cheaper than the original.','The original part is more reliable.',
      'Can you give me a small discount?','You can pay by Pix after the repair.',
    ],
    grammar: {
      title: 'Comparativos de preço e qualidade: cheaper vs. more expensive',
      rules: [
        'Adjetivos curtos ganham -er: cheap → cheaper (mais barato), fast → faster (mais rápido).',
        'Adjetivos longos usam more antes: expensive → more expensive, reliable → more reliable.',
        'Use than para comparar duas opções: "This part is cheaper than the original."',
        'Nunca diga "more cheap" — diga sempre "cheaper".',
      ],
      table: {
        headers: ['Adjetivo','Comparativo','Exemplo','Tradução'],
        rows: [
          ['cheap (curto)','cheaper','This copy is cheaper.','Esta paralela é mais barata.'],
          ['fast (curto)','faster','This receiver is faster.','Este receptor é mais rápido.'],
          ['expensive (longo)','more expensive','The original is more expensive.','A original é mais cara.'],
          ['reliable (longo)','more reliable','Trimble is more reliable.','Trimble é mais confiável.'],
        ]
      }
    },
    quiz: [
      {q:'This part is ___ than the original.',a:'cheaper',opts:['cheaper','more cheap','cheapest','cheap']},
      {q:'The original antenna is ___ reliable.',a:'more',opts:['more','most','much','veryer']},
      {q:'Labour is ___ in the total price.',a:'included',opts:['included','include','including','includes']},
      {q:'How much ___ the repair cost?',a:'does',opts:['does','do','is','are']},
      {q:'You can ___ after the repair.',a:'pay',opts:['pay','pays','paid','paying']},
    ],
    speak: [
      'How much does it cost?','I will send you a quote today.',
      'Labour is included in the price.','The original is more expensive, but more reliable.',
      'You can pay after the repair.',
    ],
  },
  {
    id: 511, title: 'Small Talk at the Farm', emoji: '☕',
    verbs: ['To Like', 'To Work', 'To Enjoy', 'To Watch'],
    vocab: [
      {en:'Weekend',pt:'Fim de semana'},{en:'Family',pt:'Família'},{en:'Weather',pt:'Tempo, clima'},
      {en:'Crop',pt:'Safra, lavoura'},{en:'Rain',pt:'Chuva'},{en:'Dry',pt:'Seco'},
      {en:'Football',pt:'Futebol'},{en:'Coffee',pt:'Café'},{en:'Tired',pt:'Cansado'},
      {en:'How often',pt:'Com que frequência'},{en:'Every day',pt:'Todo dia'},{en:'Sometimes',pt:'Às vezes'},
      {en:'Never',pt:'Nunca'},{en:'To enjoy',pt:'Gostar de, curtir'},{en:'Better',pt:'Melhor'},
      {en:'Last year',pt:'Ano passado'},{en:'This year',pt:'Este ano'},{en:'Next month',pt:'Mês que vem'},
      {en:'Good news',pt:'Boa notícia'},{en:'To rest',pt:'Descansar'},{en:'Same here',pt:'Aqui também'},
      {en:'Me too',pt:'Eu também'},{en:'Not really',pt:'Na verdade não'},{en:'My pleasure',pt:'De nada, com prazer'},
      {en:'Outside',pt:'Ao ar livre'},{en:'Road',pt:'Estrada'},{en:'Trip',pt:'Viagem'},
      {en:'Region',pt:'Região'},{en:'Soybean harvest',pt:'Colheita da soja'},{en:'Corn season',pt:'Safra do milho'},
    ],
    expressions: [
      {expr:'How is everything?',meaning:'Como vão as coisas?',example:'Good morning! Thank you for the coffee. How is everything?'},
      {expr:'How is the crop this year?',meaning:'Como está a safra este ano?',example:'How is the crop this year? Better than last year?'},
      {expr:'Do you work on Saturdays?',meaning:'Você trabalha aos sábados?',example:'Do you work on Saturdays too? — Sometimes.'},
      {expr:'Have a good weekend!',meaning:'Bom fim de semana!',example:'The monitor is working now. Have a good weekend!'},
    ],
    sentences: [
      'Good morning! How is everything?','How is the crop this year?',
      'It is better than last year because we had more rain.','Do you work on Saturdays too?',
      'Sometimes, during the harvest season.','I prefer to rest with my family on Sunday.',
      'I love football. I watch every Sunday.','Thank you for the coffee. Have a good weekend!',
    ],
    grammar: {
      title: 'Quebrando o gelo: Do you…? / How often…? / And you?',
      rules: [
        'Use "Do you…?" para puxar conversa sobre rotina: "Do you work on Saturdays?"',
        'Use "How is…?" para perguntar da safra ou do clima: "How is the crop this year?"',
        'Para devolver a pergunta sem repetir tudo, diga apenas: "And you?" (E você?).',
        'Respostas curtas naturais: "Me too!" (Eu também!), "Same here!" (Aqui também!), "Not really." (Não muito).',
      ],
      table: {
        headers: ['Pergunta / Fala','Tradução','Resposta natural','Uso na fazenda'],
        rows: [
          ['How is everything?','Como vão as coisas?','Busy, but good!','ao chegar na fazenda'],
          ['How is the crop this year?','Como está a safra?','Better than last year.','no café com o cliente'],
          ['Do you work on Saturdays?','Trabalha aos sábados?','Sometimes. And you?','enquanto testa o GPS'],
          ['Have a good weekend!','Bom fim de semana!','Thanks, you too!','na despedida'],
        ]
      }
    },
    quiz: [
      {q:'How ___ the crop this year?',a:'is',opts:['is','are','do','does']},
      {q:'___ you work on Saturdays too?',a:'Do',opts:['Do','Does','Are','Is']},
      {q:'I like football. — ___ too!',a:'Me',opts:['Me','I','My','Mine']},
      {q:'___ often do you visit this region?',a:'How',opts:['How','What','When','Where']},
      {q:'See you next time. ___ a good weekend!',a:'Have',opts:['Have','Has','Do','Make']},
    ],
    speak: [
      'How is everything?','How is the crop this year?',
      'Do you work on Saturdays too?','I prefer to rest with my family.',
      'Have a good weekend!',
    ],
  },
  {
    id: 512, title: 'Walk Me Through It (Remote Support)', emoji: '📲',
    verbs: ['To Press', 'To Hold', 'To Unplug', 'To Try'],
    vocab: [
      {en:'Button',pt:'Botão'},{en:'Power button',pt:'Botão de ligar'},{en:'Menu',pt:'Menu'},
      {en:'Arrow',pt:'Seta'},{en:'Arrow down',pt:'Seta para baixo'},{en:'Step',pt:'Passo, etapa'},
      {en:'Corner',pt:'Canto'},{en:'Top corner',pt:'Canto superior'},{en:'Right side',pt:'Lado direito'},
      {en:'Left side',pt:'Lado esquerdo'},{en:'Slowly',pt:'Devagar'},{en:'Again',pt:'De novo'},
      {en:'To press',pt:'Apertar'},{en:'To hold',pt:'Segurar'},{en:'To unplug',pt:'Desconectar'},
      {en:'To plug in',pt:'Conectar na entrada'},{en:'To push',pt:'Empurrar'},{en:'Until it clicks',pt:'Até dar um clique'},
      {en:'To try',pt:'Tentar'},{en:'To restart',pt:'Reiniciar'},{en:'Display',pt:'Visor, tela'},
      {en:'Error message',pt:'Mensagem de erro'},{en:'Green light',pt:'Luz verde'},{en:'First',pt:'Primeiro'},
      {en:'Then',pt:'Depois'},{en:'After that',pt:'Em seguida'},{en:'Finally',pt:'Por fim'},
      {en:'Careful',pt:'Cuidadoso'},{en:'Hard',pt:'Com força'},{en:'Gone',pt:'Sumiu, desapareceu'},
    ],
    expressions: [
      {expr:"Don't worry, I can help you",meaning:'Não se preocupe, eu posso te ajudar',example:"Don't worry, I can help you. What does the display say?"},
      {expr:'Hold it for three seconds',meaning:'Segure por três segundos',example:'Find the power button and hold it for three seconds.'},
      {expr:"Don't pull the cable hard",meaning:'Não puxe o cabo com força',example:"Unplug it slowly. Don't pull the cable hard."},
      {expr:'Try the autosteer again',meaning:'Tente o piloto automático de novo',example:'The light is green! Now try the autosteer again.'},
    ],
    sentences: [
      'First, turn off the monitor.','Then wait ten seconds.',
      'Hold the power button for three seconds.','Unplug the cable slowly and plug it in again.',
      'Push the connector until it clicks.',"Don't pull the cable hard.",
      'Open the menu and press the arrow down.','Try the autosteer again and call me back.',
    ],
    grammar: {
      title: 'Imperativo e Sequência: guiando o cliente pelo telefone',
      rules: [
        'Para dar uma instrução, comece direto com o verbo base (sem "you"): "Press the green button." / "Turn off the monitor."',
        'Para dizer o que NÃO fazer, use Don\'t + verbo base: "Don\'t pull the cable." / "Don\'t turn off the tractor."',
        'Ordene os passos com: First (primeiro) → Then (depois) → After that (em seguida) → Finally (por fim).',
        'Use for + tempo para dizer por quantos segundos segurar: "Hold it for three seconds."',
      ],
      table: {
        headers: ['Tipo','Estrutura','Exemplo','Tradução'],
        rows: [
          ['Instrução','Verbo base','Turn off the monitor.','Desligue o monitor.'],
          ['Alerta negativo',"Don't + verbo","Don't pull the cable hard.",'Não puxe o cabo com força.'],
          ['Duração','Hold + for + tempo','Hold it for three seconds.','Segure por três segundos.'],
          ['Sequência','First / Then / Finally','First wait, then turn it on.','Primeiro espere, depois ligue.'],
        ]
      }
    },
    quiz: [
      {q:'___ the green button on the screen.',a:'Press',opts:['Press','You press','Presses','Pressing']},
      {q:'___ pull the antenna cable hard.',a:"Don't",opts:["Don't","Doesn't","Not","No"]},
      {q:'Hold the power button ___ three seconds.',a:'for',opts:['for','by','in','to']},
      {q:'___, turn off the monitor. Then wait ten seconds.',a:'First',opts:['First','Finally','After','Ago']},
      {q:'Push the connector until it ___.',a:'clicks',opts:['clicks','click','clicked','clicking']},
    ],
    speak: [
      'First, turn off the monitor.','Hold the button for three seconds.',
      "Don't pull the cable hard.",'Push it until it clicks.',
      'Try the autosteer again.',
    ],
  },
  {
    id: 513, title: 'Handling Delays & Bad News', emoji: '⏳',
    verbs: ['To Apologise', 'To Reschedule', 'To Arrive', 'To Promise'],
    vocab: [
      {en:'Delay',pt:'Atraso'},{en:'Bad news',pt:'Má notícia'},{en:'Apology',pt:'Pedido de desculpa'},
      {en:'Patience',pt:'Paciência'},{en:'Solution',pt:'Solução'},{en:'Tracking number',pt:'Código de rastreio'},
      {en:'Unfortunately',pt:'Infelizmente'},{en:'Behind schedule',pt:'Atrasado no cronograma'},{en:'Extra charge',pt:'Cobrança extra'},
      {en:'Instead',pt:'Em vez disso'},{en:'To apologise',pt:'Pedir desculpas'},{en:'To reschedule',pt:'Remarcar'},
      {en:'Supplier',pt:'Fornecedor'},{en:'To arrive',pt:'Chegar'},{en:'Express shipping',pt:'Frete expresso'},
      {en:'Wiring harness',pt:'Chicote elétrico'},{en:'As soon as',pt:'Assim que'},{en:"It's on me",pt:'É por minha conta'},
      {en:'To find out',pt:'Descobrir'},{en:'Wrong',pt:'Errado'},{en:'Harvest week',pt:'Semana de colheita'},
      {en:'To understand',pt:'Entender'},{en:'Normal',pt:'Normal'},{en:'Option',pt:'Opção'},
      {en:'Weekend visit',pt:'Visita de fim de semana'},{en:'First thing',pt:'Primeira coisa (logo cedo)'},{en:'To change',pt:'Mudar'},
      {en:'Available',pt:'Disponível'},{en:'Moment',pt:'Momento'},{en:'To call back',pt:'Ligar de volta'},
    ],
    expressions: [
      {expr:"I'm afraid I have some bad news",meaning:'Receio que eu tenha uma má notícia',example:"I'm afraid I have some bad news about your part."},
      {expr:"I'm really sorry about the delay",meaning:'Sinto muito mesmo pelo atraso',example:"I understand, and I'm really sorry about the delay."},
      {expr:"I can't change the shipping, but I can visit you on Saturday",meaning:'Não posso mudar o frete, mas posso te visitar no sábado',example:"I can't change the shipping time, but I can visit you first on Saturday."},
      {expr:'Thank you for your patience',meaning:'Obrigado pela sua paciência',example:'Thank you for your patience, Marcos. I will call you on Friday.'},
    ],
    sentences: [
      "I'm afraid I have some bad news about your part.",'The wiring harness did not arrive today.',
      'Unfortunately, the supplier is late this week.',"I'm really sorry about the delay.",
      'It will arrive on Friday morning.','I promise I will call you as soon as it is here.',
      'There is no extra charge for the weekend visit.','Thank you for your patience.',
    ],
    grammar: {
      title: 'Dando má notícia com profissionalismo: I\'m afraid… / I can\'t…, but I can…',
      rules: [
        'Use "I\'m afraid…" (Receio que…) antes da notícia ruim para preparar o cliente com educação.',
        'Use "Unfortunately, …" (Infelizmente, …) no início da frase, sempre seguido de vírgula.',
        'Peça desculpa pelo atraso com "I\'m really sorry about the delay." (sorry about + substantivo).',
        'Nunca deixe o "não" sozinho: use "I can\'t [o que não dá], but I can [a alternativa]".',
      ],
      table: {
        headers: ['Etapa','Expressão','Exemplo','Por que funciona'],
        rows: [
          ['1. Avisar',"I'm afraid…","I'm afraid the part is late.",'prepara o cliente'],
          ['2. Empatia',"I'm sorry about…","I'm really sorry about the delay.",'assume o cuidado'],
          ['3. Alternativa',"I can't…, but I can…","I can't ship today, but I can come Saturday.",'oferece saída'],
          ['4. Agradecer','Thank you for your patience.','Thank you for your patience.','fecha com respeito'],
        ]
      }
    },
    quiz: [
      {q:"I'm ___ I have some bad news about your part.",a:'afraid',opts:['afraid','fear','sorry of','scared']},
      {q:"I'm really sorry ___ the delay.",a:'about',opts:['about','of','by','to']},
      {q:'___, express shipping is not available this week.',a:'Unfortunately',opts:['Unfortunately','Unfortunate','Sadly that','Afraid']},
      {q:'There is no extra ___ for the Saturday visit.',a:'charge',opts:['charge','price','money','pay']},
      {q:'Thank you for your ___.',a:'patience',opts:['patience','patient','patients','wait']},
    ],
    speak: [
      "I'm afraid I have some bad news.","I'm really sorry about the delay.",
      'It will arrive on Friday.','I can visit you first on Saturday morning.',
      'Thank you for your patience.',
    ],
  },
  {
    id: 514, title: 'Front Desk Check-In', emoji: '🩺',
    verbs: ['To Drop Off', 'To Keep', 'To Check', 'To Try'],
    vocab: [
      {en:'Serial number',pt:'Número de série'},{en:'Receipt',pt:'Recibo, comprovante'},{en:'Condition',pt:'Estado, condição'},
      {en:'Scratch',pt:'Arranhão'},{en:'Noise',pt:'Barulho'},{en:'Strange',pt:'Estranho'},
      {en:'Suddenly',pt:'De repente'},{en:'Since',pt:'Desde'},{en:'To drop off',pt:'Deixar (na oficina)'},
      {en:'To keep',pt:'Continuar (repetindo)'},{en:'To turn off',pt:'Desligar'},{en:'Estimate',pt:'Estimativa, orçamento'},
      {en:'Warning',pt:'Aviso, alerta'},{en:'On the back',pt:'Na parte de trás'},{en:'Loose cable',pt:'Cabo solto'},
      {en:'Map',pt:'Mapa'},{en:'Touch screen',pt:'Tela sensível ao toque'},{en:'Blank screen',pt:'Tela apagada'},
      {en:'Frozen',pt:'Travado'},{en:'Rough life',pt:'Vida dura (no campo)'},{en:'Together',pt:'Juntos'},
      {en:'By Thursday',pt:'Até quinta-feira'},{en:'Front desk',pt:'Balcão de recepção'},{en:'Check-in',pt:'Entrada do equipamento'},
      {en:'Service order',pt:'Ordem de serviço'},{en:'Customer name',pt:'Nome do cliente'},{en:'Phone number',pt:'Número de telefone'},
      {en:'Symptom',pt:'Sintoma, defeito'},{en:'To inspect',pt:'Inspecionar'},{en:'Safe',pt:'Seguro, guardado'},
    ],
    expressions: [
      {expr:'What seems to be the problem?',meaning:'Qual parece ser o problema?',example:'Welcome to GPS Tronic! What seems to be the problem?'},
      {expr:'It keeps turning off',meaning:'Fica desligando sozinho',example:'I would like to drop off my display. It keeps turning off.'},
      {expr:'Let me check the condition of the equipment',meaning:'Deixa eu conferir o estado do equipamento',example:'Let me check the condition of the equipment before we start.'},
      {expr:"I'll call you by Thursday with an estimate",meaning:'Te ligo até quinta com uma estimativa',example:"Here's your receipt. I'll call you by Thursday with an estimate."},
    ],
    sentences: [
      'Welcome to GPS Tronic. What seems to be the problem?','My display keeps turning off suddenly.',
      'It has been like this since Tuesday.','The screen does not show the map.',
      'The monitor just will not turn on.','I see a small scratch on the screen, but it is not broken.',
      'Can I have the serial number, please?','I will call you by Thursday with an estimate.',
    ],
    grammar: {
      title: 'Descrevendo defeitos: keeps + -ing / won\'t / doesn\'t',
      rules: [
        'Defeito que se repete toda hora: keeps + verbo com -ing ("It keeps turning off." / "The signal keeps dropping.").',
        'Equipamento que se recusa a ligar/funcionar: won\'t + verbo base ("It won\'t turn on.").',
        'Função que não opera no presente: doesn\'t + verbo base ("The screen doesn\'t show the map.").',
        'Use since + dia/data para dizer desde quando: "Since Tuesday."',
      ],
      table: {
        headers: ['Padrão','Sentido','Exemplo','Tradução'],
        rows: [
          ['keeps + -ing','repete sem parar','It keeps turning off.','Fica desligando sozinho.'],
          ["won't + base",'não quer ligar/abrir',"It won't turn on.",'Simplesmente não liga.'],
          ["doesn't + base",'não executa a função',"It doesn't show the map.",'Não mostra o mapa.'],
          ['since + dia','desde quando','Since Tuesday.','Desde terça-feira.'],
        ]
      }
    },
    quiz: [
      {q:'The display keeps ___ off in the field.',a:'turning',opts:['turning','turn','turns','turned']},
      {q:'I pressed the button, but it ___ turn on.',a:"won't",opts:["won't","isn't","don't","not"]},
      {q:'The screen doesn\'t ___ the map.',a:'show',opts:['show','shows','showing','showed']},
      {q:'It has been like this ___ Tuesday.',a:'since',opts:['since','from','for','by']},
      {q:'I will call you ___ Thursday with an estimate.',a:'by',opts:['by','to','in','until on']},
    ],
    speak: [
      'What seems to be the problem?','It keeps turning off.',
      'The screen does not show the map.','Can I have the serial number, please?',
      'I will call you by Thursday with an estimate.',
    ],
  },
  {
    id: 515, title: "It's Ready! (Delivery & Care Tips)", emoji: '✅',
    verbs: ['To Pick Up', 'To Tighten', 'To Clean', 'To Store'],
    vocab: [
      {en:'To pick up',pt:'Buscar, retirar'},{en:'To tighten',pt:'Apertar, firmar'},{en:'To clean',pt:'Limpar'},
      {en:'To store',pt:'Guardar'},{en:'To take care of',pt:'Cuidar de'},{en:'As good as new',pt:'Novo em folha'},
      {en:'Perfectly',pt:'Perfeitamente'},{en:'Tip',pt:'Dica'},{en:'Gently',pt:'Com cuidado, de leve'},
      {en:'Careful',pt:'Cuidadoso'},{en:'Sunlight',pt:'Luz do sol'},{en:'Direct sunlight',pt:'Sol direto'},
      {en:'Soft cloth',pt:'Pano macio'},{en:'Dry',pt:'Seco'},{en:'Firmware update',pt:'Atualização de firmware'},
      {en:'Warranty',pt:'Garantia'},{en:'Connection',pt:'Conexão'},{en:'Three months',pt:'Três meses'},
      {en:'To owe',pt:'Dever (valor)'},{en:'To affect',pt:'Afetar'},{en:'Ready',pt:'Pronto'},
      {en:'Good news',pt:'Boa notícia'},{en:'Together',pt:'Juntos'},{en:'Map',pt:'Mapa'},
      {en:'We have replaced',pt:'Nós trocamos'},{en:'We have tested',pt:'Nós testamos'},{en:'We have installed',pt:'Nós instalamos'},
      {en:'Here you go',pt:'Aqui está'},{en:'To cover',pt:'Cobrir (garantia)'},{en:'Service',pt:'Serviço'},
    ],
    expressions: [
      {expr:'Your display is ready to pick up',meaning:'Seu monitor está pronto para retirar',example:'Good news, Carlos! Your display is ready to pick up.'},
      {expr:'It looks as good as new',meaning:'Parece novo em folha',example:'Wow, the map is back! It looks as good as new.'},
      {expr:'Store it out of the sunlight',meaning:'Guarde longe da luz do sol',example:'One tip: keep it dry and store it out of the sunlight.'},
      {expr:'How much do I owe you?',meaning:'Quanto eu te devo?',example:'Everything is working perfectly. How much do I owe you?'},
    ],
    sentences: [
      'Good news: your display is ready to pick up.','We have replaced the loose cable.',
      'We have tightened the antenna connection.','We have also installed a firmware update.',
      'It is working perfectly now.','It looks as good as new.',
      'Clean the screen gently and store it out of the sunlight.','How much do I owe you?',
    ],
    grammar: {
      title: 'Present Perfect na entrega: We\'ve replaced / We\'ve tested',
      rules: [
        'Para mostrar o resultado pronto do conserto, use We\'ve (We have) + particípio: "We\'ve replaced the cable."',
        'Outros exemplos de bancada: "We\'ve tightened the connection." / "We\'ve cleaned the screen." / "We\'ve tested everything."',
        'Se você disser QUANDO fez (yesterday, on Monday), volte para o Passado Simples: "We installed the update yesterday."',
        'Para dar dicas de conservação na entrega, use o verbo base: "Keep it dry." / "Store it out of the sunlight."',
      ],
      table: {
        headers: ['Tempo','Quando usar','Exemplo','Tradução'],
        rows: [
          ["We've + particípio",'foco no resultado pronto',"We've replaced the cable.",'Trocamos o cabo (está novo).'],
          ["We've tested",'garantir que funciona',"We've tested everything.",'Testamos tudo.'],
          ['Passado + yesterday','quando importa o dia','We did it yesterday.','Fizemos isso ontem.'],
          ['Imperativo (dica)','cuidados do cliente','Keep it dry.','Mantenha seco.'],
        ]
      }
    },
    quiz: [
      {q:"We've ___ the cable and tightened the connection.",a:'replaced',opts:['replaced','replace','replacing','replaces']},
      {q:'We ___ the firmware update yesterday.',a:'installed',opts:['installed','have installed','install','installing']},
      {q:'After the repair, the monitor looks as good as ___.',a:'new',opts:['new','now','good','well']},
      {q:'Store the display out ___ the sunlight.',a:'of',opts:['of','from','to','in']},
      {q:'How much ___ I owe you?',a:'do',opts:['do','does','am','are']},
    ],
    speak: [
      'Your display is ready to pick up.','We have replaced the cable.',
      'We have tested everything.','It looks as good as new.',
      'Store it out of the sunlight.',
    ],
  },
  {
    id: 516, title: 'Messaging a Supplier (Numbers & Dates)', emoji: '📦',
    verbs: ['To Ship', 'To Attach', 'To Reply', 'To Confirm'],
    vocab: [
      {en:'Part number',pt:'Código da peça'},{en:'Unit price',pt:'Preço unitário'},{en:'Exchange rate',pt:'Taxa de câmbio'},
      {en:'Dollar',pt:'Dólar'},{en:'Cents',pt:'Centavos'},{en:'Customs',pt:'Alfândega'},
      {en:'Business day',pt:'Dia útil'},{en:'Photo',pt:'Foto'},{en:'Voice message',pt:'Mensagem de voz, áudio'},
      {en:'To ship',pt:'Despachar, enviar'},{en:'To attach',pt:'Anexar'},{en:'To reply',pt:'Responder'},
      {en:'Spare part',pt:'Peça de reposição'},{en:'Invoice',pt:'Nota fiscal / commercial invoice'},{en:'In stock',pt:'Em estoque'},
      {en:'Quantity',pt:'Quantidade'},{en:'Shipping cost',pt:'Custo do frete'},{en:'Tracking number',pt:'Código de rastreio'},
      {en:'Hundred',pt:'Cem / centena'},{en:'Thousand',pt:'Mil / milhar'},{en:'First (1st)',pt:'Primeiro (dia 1º)'},
      {en:'Second (2nd)',pt:'Segundo (dia 2)'},{en:'Third (3rd)',pt:'Terceiro (dia 3)'},{en:'Digit by digit',pt:'Dígito por dígito'},
      {en:'Oh (zero)',pt:'Zero (em códigos)'},{en:'Import tax',pt:'Imposto de importação'},{en:'Warehouse',pt:'Depósito, armazém'},
      {en:'Distributor',pt:'Distribuidor'},{en:'Quote',pt:'Cotação'},{en:'To include',pt:'Incluir'},
    ],
    expressions: [
      {expr:"What's the part number?",meaning:'Qual é o código da peça?',example:"What's the part number? — It's A, G, four, four, oh, seven, two."},
      {expr:'Does that include customs?',meaning:'Isso inclui a alfândega?',example:'The total is two hundred and fifteen dollars. Does that include customs?'},
      {expr:'We can ship it on October third',meaning:'Podemos despachar no dia 3 de outubro',example:'It takes ten business days. We can ship it on October third.'},
      {expr:'Just to confirm: two parts, shipping on October third',meaning:'Só para confirmar: duas peças, envio em 3 de outubro',example:'Just to confirm: two parts, two hundred and fifteen dollars.'},
    ],
    sentences: [
      'Hi Mike, this is Yara from GPS Tronic in Brazil.','The part number is A, G, four, four, oh, seven, two.',
      'The unit price is eighty-nine dollars and ninety cents.','The total is two hundred and fifteen dollars with shipping.',
      'Does that include customs?','The delivery takes about ten business days.',
      'We can ship it on October third.','I will reply with the tracking number when it ships.',
    ],
    grammar: {
      title: 'Falando códigos, preços em dólar e datas sem errar',
      rules: [
        'Código de peça se fala letra por letra e dígito por dígito (zero vira "oh"): AG-44072 → "A, G, four, four, oh, seven, two".',
        'Preço em dólar: "eighty-nine dollars and ninety cents" ($89.90). Hundred e thousand nunca levam -s após número ("two hundred dollars").',
        'Atenção à escrita: em inglês a vírgula separa o milhar e o ponto separa os centavos ($1,250.50).',
        'Datas usam números ordinais: October first (Oct 1), October second (Oct 2), October third (Oct 3).',
      ],
      table: {
        headers: ['Tipo','Escrito','Como falar','Regra de ouro'],
        rows: [
          ['Código','AG-44072','A, G, four, four, oh, seven, two','dígito por dígito'],
          ['Preço','$89.90','eighty-nine dollars and ninety cents','dollars and … cents'],
          ['Centenas','$215','two hundred and fifteen dollars','hundred sem -s'],
          ['Data','Oct 3','October third','sempre ordinal'],
        ]
      }
    },
    quiz: [
      {q:'The total is two ___ and fifteen dollars.',a:'hundred',opts:['hundred','hundreds','hundredth','handred']},
      {q:'We can ship the package on October ___.',a:'third',opts:['third','three','threeth','thirdth']},
      {q:'Does that price ___ customs?',a:'include',opts:['include','includes','including','included']},
      {q:'The delivery takes about ten ___ days.',a:'business',opts:['business','workings','commercials','busy']},
      {q:'I will ___ with the tracking number when it ships.',a:'reply',opts:['reply','replies','replied','replying']},
    ],
    speak: [
      'The part number is A, G, four, four, oh, seven, two.','The unit price is eighty-nine dollars and ninety cents.',
      'Does that include customs?','We can ship it on October third.',
      'Just to confirm: two parts, two hundred and fifteen dollars.',
    ],
  },
  {
    id: 517, title: 'Networking at Agrishow', emoji: '🤝',
    verbs: ['To Introduce', 'To Look For', 'To Become', 'To Email'],
    vocab: [
      {en:'Trade show',pt:'Feira de negócios'},{en:'Booth',pt:'Estande'},{en:'Business card',pt:'Cartão de visita'},
      {en:'Brochure',pt:'Folheto, catálogo'},{en:'Dealer',pt:'Revendedor'},{en:'Local dealer',pt:'Revendedor local'},
      {en:'Partner',pt:'Parceiro comercial'},{en:'Demo',pt:'Demonstração'},{en:'Live demo',pt:'Demonstração ao vivo'},
      {en:'Amazing',pt:'Incrível'},{en:'To introduce',pt:'Apresentar'},{en:'Interested in',pt:'Interessado em'},
      {en:'Interesting',pt:'Interessante'},{en:'To look for',pt:'Procurar'},{en:'Exhibitor',pt:'Expositor'},
      {en:'Visitor',pt:'Visitante'},{en:'Sales manager',pt:'Gerente de vendas'},{en:'Repair shop',pt:'Oficina de reparo'},
      {en:'Region',pt:'Região'},{en:'First time',pt:'Primeira vez'},{en:'So far',pt:'Até agora'},
      {en:'To keep in touch',pt:'Manter contato'},{en:'Autosteer system',pt:'Sistema de piloto automático'},{en:'Accuracy',pt:'Precisão'},
      {en:'Technician',pt:'Técnico'},{en:'To install',pt:'Instalar'},{en:'Information',pt:'Informação'},
      {en:'Partnership',pt:'Parceria'},{en:'Supplier',pt:'Fornecedor'},{en:'Manufacturer',pt:'Fabricante'},
    ],
    expressions: [
      {expr:'Let me introduce myself',meaning:'Deixa eu me apresentar',example:"Hi! Let me introduce myself. I'm Yara, from GPS Tronic."},
      {expr:"I'm interested in your new autosteer system",meaning:'Tenho interesse no novo piloto automático de vocês',example:"I'm interested in your new autosteer system. Can you tell me about it?"},
      {expr:"We're looking for a partner here in Brazil",meaning:'Estamos procurando um parceiro aqui no Brasil',example:"We're looking for a partner here in Brazil to become a local dealer."},
      {expr:"Here's my card. Let's keep in touch",meaning:'Aqui está meu cartão. Vamos manter contato',example:"Here's my card. Let's keep in touch by email."},
    ],
    sentences: [
      "Hi! Let me introduce myself. I'm from GPS Tronic.",'Is this your first time in Brazil?',
      "I'm interested in your new autosteer system.",'We are interested in becoming a local dealer.',
      'We are looking for a partner in this region.','Can I see a live demo of the system?',
      'Can I also take a brochure, please?',"Here's my business card. Let's keep in touch.",
    ],
    grammar: {
      title: 'Networking na feira: interested in (+ -ing) e looking for',
      rules: [
        'Depois de interested vem sempre IN: "I\'m interested in your autosteer system." (nunca "on").',
        'Se vier um verbo depois de interested in, ele ganha -ing: "We\'re interested in becoming a dealer."',
        'Não confunda: "I\'m interested" (eu tenho interesse) vs. "That\'s interesting!" (isso é interessante!).',
        'Procurar algo em inglês é look FOR: "We\'re looking for a partner in Brazil."',
      ],
      table: {
        headers: ['Situação','Estrutura','Exemplo','Cuidado'],
        rows: [
          ['Interesse em produto','interested in + coisa',"I'm interested in your system.",'sempre in'],
          ['Interesse em ação','interested in + -ing','Interested in becoming a dealer.','verbo com -ing'],
          ['O que procura','looking for + coisa',"We're looking for a partner.",'não esqueça o for'],
          ['Elogiar o produto',"It's interesting!","That's very interesting!",'a coisa é interesting'],
        ]
      }
    },
    quiz: [
      {q:"I'm interested ___ your new autosteer system.",a:'in',opts:['in','on','for','at']},
      {q:"We're interested in ___ a local dealer in Brazil.",a:'becoming',opts:['becoming','become','to become','becomes']},
      {q:"We're looking ___ a business partner.",a:'for',opts:['for','to','at','in']},
      {q:'Hi! Let me ___ myself.',a:'introduce',opts:['introduce','present','introducing','introduces']},
      {q:"Here's my card. Let's ___ in touch.",a:'keep',opts:['keep','keeping','kept','to keep']},
    ],
    speak: [
      'Let me introduce myself.','Is this your first time in Brazil?',
      "I'm interested in your new autosteer system.","We're looking for a partner here in Brazil.",
      "Here's my card. Let's keep in touch.",
    ],
  },
  {
    id: 518, title: 'Calibration, RTK & Base Station', emoji: '⚙️',
    verbs: ['To Calibrate', 'To Configure', 'To Send', 'To Improve'],
    vocab: [
      {en:'Calibration',pt:'Calibração'},{en:'To calibrate',pt:'Calibrar'},{en:'Recalibration',pt:'Recalibração'},
      {en:'Base station',pt:'Estação base'},{en:'Correction signal',pt:'Sinal de correção (RTK)'},{en:'RTK signal',pt:'Sinal RTK'},
      {en:'Accuracy',pt:'Precisão'},{en:'Centimeter-level',pt:'Nível centimétrico'},{en:'Guidance line',pt:'Linha de referência'},
      {en:'A-B line',pt:'Linha A-B'},{en:'Curve pass',pt:'Passada em curva'},{en:'Straight pass',pt:'Passada reta'},
      {en:'Satellite',pt:'Satélite'},{en:'Receiver',pt:'Receptor'},{en:'Dome antenna',pt:'Antena tipo domo'},
      {en:'Radio modem',pt:'Modem de rádio'},{en:'Frequency',pt:'Frequência'},{en:'Channel',pt:'Canal'},
      {en:'Compass',pt:'Bússola'},{en:'Roll and pitch',pt:'Inclinação lateral e longitudinal'},{en:'Wheel angle sensor',pt:'Sensor de ângulo de roda'},
      {en:'Terrain compensation',pt:'Compensação de terreno'},{en:'Offset',pt:'Deslocamento (offset)'},{en:'Implement width',pt:'Largura do implemento'},
      {en:'To configure',pt:'Configurar'},{en:'To improve',pt:'Melhorar'},{en:'To drop',pt:'Cair (sinal)'},
      {en:'Trees',pt:'Árvores'},{en:'Hill',pt:'Morro, declive'},{en:'Flat field',pt:'Talhão plano'},
    ],
    expressions: [
      {expr:'The signal keeps dropping near the trees',meaning:'O sinal fica caindo perto das árvores',example:'The signal keeps dropping near the trees on the south field.'},
      {expr:'The accuracy is off — it needs recalibration',meaning:'A precisão está fora — precisa recalibrar',example:'The accuracy is off — it needs recalibration before planting.'},
      {expr:'The base station sends correction data',meaning:'A estação base envia dados de correção',example:'The base station sends correction data to the tractor.'},
      {expr:'I have already recalibrated the receiver twice',meaning:'Já recalibrei o receptor duas vezes',example:'I have already recalibrated the receiver twice this morning.'},
    ],
    sentences: [
      'The base station sends correction data to the tractor.','The correction signal improves the GPS accuracy.',
      'This RTK system has centimeter-level accuracy.','The signal keeps dropping near the trees.',
      'The accuracy is off — it needs recalibration.','We calibrated the wheel angle sensor this morning.',
      'I have already checked the radio frequency.','The guidance line is set for the first pass.',
    ],
    grammar: {
      title: 'Present Perfect com already e yet no suporte técnico',
      rules: [
        'Use have/has + already + particípio para dizer o que você JÁ testou: "I have already checked the antenna."',
        'Use haven\'t/hasn\'t + particípio + yet para o que AINDA não foi feito: "We haven\'t calibrated the sensor yet."',
        'Pergunta de diagnóstico do suporte: "Have you checked the cable connection?"',
        'Isso evita que o suporte estrangeiro mande você repetir testes que já fez na bancada.',
      ],
      table: {
        headers: ['Situação','Estrutura','Exemplo','Tradução'],
        rows: [
          ['Já testei','have already + -ed','I have already checked it.','Eu já verifiquei isso.'],
          ['Já recalibrei','have already + -ed','I have recalibrated it twice.','Já recalibrei duas vezes.'],
          ['Ainda não fiz',"haven't + -ed + yet","He hasn't calibrated it yet.",'Ele ainda não calibrou.'],
          ['Pergunta técnica','Have you + -ed?','Have you updated the firmware?','Você atualizou o firmware?'],
        ]
      }
    },
    quiz: [
      {q:'I have ___ checked the antenna cable connection.',a:'already',opts:['already','yet','ever','ago']},
      {q:"He hasn't calibrated the new monitor ___.",a:'yet',opts:['yet','already','still','never']},
      {q:'The base station ___ correction data to the tractor.',a:'sends',opts:['sends','send','sending','sent']},
      {q:'The accuracy is off — it needs ___.',a:'recalibration',opts:['recalibration','recalibrate','calibrated','calibrating']},
      {q:'___ you checked the radio frequency?',a:'Have',opts:['Have','Has','Did','Are']},
    ],
    speak: [
      'The signal keeps dropping near the trees.','The base station sends correction data.',
      'This system has centimeter-level accuracy.','I have already checked the antenna cable.',
      'It needs recalibration before we start.',
    ],
  },
  {
    id: 519, title: 'Wiring Harness, Pins & Voltage', emoji: '🔌',
    verbs: ['To Measure', 'To Solder', 'To Replace', 'To Test'],
    vocab: [
      {en:'Wiring harness',pt:'Chicote elétrico'},{en:'Connector',pt:'Conector'},{en:'Pin',pt:'Pino (do conector)'},
      {en:'Bent pin',pt:'Pino torto'},{en:'Broken wire',pt:'Fio rompido'},{en:'Fuse',pt:'Fusível'},
      {en:'Blown fuse',pt:'Fusível queimado'},{en:'Voltage',pt:'Tensão, voltagem'},{en:'Twelve volts',pt:'Doze volts'},
      {en:'Power supply',pt:'Fonte de alimentação'},{en:'Battery',pt:'Bateria'},{en:'Multimeter',pt:'Multímetro'},
      {en:'Circuit board',pt:'Placa de circuito'},{en:'Motherboard',pt:'Placa-mãe'},{en:'To solder',pt:'Soldar'},
      {en:'Soldering iron',pt:'Ferro de solda'},{en:'Short circuit',pt:'Curto-circuito'},{en:'Moisture',pt:'Umidade'},
      {en:'Oxidation',pt:'Oxidação, zinabre'},{en:'Rodents',pt:'Roedores (ratos)'},{en:'Contact cleaner',pt:'Limpa-contato'},
      {en:'Workbench',pt:'Bancada de trabalho'},{en:'To measure',pt:'Medir'},{en:'To isolate',pt:'Isolar'},
      {en:'Electrical tape',pt:'Fita isolante'},{en:'Relay',pt:'Relé'},{en:'Ground wire',pt:'Fio terra'},
      {en:'Loose connection',pt:'Mau contato / conexão frouxa'},{en:'Power cable',pt:'Cabo de força'},{en:'Bench test',pt:'Teste de bancada'},
    ],
    expressions: [
      {expr:'Check the fuse before replacing the unit',meaning:'Verifique o fusível antes de trocar o módulo',example:'Always check the fuse before replacing the whole unit.'},
      {expr:'The wiring harness was damaged by rodents',meaning:'O chicote foi danificado por roedores',example:'We found the issue: the wiring harness was damaged by rodents.'},
      {expr:'There is oxidation inside the connector',meaning:'Tem oxidação dentro do conector',example:'There is moisture and oxidation inside the main connector.'},
      {expr:'I measured twelve volts at the power cable',meaning:'Medi doze volts no cabo de alimentação',example:'I measured twelve volts at the power cable with the multimeter.'},
    ],
    sentences: [
      'Check the fuse before replacing the whole unit.','The wiring harness was damaged by rodents.',
      'There is a bent pin inside the connector.','I measured twelve volts with the multimeter.',
      'The fuse was blown because of a short circuit.','We cleaned the oxidation with contact cleaner.',
      'I soldered the broken wire on the workbench.','The receiver passed the bench test.',
    ],
    grammar: {
      title: 'Causa e consequência na bancada: because / because of / so',
      rules: [
        'Use because + frase completa (sujeito + verbo): "The monitor turned off because the cable was loose."',
        'Use because of + substantivo: "The fuse burned because of a short circuit." / "because of moisture."',
        'Use so para mostrar o resultado (então / por isso): "The pin was bent, so we replaced the connector."',
        'Voz passiva curta para dano: "was damaged by water" / "was damaged by rodents".',
      ],
      table: {
        headers: ['Conector','O que vem depois','Exemplo','Tradução'],
        rows: [
          ['because','sujeito + verbo','It failed because the wire broke.','Falhou porque o fio rompeu.'],
          ['because of','substantivo','It failed because of moisture.','Falhou por causa de umidade.'],
          ['so','resultado / ação','It was loose, so I tightened it.','Estava solto, então apertei.'],
          ['was damaged by','causador do dano','Damaged by rodents.','Danificado por roedores.'],
        ]
      }
    },
    quiz: [
      {q:'The fuse burned ___ a short circuit.',a:'because of',opts:['because of','because','so','by']},
      {q:'The connection was loose, ___ we tightened it.',a:'so',opts:['so','because','because of','for']},
      {q:'The wiring harness was damaged ___ rodents.',a:'by',opts:['by','for','to','of']},
      {q:'Check the ___ before replacing the whole unit.',a:'fuse',opts:['fuse','rodent','solder','tape']},
      {q:'I ___ twelve volts at the power cable.',a:'measured',opts:['measured','measure','measuring','measures']},
    ],
    speak: [
      'Check the fuse before replacing the unit.','The wiring harness was damaged by rodents.',
      'There is a bent pin inside the connector.','I measured twelve volts with the multimeter.',
      'The connection was loose, so we tightened it.',
    ],
  },
  {
    id: 520, title: 'Firmware Updates & Error Codes', emoji: '💾',
    verbs: ['To Update', 'To Install', 'To Download', 'To Reboot'],
    vocab: [
      {en:'Firmware update',pt:'Atualização de firmware'},{en:'Latest version',pt:'Versão mais recente'},{en:'Software',pt:'Software, programa'},
      {en:'USB drive',pt:'Pen drive'},{en:'File',pt:'Arquivo'},{en:'Folder',pt:'Pasta'},
      {en:'Error code',pt:'Código de erro'},{en:'Diagnostic test',pt:'Teste de diagnóstico'},{en:'Touch screen',pt:'Tela touch'},
      {en:'Frozen screen',pt:'Tela travada'},{en:'Backup',pt:'Cópia de segurança (backup)'},{en:'Settings',pt:'Configurações'},
      {en:'Factory reset',pt:'Restauração de fábrica'},{en:'To update',pt:'Atualizar'},{en:'To install',pt:'Instalar'},
      {en:'To download',pt:'Baixar'},{en:'To reboot',pt:'Reiniciar o sistema'},{en:'To save',pt:'Salvar'},
      {en:'To delete',pt:'Apagar'},{en:'Memory',pt:'Memória'},{en:'Full memory',pt:'Memória cheia'},
      {en:'Loading bar',pt:'Barra de carregamento'},{en:'Warning message',pt:'Mensagem de alerta'},{en:'Compatibility',pt:'Compatibilidade'},
      {en:'Unlock code',pt:'Código de desbloqueio'},{en:'License',pt:'Licença'},{en:'Subscription',pt:'Assinatura (sinal)'},
      {en:'Bug',pt:'Falha de software'},{en:'Patch',pt:'Correção de sistema'},{en:'Progress',pt:'Progresso'},
    ],
    expressions: [
      {expr:'You should update the firmware to the latest version',meaning:'Você deve atualizar o firmware para a versão mais recente',example:'You should update the firmware to the latest version — that usually fixes this.'},
      {expr:'Let me run a diagnostic test first',meaning:'Deixa eu rodar um teste de diagnóstico primeiro',example:'I am not sure yet. Let me run a diagnostic test first.'},
      {expr:'Do not remove the USB drive during the update',meaning:'Não remova o pen drive durante a atualização',example:'Wait five minutes. Do not remove the USB drive during the update.'},
      {expr:'We saved a backup of your field settings',meaning:'Salvamos um backup das suas configurações de talhão',example:'Before the reset, we saved a backup of your field settings.'},
    ],
    sentences: [
      'The display shows an error code on startup.','Let me run a diagnostic test first.',
      'You should update the firmware to the latest version.','Insert the USB drive into the monitor.',
      'Do not turn off the screen during the update.','We saved a backup of your settings.',
      'A firmware update fixed the connection issue.','Now reboot the system and check the signal.',
    ],
    grammar: {
      title: 'Dando recomendação técnica: You should / You shouldn\'t',
      rules: [
        'Use should + verbo base para recomendar o procedimento técnico correto: "You should update the firmware."',
        'Use shouldn\'t + verbo base para avisar o que não é recomendável: "You shouldn\'t unplug the USB drive now."',
        'Para pedir conselho ao suporte do fabricante: "Should I run a factory reset?"',
        'Depois de should, o verbo vai sempre na forma pura (sem "to" e sem "-s").',
      ],
      table: {
        headers: ['Estrutura','Uso','Exemplo','Tradução'],
        rows: [
          ['You should + verbo','recomendar solução','You should update the firmware.','Você deve atualizar o firmware.'],
          ['You should save','prevenção','You should save a backup first.','Você deve salvar um backup antes.'],
          ["You shouldn't + verbo",'evitar erro',"You shouldn't turn it off now.",'Você não deve desligar agora.'],
          ['Should I + verbo?','perguntar ao suporte','Should I reset the display?','Devo resetar o monitor?'],
        ]
      }
    },
    quiz: [
      {q:'You ___ update the firmware to the latest version.',a:'should',opts:['should','should to','shoulds','are should']},
      {q:'Let me ___ a diagnostic test first.',a:'run',opts:['run','runs','running','ran']},
      {q:'Do not remove the USB drive ___ the update.',a:'during',opts:['during','while','for','since']},
      {q:'A firmware update ___ the connection issue yesterday.',a:'fixed',opts:['fixed','fix','fixes','fixing']},
      {q:'Should I ___ a backup of the settings first?',a:'save',opts:['save','saves','saving','to save']},
    ],
    speak: [
      'Let me run a diagnostic test first.','You should update the firmware to the latest version.',
      'Do not remove the USB drive during the update.','We saved a backup of your settings.',
      'A firmware update fixed the connection issue.',
    ],
  },
  {
    id: 521, title: 'Planters, Sprayers & Section Control', emoji: '🌱',
    verbs: ['To Plant', 'To Spray', 'To Map', 'To Control'],
    vocab: [
      {en:'Planter',pt:'Plantadeira'},{en:'Sprayer',pt:'Pulverizador'},{en:'Harvester',pt:'Colheitadeira'},
      {en:'Section control',pt:'Controle de seção'},{en:'Rate controller',pt:'Controlador de vazão / taxa'},{en:'Variable rate',pt:'Taxa variável'},
      {en:'Nozzle',pt:'Bico de pulverização'},{en:'Boom',pt:'Barra do pulverizador'},{en:'Seed sensor',pt:'Sensor de semente'},
      {en:'Flow meter',pt:'Fluxômetro (medidor de vazão)'},{en:'Control valve',pt:'Válvula de controle'},{en:'Pressure sensor',pt:'Sensor de pressão'},
      {en:'Coverage map',pt:'Mapa de cobertura'},{en:'Boundary',pt:'Bordadura, limite do talhão'},{en:'Overlap',pt:'Sobreposição (repasse)'},
      {en:'Row',pt:'Linha de plantio'},{en:'Row clutch',pt:'Embreagem de linha'},{en:'Seed population',pt:'População de sementes'},
      {en:'Speed sensor',pt:'Sensor de velocidade'},{en:'Target rate',pt:'Taxa alvo'},{en:'Hectare',pt:'Hectare'},
      {en:'Input',pt:'Insumo agrícola'},{en:'Fertilizer',pt:'Fertilizante, adubo'},{en:'To spray',pt:'Pulverizar'},
      {en:'To plant',pt:'Plantar'},{en:'To map',pt:'Mapear'},{en:'To avoid',pt:'Evitar'},
      {en:'To save',pt:'Economizar'},{en:'ISOBUS cable',pt:'Cabo ISOBUS'},{en:'Implement',pt:'Implemento'},
    ],
    expressions: [
      {expr:'The planter is connected to the same GPS system',meaning:'A plantadeira está conectada ao mesmo sistema de GPS',example:'The planter is connected to the same GPS system via ISOBUS.'},
      {expr:'Section control avoids overlap in the field',meaning:'O controle de seção evita sobreposição na lavoura',example:'Section control avoids overlap and saves seeds and chemicals.'},
      {expr:'We mapped the field boundary yesterday',meaning:'Mapeamos a bordadura do talhão ontem',example:'We mapped the field boundary yesterday before starting.'},
      {expr:'One seed sensor on row four is not reading',meaning:'Um sensor de semente na linha quatro não está lendo',example:'The monitor shows an alert: one seed sensor on row four is not reading.'},
    ],
    sentences: [
      'The planter is connected to the GPS via ISOBUS.','Section control avoids overlap in the field.',
      'We mapped the whole field boundary yesterday.','The sprayer has a clogged nozzle on the left boom.',
      'One seed sensor on row four is not reading.','We checked the flow meter and the pressure sensor.',
      'Variable rate technology saves fertilizer and seeds.','The coverage map looks clean on the display.',
    ],
    grammar: {
      title: 'Conectando oficina e lavoura: Expressando finalidade com TO + verbo',
      rules: [
        'Use to + verbo base para explicar PARA QUE serve um equipamento: "Farmers use section control to avoid overlap."',
        'Mais exemplos: "We use the flow meter to measure the liquid." / "He called to ask about the planter."',
        'Nunca use "for + verbo base" (errado: "for avoid overlap" → certo: "to avoid overlap").',
        'Esse vocabulário conecta diretamente o curso Agro English com o suporte avançado da GPS Tronic.',
      ],
      table: {
        headers: ['Equipamento','Finalidade (to + verbo)','Exemplo completo','Tradução'],
        rows: [
          ['Section control','to avoid overlap','It shuts off rows to avoid overlap.','Desliga linhas para evitar repasse.'],
          ['Seed sensor','to count the seeds','We use sensors to count the seeds.','Usamos sensores para contar sementes.'],
          ['Base station','to improve accuracy','It sends data to improve accuracy.','Envia dados para melhorar a precisão.'],
          ['ISOBUS cable','to connect the planter','Use this cable to connect the planter.','Use este cabo para conectar a plantadeira.'],
        ]
      }
    },
    quiz: [
      {q:'Farmers use section control ___ avoid overlap.',a:'to',opts:['to','for','by','of']},
      {q:'The planter is ___ to the same GPS system.',a:'connected',opts:['connected','connect','connecting','connects']},
      {q:'We ___ the whole field boundary yesterday.',a:'mapped',opts:['mapped','map','mapping','maps']},
      {q:'One seed ___ on row four is dirty.',a:'sensor',opts:['sensor','boom','hectare','overlap']},
      {q:'The sprayer has a clogged ___ on the boom.',a:'nozzle',opts:['nozzle','seed','row','boundary']},
    ],
    speak: [
      'The planter is connected to the same GPS system.','Section control avoids overlap in the field.',
      'We mapped the whole field yesterday.','One seed sensor on row four is not reading.',
      'We checked the flow meter and the control valve.',
    ],
  },
  {
    id: 522, title: 'Warranty Claims & Technical Reports', emoji: '🛡️',
    verbs: ['To Report', 'To Replace', 'To Approve', 'To Ship'],
    vocab: [
      {en:'Warranty claim',pt:'Solicitação de garantia'},{en:'Under warranty',pt:'Na garantia'},{en:'Out of warranty',pt:'Fora da garantia'},
      {en:'Technical report',pt:'Laudo / relatório técnico'},{en:'Replacement unit',pt:'Unidade de substituição'},{en:'Replacement antenna',pt:'Antena de reposição'},
      {en:'Factory defect',pt:'Defeito de fábrica'},{en:'Water damage',pt:'Dano por água'},{en:'Power surge',pt:'Pico de energia'},
      {en:'Serial number',pt:'Número de série'},{en:'Invoice date',pt:'Data da nota fiscal'},{en:'Error log',pt:'Registro de erros (log)'},
      {en:'Support ticket',pt:'Chamado de suporte'},{en:'Manufacturer',pt:'Fabricante'},{en:'Technical support',pt:'Suporte técnico'},
      {en:'To report',pt:'Relatar, reportar'},{en:'To approve',pt:'Aprovar'},{en:'To cover',pt:'Cobrir'},
      {en:'To fail',pt:'Falhar'},{en:'To continue',pt:'Continuar'},{en:'Issue',pt:'Problema, falha'},
      {en:'Proof of purchase',pt:'Comprovante de compra'},{en:'Return label',pt:'Etiqueta de devolução'},{en:'Defective part',pt:'Peça defeituosa'},
      {en:'Inspection',pt:'Inspeção'},{en:'Sealed',pt:'Lacrado'},{en:'Warranty seal',pt:'Lacre de garantia'},
      {en:'Three-month warranty',pt:'Garantia de três meses'},{en:'Free of charge',pt:'Sem custo'},{en:'Case number',pt:'Número do protocolo'},
    ],
    expressions: [
      {expr:'The customer reported an error code this morning',meaning:'O cliente relatou um código de erro hoje de manhã',example:'The customer reported an error code on the display this morning.'},
      {expr:'Is this unit still under warranty?',meaning:'Esta unidade ainda está na garantia?',example:'Here is the serial number. Is this unit still under warranty?'},
      {expr:'If the problem continues, can I call you back?',meaning:'Se o problema continuar, posso te ligar de volta?',example:'Got it. If the problem continues after the update, can I call you back?'},
      {expr:'If it still fails, we will send a replacement',meaning:'Se ainda falhar, enviaremos uma reposição',example:'If it still fails, we will send you a replacement antenna.'},
    ],
    sentences: [
      'The customer reported an error code on the display.','This receiver is still under warranty.',
      'We attached the error log and the photos to the report.','The warranty covers factory defects for one year.',
      'Water damage is not covered by the warranty.','If the problem continues, we will replace the board.',
      'If it still fails, they will ship a replacement unit.','The manufacturer approved the warranty claim today.',
    ],
    grammar: {
      title: 'First Conditional: combinando planos de contingência (If… + will)',
      rules: [
        'Use If + Presente Simples na condição, e will + verbo base no resultado.',
        'Exemplo clássico da Aula 1: "If it still fails, we will send you a replacement antenna."',
        'Também pode usar can no resultado: "If the problem continues, can I call you back?"',
        'Atenção: depois do IF, use o presente ("If it fails"), nunca "If it will fail".',
      ],
      table: {
        headers: ['Condição (If + presente)','Resultado (will / can)','Tradução','Uso'],
        rows: [
          ['If it still fails,','we will send a replacement.','Se ainda falhar, enviaremos outra.','garantia com fornecedor'],
          ['If the problem continues,','can I call you back?','Se continuar, posso retornar?','suporte técnico'],
          ['If you have any problems,','call me right away.','Se tiver qualquer problema, me ligue.','pós-venda ao cliente'],
          ['If it is under warranty,','there is no charge.','Se estiver na garantia, não há custo.','balcão da oficina'],
        ]
      }
    },
    quiz: [
      {q:'If it still ___, we will send you a replacement antenna.',a:'fails',opts:['fails','will fail','fail','failed']},
      {q:'If the problem continues, ___ I call you back?',a:'can',opts:['can','do','am','did']},
      {q:'Is this receiver still ___ warranty?',a:'under',opts:['under','in','on','with']},
      {q:'The customer ___ an error code this morning.',a:'reported',opts:['reported','report','reports','reporting']},
      {q:'The manufacturer ___ the warranty claim today.',a:'approved',opts:['approved','approve','approving','approves']},
    ],
    speak: [
      'The customer reported an error code this morning.','Is this unit still under warranty?',
      'If the problem continues, can I call you back?','If it still fails, we will send a replacement.',
      'Call me if you have any problems.',
    ],
  },
  {
    id: 523, title: 'Field Service & Pre-Harvest Checklist', emoji: '🛻',
    verbs: ['To Inspect', 'To Adjust', 'To Train', 'To Prepare'],
    vocab: [
      {en:'Field service',pt:'Assistência técnica em campo'},{en:'Checklist',pt:'Lista de verificação (checklist)'},{en:'Pre-harvest',pt:'Pré-colheita'},
      {en:'Pre-planting',pt:'Pré-plantio'},{en:'Service truck',pt:'Caminhonete da assistência'},{en:'Toolbox',pt:'Caixa de ferramentas'},
      {en:'Antenna bracket',pt:'Suporte da antena'},{en:'Tractor roof',pt:'Teto do trator'},{en:'Cab',pt:'Cabine'},
      {en:'Steering valve',pt:'Válvula de direção'},{en:'Hydraulic hose',pt:'Mangueira hidráulica'},{en:'Electric motor',pt:'Motor elétrico (volante)'},
      {en:'Steering wheel',pt:'Volante'},{en:'Operator',pt:'Operador de máquina'},{en:'Farm manager',pt:'Gerente da fazenda'},
      {en:'Test drive',pt:'Teste de rodagem'},{en:'Straight line',pt:'Linha reta'},{en:'Headland turn',pt:'Manobra de cabeceira'},
      {en:'Signal strength',pt:'Força do sinal'},{en:'Satellites locked',pt:'Satélites conectados'},{en:'To inspect',pt:'Inspecionar'},
      {en:'To adjust',pt:'Ajustar'},{en:'To train',pt:'Treinar'},{en:'To prepare',pt:'Preparar'},
      {en:'Ready for harvest',pt:'Pronto para a colheita'},{en:'All set',pt:'Tudo pronto / configurado'},{en:'Smoothly',pt:'Suavemente, sem falhas'},
      {en:'On line',pt:'Na linha (alinhado)'},{en:'Safety',pt:'Segurança'},{en:'Service report',pt:'Ordem / relatório de visita'},
    ],
    expressions: [
      {expr:'The autosteer keeps the tractor perfectly on line',meaning:'O piloto automático mantém o trator perfeitamente na linha',example:'We tested it: the autosteer keeps the tractor perfectly on line.'},
      {expr:"Let's do a test drive in the field",meaning:'Vamos fazer um teste na lavoura',example:"The installation is finished. Let's do a test drive in the field."},
      {expr:'I trained the operator on the new display',meaning:'Treinei o operador no monitor novo',example:'I trained the operator on the new display for thirty minutes.'},
      {expr:'Everything is all set for the harvest',meaning:'Está tudo pronto para a colheita',example:'We finished the checklist. Everything is all set for the harvest!'},
    ],
    sentences: [
      'We arrived at the farm early for the pre-harvest check.','First, we inspected the antenna bracket on the roof.',
      'Then we checked the steering valve and the cables.','We calibrated the autosteer in a flat field.',
      'The autosteer keeps the tractor perfectly on line.','I trained the operator on how to set the A-B line.',
      'The customer signed the service report.','Everything is all set for the harvest season.',
    ],
    grammar: {
      title: 'Let\'s + verbo e How to + verbo: conduzindo o teste com o operador',
      rules: [
        'Use "Let\'s + verbo base" para convidar o cliente ou operador a testar junto: "Let\'s turn it on together." / "Let\'s do a test drive."',
        'Use "how to + verbo base" para ensinar procedimentos no monitor: "I showed him how to set the A-B line."',
        'Mais exemplos práticos: "how to save the boundary" (como salvar a bordadura), "how to load the map" (como carregar o mapa).',
        'Feche a visita com "Everything is all set!" (Está tudo pronto/configurado!).',
      ],
      table: {
        headers: ['Estrutura','Uso no campo','Exemplo','Tradução'],
        rows: [
          ["Let's + verbo",'convidar para testar',"Let's turn it on together.",'Vamos ligar juntos.'],
          ["Let's do a test",'rodar na lavoura',"Let's do a test drive.",'Vamos fazer um teste de campo.'],
          ['how to + verbo','treinar o operador','How to set the A-B line.','Como criar a linha A-B.'],
          ['All set!','fechar a visita','Everything is all set!','Está tudo pronto!'],
        ]
      }
    },
    quiz: [
      {q:"Let's ___ it on together and check the map.",a:'turn',opts:['turn','turns','turning','to turn']},
      {q:'I showed the operator how ___ set the A-B line.',a:'to',opts:['to','for','in','at']},
      {q:'The autosteer keeps the tractor perfectly ___ line.',a:'on',opts:['on','in','at','by']},
      {q:'We ___ the antenna bracket on the tractor roof.',a:'inspected',opts:['inspected','inspecting','inspects','to inspect']},
      {q:'Everything is all ___ for the harvest season!',a:'set',opts:['set','sets','setting','sit']},
    ],
    speak: [
      "Let's turn it on together.","Let's do a test drive in the field.",
      'The autosteer keeps the tractor perfectly on line.','I showed the operator how to set the A-B line.',
      'Everything is all set for the harvest.',
    ],
  },
  {
    id: 524, title: 'GPS Tronic Master Review', emoji: '🏆',
    verbs: ['To Troubleshoot', 'To Negotiate', 'To Deliver', 'To Partner'],
    vocab: [
      {en:'Precision agriculture',pt:'Agricultura de precisão'},{en:'Troubleshooting',pt:'Solução de problemas'},{en:'Autosteer',pt:'Piloto automático'},
      {en:'GPS receiver',pt:'Receptor de GPS'},{en:'Wiring harness',pt:'Chicote elétrico'},{en:'Firmware update',pt:'Atualização de firmware'},
      {en:'Calibration',pt:'Calibração'},{en:'Accuracy',pt:'Precisão'},{en:'Serial number',pt:'Número de série'},
      {en:'Part number',pt:'Código da peça'},{en:'Unit price',pt:'Preço unitário'},{en:'Customs',pt:'Alfândega'},
      {en:'Tracking number',pt:'Código de rastreio'},{en:'Business day',pt:'Dia útil'},{en:'Warranty',pt:'Garantia'},
      {en:'Estimate',pt:'Estimativa, orçamento'},{en:'Labour',pt:'Mão de obra'},{en:'Appointment',pt:'Agendamento'},
      {en:'Behind schedule',pt:'Atrasado no prazo'},{en:'Patience',pt:'Paciência'},{en:'As good as new',pt:'Novo em folha'},
      {en:'Trade show',pt:'Feira de negócios'},{en:'Booth',pt:'Estande'},{en:'Local dealer',pt:'Revendedor local'},
      {en:'Business partner',pt:'Parceiro de negócios'},{en:'Live demo',pt:'Demonstração ao vivo'},{en:'Business card',pt:'Cartão de visita'},
      {en:'To keep in touch',pt:'Manter contato'},{en:'Reliable',pt:'Confiável'},{en:'Customer service',pt:'Atendimento ao cliente'},
    ],
    expressions: [
      {expr:'Good morning, GPS Tronic, how can I help you?',meaning:'Bom dia, GPS Tronic, como posso ajudar?',example:'Good morning, GPS Tronic, how can I help you today?'},
      {expr:"We've replaced the cable and tested everything",meaning:'Trocamos o cabo e testamos tudo',example:"Your display is ready. We've replaced the cable and tested everything."},
      {expr:'Just to confirm: two parts, shipping on October third',meaning:'Só para confirmar: duas peças, envio em 3 de outubro',example:'Just to confirm: two parts, two hundred and fifteen dollars, shipping on October third.'},
      {expr:"We're looking for a partner here in Brazil",meaning:'Estamos procurando um parceiro aqui no Brasil',example:"We're interested in your autosteer. We're looking for a partner here in Brazil."},
    ],
    sentences: [
      'Good morning, GPS Tronic, how can I help you?','First, turn off the monitor and wait ten seconds.',
      'I can be there on Tuesday at nine in the morning.',"I'm really sorry about the delay.",
      'The display keeps turning off, so we ran a diagnostic test.',"We've replaced the cable and installed a firmware update.",
      'The part number is A, G, four, four, oh, seven, two.',"We're interested in becoming a local dealer in Brazil.",
    ],
    grammar: {
      title: 'Revisão Geral A2 → B1: Do balcão da oficina à Agrishow',
      rules: [
        'Atendimento e Suporte (Aulas 1–9): Presente ("It keeps turning off"), Imperativo ("First, turn off… Don\'t pull…") e Agendamento ("on Tuesday at nine").',
        'Oficina e Entrega (Aulas 3, 11, 12): Passado ("The cable was loose") + Present Perfect para o resultado pronto ("We\'ve replaced it and tested everything").',
        'Prazos e Fornecedores (Aulas 4, 7, 10, 13): Comparativos ("cheaper / more reliable"), "I\'m afraid…" e números/datas ("two hundred dollars, on October third").',
        'Feiras e Parcerias (Aula 14): "I\'m interested in becoming a dealer" + "We\'re looking for a partner" + "Let\'s keep in touch."',
      ],
      table: {
        headers: ['Cenário','Frase-chave','Foco gramatical','Aula'],
        rows: [
          ['Suporte remoto','Hold it for three seconds.','Imperativo + for','Aula 9'],
          ['Imprevisto',"I'm sorry about the delay.",'Empatia + solução','Aula 10'],
          ['Entrega pronta',"We've tested everything.",'Present Perfect','Aula 12'],
          ['Agrishow',"We're looking for a partner.",'look for / interested in','Aula 14'],
        ]
      }
    },
    quiz: [
      {q:"We've ___ the cable and tested the GPS receiver.",a:'replaced',opts:['replaced','replace','replacing','replaces']},
      {q:'I can visit the farm ___ Tuesday ___ nine o\'clock.',a:'on / at',opts:['on / at','at / on','in / at','on / in']},
      {q:'The original part is ___ expensive, but ___ reliable.',a:'more / more',opts:['more / more','most / more','more / most','er / er']},
      {q:"We're interested in ___ a local dealer in Brazil.",a:'becoming',opts:['becoming','become','to become','becomes']},
      {q:'If the problem ___ after the update, call me back.',a:'continues',opts:['continues','will continue','continued','continuing']},
    ],
    speak: [
      'Good morning, GPS Tronic, how can I help you?','First, turn off the monitor and wait ten seconds.',
      "We've replaced the cable and tested everything.",'Just to confirm: two parts, shipping on October third.',
      "We're looking for a partner here in Brazil.",
    ],
  },
];

window.LESSONS_GPS = LESSONS_GPS;


