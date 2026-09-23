// ── Trilha de Prática Diária GPS Tronic ─────────────────────────────────────
// 8 lições (ids 501-508) espelhando as aulas do curso exclusivo GPS Tronic
// (gpstronic_aula_01..05) para prática diária. Nível A2 "falso iniciante",
// foco em conversação — ver skill capy-gpstronic-lesson.
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
];

window.LESSONS_GPS = LESSONS_GPS;
