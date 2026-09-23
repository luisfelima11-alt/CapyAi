// Capy Yara Adventures — Turkish A1 course and Daily Trail.
// The runner uses `en` for the target-language text and `pt` for Portuguese.
const LESSONS_TR = [
  {
    id: 301, title: 'Merhaba!', emoji: '👋', lang: 'tr', course: 'turkish',
    verbs: ['selamlamak', 'tanışmak', 'sormak', 'teşekkür etmek'],
    vocab: [{en:'Merhaba',pt:'Olá'},{en:'Günaydın',pt:'Bom dia'},{en:'İyi akşamlar',pt:'Boa noite (ao chegar)'},{en:'Hoşça kal',pt:'Tchau (dito por quem fica)'},{en:'Güle güle',pt:'Tchau (dito por quem vai)'},{en:'Teşekkürler',pt:'Obrigado(a)'},{en:'Lütfen',pt:'Por favor'},{en:'Evet / Hayır',pt:'Sim / Não'}],
    expressions: [{expr:'Nasılsın?',meaning:'Como você está? (informal)',example:'Merhaba, nasılsın?'},{expr:'İyiyim, teşekkürler.',meaning:'Estou bem, obrigado(a).',example:'İyiyim, teşekkürler. Ya sen?'},{expr:'Memnun oldum.',meaning:'Prazer em conhecer.',example:'Ben Ana. Memnun oldum.'}],
    sentences: ['Merhaba, nasılsın?','İyiyim, teşekkürler.','Günaydın, ben Carlos.','İyi akşamlar, hoş geldiniz.','Lütfen, bir kahve.','Hoşça kal, görüşürüz.'],
    grammar: {title:'Saudações e o pronome “sen”',rules:['<b>Sen</b> significa “você” informal; <b>siz</b> é formal ou plural.','O turco normalmente omite o pronome quando a terminação já indica a pessoa.','<b>Ya sen?</b> significa “E você?”.'],table:{headers:['Turco','Uso','Português'],rows:[['Nasılsın?','informal','Como você está?'],['Nasılsınız?','formal/plural','Como você está/estão?'],['İyiyim','resposta','Estou bem']]}},
    quiz: [{q:"Como se diz 'Olá'?",a:'Merhaba',opts:['Güle güle','Merhaba','Lütfen','Hayır']},{q:"Qual expressão significa 'Obrigado(a)'?",a:'Teşekkürler',opts:['Teşekkürler','Günaydın','Evet','Hoşça kal']},{q:"Como perguntar 'Como você está?' informalmente?",a:'Nasılsın?',opts:['Nasılsınız?','Nasılsın?','Kimsin?','Neredesin?']},{q:"Quem vai embora ouve:",a:'Güle güle',opts:['Hoşça kal','Güle güle','Günaydın','Memnun oldum']}],
    speak: ['Merhaba, nasılsın?','İyiyim, teşekkürler.','Ben Luis. Memnun oldum.','Hoşça kal, görüşürüz.']
  },
  {
    id: 302, title: 'Türk Alfabesi', emoji: '🔤', lang: 'tr', course: 'turkish',
    verbs: ['okumak', 'yazmak', 'dinlemek', 'söylemek'],
    vocab: [{en:'ç',pt:'som de tch'},{en:'ş',pt:'som de ch'},{en:'c',pt:'som de dj'},{en:'ğ',pt:'prolonga a vogal anterior'},{en:'ı',pt:'vogal sem ponto, som fechado'},{en:'ö / ü',pt:'vogais arredondadas'}],
    expressions: [{expr:'Nasıl yazılır?',meaning:'Como se escreve?',example:'İstanbul nasıl yazılır?'},{expr:'Tekrar eder misiniz?',meaning:'Pode repetir?',example:'Lütfen, tekrar eder misiniz?'},{expr:'Yavaş konuşun.',meaning:'Fale devagar.',example:'Lütfen, yavaş konuşun.'}],
    sentences: ['Türkçede yirmi dokuz harf var.','Çay kelimesi ç ile başlar.','Şeker kelimesinde ş var.','İstanbul büyük İ ile başlar.','Işık kelimesi noktasız ı ile yazılır.','G harfi ve ğ harfi farklıdır.'],
    grammar: {title:'As letras especiais do turco',rules:['O alfabeto turco tem 29 letras e não usa q, w ou x.','<b>i/İ</b> têm ponto; <b>ı/I</b> não têm ponto e formam outro par.','<b>ğ</b> geralmente alonga ou conecta vogais; não tem o som do g português.'],table:{headers:['Letra','Som aproximado','Exemplo'],rows:[['ç','tch','çay'],['ş','ch','şeker'],['c','dj','cam'],['ğ','alongamento','dağ']]}},
    quiz: [{q:'Qual letra tem som de “tch”?',a:'ç',opts:['c','ç','ş','ğ']},{q:'Qual letra tem som de “ch”?',a:'ş',opts:['s','c','ş','j']},{q:'Qual palavra usa o i sem ponto?',a:'ışık',opts:['işik','ışık','isik','işık']},{q:'Quantas letras há no alfabeto turco?',a:'29',opts:['26','27','29','31']}],
    speak: ['çay','şeker','İstanbul','dağ','ışık']
  },
  {
    id: 303, title: 'Ben Kimim?', emoji: '🙋', lang: 'tr', course: 'turkish',
    verbs: ['olmak', 'yaşamak', 'çalışmak', 'konuşmak'],
    vocab: [{en:'Ben',pt:'Eu'},{en:'Sen',pt:'Você'},{en:'O',pt:'Ele / Ela'},{en:'Biz',pt:'Nós'},{en:'Siz',pt:'Vocês / você formal'},{en:'Onlar',pt:'Eles / Elas'},{en:'Brezilyalı',pt:'Brasileiro(a)'},{en:'Türk',pt:'Turco(a)'}],
    expressions: [{expr:'Ben Brezilyalıyım.',meaning:'Eu sou brasileiro(a).',example:'Ben Brezilyalıyım, São Paulo’danım.'},{expr:'Adın ne?',meaning:'Qual é o seu nome?',example:'Merhaba! Adın ne?'},{expr:'Nerelisin?',meaning:'De onde você é?',example:'Nerelisin? — Brezilyalıyım.'}],
    sentences: ['Ben öğrenciyim.','Sen öğretmensin.','O Türk.','Biz Brezilyalıyız.','Siz İstanbul’dasınız.','Onlar arkadaş.'],
    grammar: {title:'“Ser” sem um verbo separado',rules:['No presente, o turco liga a pessoa ao nome ou adjetivo com uma terminação.','Ben estudante: <b>öğrenciyim</b>; você estudante: <b>öğrencisin</b>.','Na terceira pessoa singular, normalmente não há terminação: <b>O öğrenci</b>.'],table:{headers:['Pessoa','Terminação','Exemplo'],rows:[['Ben','-(y)im','öğrenciyim'],['Sen','-sin','öğrencisin'],['O','—','öğrenci'],['Biz','-(y)iz','öğrenciyiz']]}},
    quiz: [{q:"Como se diz 'Eu sou brasileiro(a)'?",a:'Ben Brezilyalıyım.',opts:['Ben Brezilyalıyım.','Sen Brezilyalısın.','O Brezilyalı.','Biz Brezilyalıyız.']},{q:"O pronome 'o' significa:",a:'Ele / Ela',opts:['Eu','Você','Ele / Ela','Nós']},{q:'Complete: Sen öğretmen___.',a:'sin',opts:['im','sin','iz','ler']},{q:"Como perguntar 'De onde você é?'",a:'Nerelisin?',opts:['Nasılsın?','Nerelisin?','Adın ne?','Kaç yaşındasın?']}],
    speak: ['Ben Brezilyalıyım.','Ben öğrenciyim.','Adım Marina.','Nerelisin?']
  },
  {
    id: 304, title: 'Sayılar', emoji: '🔢', lang: 'tr', course: 'turkish',
    verbs: ['saymak', 'toplamak', 'çıkarmak', 'ödemek'],
    vocab: [{en:'bir',pt:'um'},{en:'iki',pt:'dois'},{en:'üç',pt:'três'},{en:'dört',pt:'quatro'},{en:'beş',pt:'cinco'},{en:'altı',pt:'seis'},{en:'yedi',pt:'sete'},{en:'on',pt:'dez'}],
    expressions: [{expr:'Kaç yaşındasın?',meaning:'Quantos anos você tem?',example:'Kaç yaşındasın? — Otuz yaşındayım.'},{expr:'Ne kadar?',meaning:'Quanto custa?',example:'Bu ne kadar?'},{expr:'Telefon numaran ne?',meaning:'Qual é o seu telefone?',example:'Telefon numaran ne? — Beş yüz...'}],
    sentences: ['Bir çay, lütfen.','İki kahve istiyorum.','Üç artı iki beş eder.','Ben yirmi yaşındayım.','Bu kitap on lira.','Telefon numaram sıfır beş...'],
    grammar: {title:'Números e substantivos',rules:['Depois de um número, o substantivo permanece no singular: <b>iki kitap</b>, não “iki kitaplar”.','As dezenas são palavras próprias: on, yirmi, otuz, kırk.','A idade usa <b>yaşındayım</b>: “estou na idade de...”.'],table:{headers:['Número','Turco','Exemplo'],rows:[['10','on','on lira'],['20','yirmi','yirmi yaşında'],['30','otuz','otuz gün'],['40','kırk','kırk kitap']]}},
    quiz: [{q:"Como se diz 'três'?",a:'üç',opts:['iki','üç','dört','beş']},{q:"Qual forma significa 'Quanto custa?'",a:'Ne kadar?',opts:['Kaç yaşında?','Ne kadar?','Nerede?','Neden?']},{q:'Como dizer “dois livros”?',a:'iki kitap',opts:['iki kitap','iki kitaplar','ikiler kitap','kitap iki']},{q:'20 em turco é:',a:'yirmi',opts:['on','yirmi','otuz','kırk']}],
    speak: ['Bir, iki, üç, dört, beş.','Ben otuz yaşındayım.','Bu ne kadar?','İki çay, lütfen.']
  },
  {
    id: 305, title: 'Ailem', emoji: '👨‍👩‍👧‍👦', lang: 'tr', course: 'turkish',
    verbs: ['sevmek', 'tanıtmak', 'yaşamak', 'ziyaret etmek'],
    vocab: [{en:'anne',pt:'mãe'},{en:'baba',pt:'pai'},{en:'kardeş',pt:'irmão / irmã'},{en:'oğul',pt:'filho'},{en:'kız',pt:'filha / menina'},{en:'aile',pt:'família'},{en:'eş',pt:'cônjuge'},{en:'çocuk',pt:'criança / filho'}],
    expressions: [{expr:'Bu benim annem.',meaning:'Esta é minha mãe.',example:'Bu benim annem, adı Ayşe.'},{expr:'Kaç kardeşin var?',meaning:'Quantos irmãos você tem?',example:'İki kardeşim var.'},{expr:'Ailemle yaşıyorum.',meaning:'Moro com minha família.',example:'Ankara’da ailemle yaşıyorum.'}],
    sentences: ['Benim annem öğretmen.','Onun babası doktor.','İki kardeşim var.','Bizim ailemiz büyük.','Kızım beş yaşında.','Ailem İstanbul’da yaşıyor.'],
    grammar: {title:'Posse com sufixos',rules:['A posse aparece no final da palavra: anne → anne<b>m</b> (minha mãe).','Depois de vogal, usa-se -m/-n/-si; depois de consoante, -im/-in/-i com harmonia vocálica.','<b>Benim</b> e <b>senin</b> podem ser omitidos quando o sufixo já deixa a pessoa clara.'],table:{headers:['Pessoa','Exemplo','Português'],rows:[['benim','annem','minha mãe'],['senin','annen','sua mãe'],['onun','annesi','mãe dele/dela'],['bizim','annemiz','nossa mãe']]}},
    quiz: [{q:"Como se diz 'minha mãe'?",a:'annem',opts:['anne','annem','annen','annesi']},{q:"Qual palavra significa 'família'?",a:'aile',opts:['eş','aile','kardeş','çocuk']},{q:"Como perguntar 'Quantos irmãos você tem?'",a:'Kaç kardeşin var?',opts:['Ailen nerede?','Kaç kardeşin var?','Bu kim?','Annen nasıl?']},{q:'“babası” significa:',a:'pai dele/dela',opts:['meu pai','seu pai','pai dele/dela','nosso pai']}],
    speak: ['Bu benim ailem.','İki kardeşim var.','Annem öğretmen.','Ailemle yaşıyorum.']
  },
  {
    id: 306, title: 'Günlük Hayat', emoji: '🌅', lang: 'tr', course: 'turkish',
    verbs: ['uyanmak', 'çalışmak', 'yemek', 'uyumak'],
    vocab: [{en:'sabah',pt:'manhã'},{en:'öğleden sonra',pt:'tarde'},{en:'akşam',pt:'noite'},{en:'uyanmak',pt:'acordar'},{en:'kahvaltı yapmak',pt:'tomar café da manhã'},{en:'işe gitmek',pt:'ir ao trabalho'},{en:'eve dönmek',pt:'voltar para casa'},{en:'uyumak',pt:'dormir'}],
    expressions: [{expr:'Her gün',meaning:'Todos os dias.',example:'Her gün saat yedide uyanırım.'},{expr:'Genellikle',meaning:'Geralmente.',example:'Genellikle evde kahvaltı yaparım.'},{expr:'Saat kaçta?',meaning:'A que horas?',example:'Saat kaçta işe gidiyorsun?'}],
    sentences: ['Sabah yedide uyanıyorum.','Kahvaltı yapıyorum.','Sekizde işe gidiyorum.','Öğleden sonra çalışıyorum.','Akşam eve dönüyorum.','Gece on birde uyuyorum.'],
    grammar: {title:'Presente contínuo -iyor',rules:['Ações acontecendo agora ou rotinas atuais usam <b>-iyor</b>.','A vogal muda por harmonia: -ıyor, -iyor, -uyor, -üyor.','Depois vêm as terminações pessoais: gidiyorum, gidiyorsun, gidiyor.'],table:{headers:['Pessoa','gitmek','Português'],rows:[['Ben','gidiyorum','eu vou/estou indo'],['Sen','gidiyorsun','você vai'],['O','gidiyor','ele/ela vai'],['Biz','gidiyoruz','nós vamos']]}},
    quiz: [{q:"'Eu estou indo' é:",a:'gidiyorum',opts:['gidiyorsun','gidiyorum','gidiyor','gidiyoruz']},{q:"Qual expressão significa 'todos os dias'?",a:'Her gün',opts:['Bu gün','Her gün','Dün','Yarın']},{q:'Complete: O çalış___.',a:'ıyor',opts:['ım','ıyor','ıyorsun','ıyoruz']},{q:"Como dizer 'A que horas?'",a:'Saat kaçta?',opts:['Saat ne?','Saat kaçta?','Ne zaman saat?','Kaç saat?']}],
    speak: ['Sabah yedide uyanıyorum.','Her gün çalışıyorum.','Akşam eve dönüyorum.','Gece uyuyorum.']
  },
  {
    id: 307, title: 'Yemek ve İçecekler', emoji: '🍽️', lang: 'tr', course: 'turkish',
    verbs: ['yemek', 'içmek', 'sevmek', 'istemek'],
    vocab: [{en:'ekmek',pt:'pão'},{en:'su',pt:'água'},{en:'çay',pt:'chá'},{en:'kahve',pt:'café'},{en:'peynir',pt:'queijo'},{en:'et',pt:'carne'},{en:'sebze',pt:'legume'},{en:'meyve',pt:'fruta'}],
    expressions: [{expr:'Acıktım.',meaning:'Estou com fome.',example:'Acıktım, yemek yiyelim.'},{expr:'Susadım.',meaning:'Estou com sede.',example:'Susadım, su istiyorum.'},{expr:'Afiyet olsun!',meaning:'Bom apetite!',example:'Yemek hazır. Afiyet olsun!'}],
    sentences: ['Ekmek ve peynir yiyorum.','Su içiyorum.','Türk kahvesini seviyorum.','Et yemiyorum.','Meyve çok güzel.','Bir çay istiyorum.'],
    grammar: {title:'Caso acusativo definido',rules:['Um objeto específico recebe -(y)ı/i/u/ü: <b>çayı</b> = o chá.','Objetos genéricos ficam sem sufixo: <b>çay içiyorum</b> = tomo chá.','A vogal do sufixo acompanha a harmonia vocálica.'],table:{headers:['Genérico','Específico','Português'],rows:[['çay','çayı','chá / o chá'],['kahve','kahveyi','café / o café'],['su','suyu','água / a água'],['et','eti','carne / a carne']]}},
    quiz: [{q:"Como se diz 'chá'?",a:'çay',opts:['su','çay','kahve','süt']},{q:"Qual expressão significa 'Estou com fome'?",a:'Acıktım.',opts:['Susadım.','Acıktım.','Yorgunum.','Hastayım.']},{q:"'Eu não como carne' é:",a:'Et yemiyorum.',opts:['Et yiyorum.','Et yemiyorum.','Eti seviyorum.','Et istiyorum.']},{q:"O objeto específico de 'çay' é:",a:'çayı',opts:['çaya','çayda','çayı','çayın']}],
    speak: ['Bir çay istiyorum.','Su içiyorum.','Acıktım.','Afiyet olsun!']
  },
  {
    id: 308, title: 'Kafede', emoji: '☕', lang: 'tr', course: 'turkish',
    verbs: ['istemek', 'almak', 'ödemek', 'getirmek'],
    vocab: [{en:'menü',pt:'cardápio'},{en:'hesap',pt:'conta'},{en:'garson',pt:'garçom / garçonete'},{en:'fincan',pt:'xícara'},{en:'şeker',pt:'açúcar'},{en:'süt',pt:'leite'},{en:'lezzetli',pt:'delicioso'},{en:'pahalı',pt:'caro'}],
    expressions: [{expr:'Menüyü alabilir miyim?',meaning:'Posso ver o cardápio?',example:'Affedersiniz, menüyü alabilir miyim?'},{expr:'Bir kahve istiyorum.',meaning:'Quero um café.',example:'Bir Türk kahvesi istiyorum.'},{expr:'Hesap, lütfen.',meaning:'A conta, por favor.',example:'Teşekkürler. Hesap, lütfen.'}],
    sentences: ['Bir Türk kahvesi istiyorum.','Şekersiz çay, lütfen.','Bu yemek çok lezzetli.','Menüyü alabilir miyim?','Hesabı kartla ödüyorum.','Bir şişe su getirir misiniz?'],
    grammar: {title:'Pedidos educados',rules:['<b>İstiyorum</b> é direto e comum: “eu quero”.','<b>Alabilir miyim?</b> significa “posso receber/pegar?”.','<b>Getirir misiniz?</b> é uma solicitação formal: “poderia trazer?”.'],table:{headers:['Forma','Tom','Exemplo'],rows:[['istiyorum','neutro','Çay istiyorum.'],['alabilir miyim?','educado','Menüyü alabilir miyim?'],['getirir misiniz?','formal','Su getirir misiniz?']]}},
    quiz: [{q:"Como pedir a conta?",a:'Hesap, lütfen.',opts:['Menü, lütfen.','Hesap, lütfen.','Kahve pahalı.','Garson burada.']},{q:"Qual palavra significa 'açúcar'?",a:'şeker',opts:['süt','şeker','hesap','fincan']},{q:"'Sem açúcar' é:",a:'şekersiz',opts:['şekerli','şekersiz','şekerden','şekerde']},{q:"Como perguntar educadamente se pode ver o menu?",a:'Menüyü alabilir miyim?',opts:['Menü nerede?','Menüyü alabilir miyim?','Menü istiyor.','Menü pahalı mı?']}],
    speak: ['Bir kahve istiyorum.','Şekersiz çay, lütfen.','Menüyü alabilir miyim?','Hesap, lütfen.']
  },
  {
    id: 309, title: 'Şehirde', emoji: '🧭', lang: 'tr', course: 'turkish',
    verbs: ['gitmek', 'dönmek', 'geçmek', 'bulmak'],
    vocab: [{en:'sağ',pt:'direita'},{en:'sol',pt:'esquerda'},{en:'düz',pt:'reto'},{en:'sokak',pt:'rua'},{en:'durak',pt:'ponto / parada'},{en:'istasyon',pt:'estação'},{en:'yakın',pt:'perto'},{en:'uzak',pt:'longe'}],
    expressions: [{expr:'Nerede?',meaning:'Onde?',example:'Metro istasyonu nerede?'},{expr:'Sağa dönün.',meaning:'Vire à direita.',example:'Köşede sağa dönün.'},{expr:'Düz gidin.',meaning:'Siga reto.',example:'İki yüz metre düz gidin.'}],
    sentences: ['Metro istasyonu nerede?','Düz gidin.','İlk sokaktan sola dönün.','Otobüs durağı çok yakın.','Müze bankanın yanında.','Otel buradan uzak değil.'],
    grammar: {title:'Onde, para onde e de onde',rules:['Lugar estático usa <b>-de/-da</b>: otelde = no hotel.','Destino usa <b>-e/-a</b>: otele = para o hotel.','Origem usa <b>-den/-dan</b>: otelden = do hotel.'],table:{headers:['Pergunta','Sufixo','Exemplo'],rows:[['Nerede?','-de','otelde'],['Nereye?','-e','otele'],['Nereden?','-den','otelden']]}},
    quiz: [{q:"Como dizer 'Vire à direita'?",a:'Sağa dönün.',opts:['Sola dönün.','Sağa dönün.','Düz gidin.','Burada durun.']},{q:"Qual palavra significa 'perto'?",a:'yakın',opts:['uzak','yakın','sağ','sol']},{q:"'No hotel' é:",a:'otelde',opts:['otele','otelde','otelden','oteli']},{q:"Como perguntar 'Onde fica o metrô?'",a:'Metro nerede?',opts:['Metro nereye?','Metro nerede?','Metro nereden?','Metro nasıl?']}],
    speak: ['Metro istasyonu nerede?','Düz gidin.','Sağa dönün.','Durak çok yakın.']
  },
  {
    id: 310, title: 'Alışveriş', emoji: '🛍️', lang: 'tr', course: 'turkish',
    verbs: ['almak', 'satmak', 'denemek', 'seçmek'],
    vocab: [{en:'kırmızı',pt:'vermelho'},{en:'mavi',pt:'azul'},{en:'yeşil',pt:'verde'},{en:'siyah',pt:'preto'},{en:'beyaz',pt:'branco'},{en:'beden',pt:'tamanho de roupa'},{en:'ucuz',pt:'barato'},{en:'indirim',pt:'desconto'}],
    expressions: [{expr:'Bu ne kadar?',meaning:'Quanto custa isto?',example:'Bu gömlek ne kadar?'},{expr:'Deneyebilir miyim?',meaning:'Posso experimentar?',example:'Bu ceketi deneyebilir miyim?'},{expr:'Daha ucuzu var mı?',meaning:'Tem um mais barato?',example:'Daha ucuzu var mı, acaba?'}],
    sentences: ['Mavi gömleği beğendim.','Bu beden çok büyük.','Kırmızı elbise güzel.','Daha küçük bir beden var mı?','Bu ayakkabılar pahalı.','Yüzde yirmi indirim var.'],
    grammar: {title:'“Há/tem” com var e yok',rules:['<b>Var</b> indica existência: “há/tem”.','<b>Yok</b> indica ausência: “não há/não tem”.','Perguntas usam <b>mı/mi/mu/mü</b>: Var mı?'],table:{headers:['Afirmação','Pergunta','Português'],rows:[['İndirim var.','İndirim var mı?','Há desconto?'],['Beden yok.','Beden yok mu?','Não tem tamanho?'],['Mavi var.','Mavi var mı?','Tem azul?']]}},
    quiz: [{q:"Como perguntar 'Quanto custa isto?'",a:'Bu ne kadar?',opts:['Bu nerede?','Bu ne kadar?','Bu nasıl?','Bu neden?']},{q:"Qual palavra significa 'desconto'?",a:'indirim',opts:['beden','indirim','ucuz','pahalı']},{q:"'Tem azul?' é:",a:'Mavi var mı?',opts:['Mavi yok.','Mavi var mı?','Mavi ne kadar?','Mavi nerede?']},{q:"Como dizer 'Posso experimentar?'",a:'Deneyebilir miyim?',opts:['Alabilir miyim?','Deneyebilir miyim?','Görebilir miyim?','Gidebilir miyim?']}],
    speak: ['Bu ne kadar?','Mavi var mı?','Deneyebilir miyim?','Daha ucuzu var mı?']
  },
  {
    id: 311, title: 'Saat Kaç?', emoji: '⏰', lang: 'tr', course: 'turkish',
    verbs: ['başlamak', 'bitmek', 'buluşmak', 'beklemek'],
    vocab: [{en:'bugün',pt:'hoje'},{en:'yarın',pt:'amanhã'},{en:'pazartesi',pt:'segunda-feira'},{en:'cuma',pt:'sexta-feira'},{en:'saat',pt:'hora / relógio'},{en:'buçuk',pt:'meia (hora)'},{en:'çeyrek',pt:'quarto de hora'},{en:'randevu',pt:'compromisso / consulta'}],
    expressions: [{expr:'Saat kaç?',meaning:'Que horas são?',example:'Affedersiniz, saat kaç?'},{expr:'Saat üç buçuk.',meaning:'São três e meia.',example:'Toplantı saat üç buçukta.'},{expr:'Yarın görüşürüz.',meaning:'Até amanhã.',example:'Tamam, yarın görüşürüz.'}],
    sentences: ['Saat dokuz.','Saat iki buçuk.','Saat beşi çeyrek geçiyor.','Saat altıya çeyrek var.','Ders pazartesi başlıyor.','Yarın saat sekizde buluşuyoruz.'],
    grammar: {title:'Dizer as horas',rules:['Hora cheia: <b>Saat üç</b>.','“Passa de” usa acusativo + <b>geçiyor</b>: beşi çeyrek geçiyor.','“Falta para” usa dativo + <b>var</b>: altıya çeyrek var.'],table:{headers:['Horário','Turco','Estrutura'],rows:[['3:00','Saat üç','hora cheia'],['3:30','Saat üç buçuk','meia'],['5:15','Beşi çeyrek geçiyor','passa'],['5:45','Altıya çeyrek var','falta']]}},
    quiz: [{q:"Como perguntar 'Que horas são?'",a:'Saat kaç?',opts:['Kaç saat?','Saat kaç?','Saat nerede?','Ne saat?']},{q:'3:30 em turco é:',a:'Saat üç buçuk.',opts:['Saat üç çeyrek.','Saat üç buçuk.','Saat dört buçuk.','Saat üç var.']},{q:"Qual palavra significa 'amanhã'?",a:'yarın',opts:['bugün','dün','yarın','şimdi']},{q:"'Até amanhã' é:",a:'Yarın görüşürüz.',opts:['Bugün görüşürüz.','Yarın görüşürüz.','Güle güle.','Hoş geldin.']}],
    speak: ['Saat kaç?','Saat üç buçuk.','Yarın görüşürüz.','Pazartesi saat dokuzda.']
  },
  {
    id: 312, title: 'Türkiye’ye Yolculuk', emoji: '✈️', lang: 'tr', course: 'turkish',
    verbs: ['seyahat etmek', 'gelmek', 'kalmak', 'gezmek'],
    vocab: [{en:'havaalanı',pt:'aeroporto'},{en:'pasaport',pt:'passaporte'},{en:'bilet',pt:'bilhete / passagem'},{en:'bavul',pt:'mala'},{en:'otel',pt:'hotel'},{en:'rezervasyon',pt:'reserva'},{en:'uçak',pt:'avião'},{en:'tatil',pt:'férias'}],
    expressions: [{expr:'Rezervasyonum var.',meaning:'Tenho uma reserva.',example:'Merhaba, rezervasyonum var.'},{expr:'Uçuş saat kaçta?',meaning:'A que horas é o voo?',example:'İstanbul uçuşu saat kaçta?'},{expr:'Yardım eder misiniz?',meaning:'Pode me ajudar?',example:'Affedersiniz, yardım eder misiniz?'}],
    sentences: ['Türkiye’ye gidiyorum.','Pasaportum çantamda.','İstanbul’a bir biletim var.','Otelde üç gece kalıyorum.','Rezervasyonum var.','Kapadokya’yı gezmek istiyorum.'],
    grammar: {title:'Destino e intenção',rules:['Destino recebe -(y)e/-(y)a: Türkiye<b>’ye</b>, İstanbul<b>’a</b>.','<b>İstemek</b> depois de um verbo em -mek/-mak expressa intenção: gezmek istiyorum.','Nomes próprios recebem apóstrofo antes do sufixo.'],table:{headers:['Base','Com sufixo','Português'],rows:[['Türkiye','Türkiye’ye','para a Turquia'],['İstanbul','İstanbul’a','para Istambul'],['otel','otele','para o hotel'],['gezmek','gezmek istiyorum','quero passear']]}},
    quiz: [{q:"Como dizer 'Tenho uma reserva'?",a:'Rezervasyonum var.',opts:['Rezervasyon nerede?','Rezervasyonum var.','Rezervasyon yok.','Rezervasyon istiyorum.']},{q:"'Para a Turquia' é:",a:'Türkiye’ye',opts:['Türkiye’de','Türkiye’den','Türkiye’ye','Türkiye’yi']},{q:"Qual palavra significa 'passaporte'?",a:'pasaport',opts:['bilet','pasaport','bavul','uçak']},{q:"Como pedir ajuda formalmente?",a:'Yardım eder misiniz?',opts:['Yardım var mı?','Yardım eder misiniz?','Yardım nerede?','Yardım istiyor.']}],
    speak: ['Türkiye’ye gidiyorum.','Rezervasyonum var.','Uçuş saat kaçta?','Yardım eder misiniz?']
  },
  {
    id:313,title:'Hava Nasıl?',emoji:'🌦️',lang:'tr',course:'turkish',
    verbs:['yağmak','esmek','ısınmak','soğumak'],
    vocab:[{en:'güneşli',pt:'ensolarado'},{en:'yağmurlu',pt:'chuvoso'},{en:'bulutlu',pt:'nublado'},{en:'rüzgârlı',pt:'ventoso'},{en:'sıcak',pt:'quente'},{en:'soğuk',pt:'frio'},{en:'kar',pt:'neve'},{en:'hava',pt:'tempo / ar'}],
    expressions:[{expr:'Hava nasıl?',meaning:'Como está o tempo?',example:'Bugün Ankara’da hava nasıl?'},{expr:'Yağmur yağıyor.',meaning:'Está chovendo.',example:'Şemsiyeni al, yağmur yağıyor.'},{expr:'Hava çok güzel.',meaning:'O tempo está ótimo.',example:'Bugün hava çok güzel, yürüyelim.'}],
    sentences:['Bugün hava güneşli.','İstanbul’da yağmur yağıyor.','Kışın hava çok soğuk.','Yazın Antalya sıcak.','Dışarıda rüzgâr esiyor.','Yarın hava bulutlu olacak.'],
    grammar:{title:'Adjetivos e “olacak”',rules:['O tempo usa <b>hava + adjetivo</b>: Hava soğuk.','Acontecimento em curso usa <b>-iyor</b>: Yağmur yağıyor.','Futuro nominal usa <b>olacak</b>: Hava sıcak olacak.'],table:{headers:['Agora','Em curso','Futuro'],rows:[['Hava soğuk.','Kar yağıyor.','Hava soğuk olacak.'],['Hava rüzgârlı.','Rüzgâr esiyor.','Rüzgârlı olacak.']]}},
    quiz:[{q:'Como perguntar sobre o tempo?',a:'Hava nasıl?',opts:['Hava nerede?','Hava nasıl?','Hava kim?','Hava kaç?']},{q:'“Está chovendo” é:',a:'Yağmur yağıyor.',opts:['Kar yağıyor.','Yağmur yağıyor.','Hava sıcak.','Rüzgâr yok.']},{q:'Qual palavra significa “nublado”?',a:'bulutlu',opts:['güneşli','bulutlu','yağmurlu','soğuk']},{q:'“Estará quente” é:',a:'Sıcak olacak.',opts:['Sıcak oluyor.','Sıcak olacak.','Sıcak değil.','Sıcaktı.']}],
    speak:['Bugün hava nasıl?','Hava çok güzel.','Yağmur yağıyor.','Yarın hava güneşli olacak.']
  },
  {
    id:314,title:'Evim',emoji:'🏠',lang:'tr',course:'turkish',verbs:['oturmak','açmak','kapatmak','temizlemek'],
    vocab:[{en:'ev',pt:'casa'},{en:'oda',pt:'quarto / cômodo'},{en:'mutfak',pt:'cozinha'},{en:'banyo',pt:'banheiro'},{en:'salon',pt:'sala'},{en:'kapı',pt:'porta'},{en:'pencere',pt:'janela'},{en:'masa',pt:'mesa'}],
    expressions:[{expr:'Evdeyim.',meaning:'Estou em casa.',example:'Bugün evdeyim.'},{expr:'Masanın üstünde.',meaning:'Em cima da mesa.',example:'Anahtar masanın üstünde.'},{expr:'Pencereyi açar mısın?',meaning:'Você abre a janela?',example:'Lütfen pencereyi açar mısın?'}],
    sentences:['Ben küçük bir evde oturuyorum.','Mutfak salonun yanında.','Kitap masanın üstünde.','Kedi sandalyenin altında.','Anahtar kapının arkasında.','Yatak odası üst katta.'],
    grammar:{title:'Posições com genitivo',rules:['“Em cima de X” usa <b>X-in üstünde</b>.','As formas mais úteis são üstünde, altında, yanında, içinde e arkasında.','A terminação de X muda pela harmonia vocálica.'],table:{headers:['Turco','Português','Exemplo'],rows:[['üstünde','em cima','masanın üstünde'],['altında','embaixo','masanın altında'],['yanında','ao lado','evin yanında'],['içinde','dentro','çantanın içinde']]}},
    quiz:[{q:'“Estou em casa” é:',a:'Evdeyim.',opts:['Eve gidiyorum.','Evdeyim.','Evden geldim.','Evim var.']},{q:'Onde está o livro? “Na mesa”',a:'Masanın üstünde.',opts:['Masanın altında.','Masanın üstünde.','Masaya.','Masadan.']},{q:'Qual palavra significa cozinha?',a:'mutfak',opts:['banyo','salon','mutfak','oda']},{q:'“Ao lado da casa” é:',a:'evin yanında',opts:['evin içinde','evin yanında','eve doğru','evden sonra']}],
    speak:['Bugün evdeyim.','Kitap masanın üstünde.','Mutfak salonun yanında.','Pencereyi açar mısın?']
  },
  {
    id:315,title:'Sağlık',emoji:'🩺',lang:'tr',course:'turkish',verbs:['ağrımak','hissetmek','dinlenmek','iyileşmek'],
    vocab:[{en:'baş',pt:'cabeça'},{en:'boğaz',pt:'garganta'},{en:'mide',pt:'estômago'},{en:'ateş',pt:'febre'},{en:'öksürük',pt:'tosse'},{en:'ilaç',pt:'remédio'},{en:'doktor',pt:'médico(a)'},{en:'hastane',pt:'hospital'}],
    expressions:[{expr:'Başım ağrıyor.',meaning:'Minha cabeça está doendo.',example:'Bugün başım çok ağrıyor.'},{expr:'Kendimi iyi hissetmiyorum.',meaning:'Não estou me sentindo bem.',example:'Eve gitmeliyim; kendimi iyi hissetmiyorum.'},{expr:'Geçmiş olsun.',meaning:'Melhoras.',example:'Hastaymışsın, geçmiş olsun.'}],
    sentences:['Boğazım ağrıyor.','Biraz ateşim var.','Doktora gitmem gerekiyor.','Bu ilacı günde iki kez alın.','Bol su için ve dinlenin.','Şimdi daha iyi hissediyorum.'],
    grammar:{title:'Partes do corpo com posse',rules:['Dor corporal usa a parte com posse: baş<b>ım</b>, boğaz<b>ım</b>.','<b>-meli/-malı</b> expressa “dever”: dinlenmeliyim.','<b>gerekiyor</b> expressa necessidade: gitmem gerekiyor.'],table:{headers:['Sintoma','Conselho','Português'],rows:[['Başım ağrıyor.','Dinlenmelisin.','Você deve descansar.'],['Ateşim var.','Doktora gitmelisin.','Deve ir ao médico.']]}},
    quiz:[{q:'Como dizer “Minha cabeça dói”?',a:'Başım ağrıyor.',opts:['Baş ağrı.','Başım ağrıyor.','Başı ağrıyorum.','Başım var.']},{q:'A expressão usada para desejar melhoras é:',a:'Geçmiş olsun.',opts:['Afiyet olsun.','Geçmiş olsun.','Kolay gelsin.','Hoş geldin.']},{q:'Qual palavra significa remédio?',a:'ilaç',opts:['ateş','ilaç','öksürük','boğaz']},{q:'“Eu devo descansar” é:',a:'Dinlenmeliyim.',opts:['Dinleniyorum.','Dinlenmeliyim.','Dinlendim.','Dinlenir.']}],
    speak:['Başım ağrıyor.','Kendimi iyi hissetmiyorum.','Doktora gitmeliyim.','Geçmiş olsun.']
  },
  {
    id:316,title:'Ulaşım',emoji:'🚇',lang:'tr',course:'turkish',verbs:['binmek','inmek','kaçırmak','aktarma yapmak'],
    vocab:[{en:'otobüs',pt:'ônibus'},{en:'metro',pt:'metrô'},{en:'tren',pt:'trem'},{en:'vapur',pt:'balsa / ferry'},{en:'durak',pt:'parada'},{en:'istasyon',pt:'estação'},{en:'kart',pt:'cartão'},{en:'trafik',pt:'trânsito'}],
    expressions:[{expr:'Hangi otobüs?',meaning:'Qual ônibus?',example:'Taksim’e hangi otobüs gidiyor?'},{expr:'Nerede inmeliyim?',meaning:'Onde devo descer?',example:'Müze için nerede inmeliyim?'},{expr:'Bir sonraki durak.',meaning:'A próxima parada.',example:'Bir sonraki durakta inin.'}],
    sentences:['Her sabah metroya biniyorum.','İki durak sonra iniyorum.','Bugün otobüsü kaçırdım.','Vapurla Kadıköy’e gidiyoruz.','Burada aktarma yapmanız gerekiyor.','İstanbul’da trafik çok yoğun.'],
    grammar:{title:'binmek e inmek pedem casos diferentes',rules:['<b>binmek</b> usa dativo: metro<b>ya</b> binmek.','<b>inmek</b> usa ablativo: metro<b>dan</b> inmek.','Meio de transporte usa <b>-la/-le</b>: vapurla, trenle.'],table:{headers:['Ação','Forma','Exemplo'],rows:[['embarcar','-e/-a','otobüse binmek'],['desembarcar','-den/-dan','otobüsten inmek'],['ir de','-le/-la','otobüsle gitmek']]}},
    quiz:[{q:'“Embarcar no metrô” é:',a:'metroya binmek',opts:['metrodan inmek','metroya binmek','metroyla inmek','metroda gitmek']},{q:'“Descer do ônibus” é:',a:'otobüsten inmek',opts:['otobüse binmek','otobüsten inmek','otobüsle binmek','otobüste inmek']},{q:'Qual palavra significa trânsito?',a:'trafik',opts:['durak','kart','trafik','istasyon']},{q:'Como perguntar onde deve descer?',a:'Nerede inmeliyim?',opts:['Nerede binmeliyim?','Nerede inmeliyim?','Nereye gidiyor?','Hangi durak?']}],
    speak:['Metroya nereden binebilirim?','Nerede inmeliyim?','Bir sonraki durakta inin.','Otobüsü kaçırdım.']
  },
  {
    id:317,title:'Otelde',emoji:'🛎️',lang:'tr',course:'turkish',verbs:['rezervasyon yapmak','giriş yapmak','kalmak','ayrılmak'],
    vocab:[{en:'resepsiyon',pt:'recepção'},{en:'oda',pt:'quarto'},{en:'anahtar',pt:'chave'},{en:'kahvaltı',pt:'café da manhã'},{en:'havlu',pt:'toalha'},{en:'klima',pt:'ar-condicionado'},{en:'asansör',pt:'elevador'},{en:'kat',pt:'andar'}],
    expressions:[{expr:'Rezervasyonum var.',meaning:'Tenho uma reserva.',example:'Luis Lima adına rezervasyonum var.'},{expr:'Kahvaltı dahil mi?',meaning:'O café da manhã está incluído?',example:'Oda fiyatına kahvaltı dahil mi?'},{expr:'Klimayı çalıştıramıyorum.',meaning:'Não consigo ligar o ar.',example:'Klimayı çalıştıramıyorum, yardım eder misiniz?'}],
    sentences:['İki kişilik bir oda ayırttım.','Odanız üçüncü katta.','Kahvaltı yediden ona kadar.','Bir havlu daha alabilir miyim?','Asansör resepsiyonun yanında.','Yarın sabah çıkış yapacağız.'],
    grammar:{title:'Poder e não conseguir',rules:['<b>-(y)ebilir</b> expressa capacidade ou possibilidade.','Negativo de capacidade: <b>-(y)emiyor</b>: çalıştıramıyorum.','Pedidos educados terminam em <b>miyim/misiniz</b>.'],table:{headers:['Ação','Positivo','Negativo'],rows:[['almak','alabilirim','alamıyorum'],['açmak','açabilirim','açamıyorum'],['çalıştırmak','çalıştırabilirim','çalıştıramıyorum']]}},
    quiz:[{q:'Como perguntar se o café está incluído?',a:'Kahvaltı dahil mi?',opts:['Kahvaltı nerede?','Kahvaltı dahil mi?','Kahvaltı kaçta?','Kahvaltı var.']},{q:'“Não consigo ligar” é:',a:'Çalıştıramıyorum.',opts:['Çalıştırıyorum.','Çalıştıramıyorum.','Çalıştırmalıyım.','Çalıştırdım.']},{q:'Qual palavra significa toalha?',a:'havlu',opts:['anahtar','havlu','kat','klima']},{q:'“Posso receber outra toalha?” é:',a:'Bir havlu daha alabilir miyim?',opts:['Havlu nerede?','Bir havlu daha alabilir miyim?','Havlu dahil mi?','Havlu istemiyor.']}],
    speak:['Rezervasyonum var.','Kahvaltı dahil mi?','Bir havlu daha alabilir miyim?','Yarın çıkış yapacağız.']
  },
  {
    id:318,title:'Dün Ne Yaptın?',emoji:'🕰️',lang:'tr',course:'turkish',verbs:['gitmek','görmek','yapmak','yemek'],
    vocab:[{en:'dün',pt:'ontem'},{en:'geçen hafta',pt:'semana passada'},{en:'sabah',pt:'de manhã'},{en:'sonra',pt:'depois'},{en:'önce',pt:'antes'},{en:'erken',pt:'cedo'},{en:'geç',pt:'tarde'},{en:'bütün gün',pt:'o dia todo'}],
    expressions:[{expr:'Dün ne yaptın?',meaning:'O que você fez ontem?',example:'Dün ne yaptın? — Evde kaldım.'},{expr:'Çok eğlendim.',meaning:'Eu me diverti muito.',example:'Partide çok eğlendim.'},{expr:'Hiçbir şey yapmadım.',meaning:'Não fiz nada.',example:'Pazar günü hiçbir şey yapmadım.'}],
    sentences:['Dün sinemaya gittim.','Arkadaşlarımla buluştum.','Güzel bir film izledik.','Sonra yemek yedik.','Eve geç döndüm.','Pazar günü dinlendim.'],
    grammar:{title:'Passado definido -di',rules:['Eventos concluídos e presenciados usam <b>-di</b>.','A consoante pode virar t e a vogal segue a harmonia: gittim, baktım, gördüm.','Negativo: raiz + <b>-ma/-me</b> + passado: yapmadım.'],table:{headers:['Verbo','Passado','Negativo'],rows:[['gitmek','gittim','gitmedim'],['yapmak','yaptım','yapmadım'],['görmek','gördüm','görmedim']]}},
    quiz:[{q:'“Eu fui” é:',a:'gittim',opts:['gidiyorum','gittim','gideceğim','gitmeliyim']},{q:'“Eu não fiz” é:',a:'yapmadım',opts:['yapıyorum','yapmadım','yapmayacağım','yapamam']},{q:'Como perguntar o que alguém fez ontem?',a:'Dün ne yaptın?',opts:['Yarın ne yapacaksın?','Dün ne yaptın?','Şimdi ne yapıyorsun?','Her gün ne yaparsın?']},{q:'Qual expressão significa “semana passada”?',a:'geçen hafta',opts:['gelecek hafta','bu hafta','geçen hafta','hafta sonu']}],
    speak:['Dün ne yaptın?','Sinemaya gittim.','Çok eğlendim.','Hiçbir şey yapmadım.']
  },
  {
    id:319,title:'Yarın Ne Yapacaksın?',emoji:'🔮',lang:'tr',course:'turkish',verbs:['planlamak','gidecek olmak','buluşmak','hazırlanmak'],
    vocab:[{en:'yarın',pt:'amanhã'},{en:'gelecek hafta',pt:'semana que vem'},{en:'plan',pt:'plano'},{en:'toplantı',pt:'reunião'},{en:'ziyaret',pt:'visita'},{en:'tatil',pt:'férias'},{en:'belki',pt:'talvez'},{en:'kesinlikle',pt:'com certeza'}],
    expressions:[{expr:'Ne yapacaksın?',meaning:'O que você vai fazer?',example:'Hafta sonu ne yapacaksın?'},{expr:'Henüz karar vermedim.',meaning:'Ainda não decidi.',example:'Belki gezerim; henüz karar vermedim.'},{expr:'Sabırsızlanıyorum.',meaning:'Mal posso esperar.',example:'Tatil için sabırsızlanıyorum.'}],
    sentences:['Yarın çalışacağım.','Akşam arkadaşlarımla buluşacağım.','Gelecek hafta Ankara’ya gideceğiz.','O toplantıya katılmayacak.','Belki evde kalırım.','Yazın Türkiye’yi gezeceğim.'],
    grammar:{title:'Futuro -ecek/-acak',rules:['Futuro usa <b>-ecek/-acak</b> + pessoa.','Antes de vogal pessoal, k suaviza para ğ: gidecek + im → gideceğim.','Negativo: <b>-meyecek/-mayacak</b>.'],table:{headers:['Pessoa','gitmek','Negativo'],rows:[['Ben','gideceğim','gitmeyeceğim'],['Sen','gideceksin','gitmeyeceksin'],['O','gidecek','gitmeyecek'],['Biz','gideceğiz','gitmeyeceğiz']]}},
    quiz:[{q:'“Eu vou trabalhar” é:',a:'Çalışacağım.',opts:['Çalışıyorum.','Çalıştım.','Çalışacağım.','Çalışmalıyım.']},{q:'“Ela não irá” é:',a:'Gitmeyecek.',opts:['Gitmiyor.','Gitmedi.','Gitmeyecek.','Gidemez.']},{q:'Como perguntar sobre os planos?',a:'Ne yapacaksın?',opts:['Ne yaptın?','Ne yapacaksın?','Ne yapıyorsun?','Ne yaparsın?']},{q:'Qual palavra significa “talvez”?',a:'belki',opts:['kesinlikle','belki','henüz','sonra']}],
    speak:['Yarın ne yapacaksın?','Yarın çalışacağım.','Belki evde kalırım.','Türkiye’yi gezeceğim.']
  },
  {
    id:320,title:'Hobilerim',emoji:'🎨',lang:'tr',course:'turkish',verbs:['okumak','izlemek','oynamak','yüzmek'],
    vocab:[{en:'kitap okumak',pt:'ler livros'},{en:'film izlemek',pt:'assistir filmes'},{en:'müzik dinlemek',pt:'ouvir música'},{en:'spor yapmak',pt:'praticar esporte'},{en:'yüzmek',pt:'nadar'},{en:'fotoğraf çekmek',pt:'tirar fotos'},{en:'yemek yapmak',pt:'cozinhar'},{en:'seyahat etmek',pt:'viajar'}],
    expressions:[{expr:'Boş zamanlarında ne yaparsın?',meaning:'O que faz no tempo livre?',example:'Boş zamanlarında ne yaparsın?'},{expr:'Çok hoşuma gidiyor.',meaning:'Eu gosto muito disso.',example:'Türk müziği çok hoşuma gidiyor.'},{expr:'Pek sevmiyorum.',meaning:'Não gosto muito.',example:'Futbolu pek sevmiyorum.'}],
    sentences:['Boş zamanlarımda kitap okurum.','Hafta sonları yüzmeye giderim.','Gitar çalmayı öğreniyorum.','Fotoğraf çekmekten hoşlanıyorum.','Korku filmlerini sevmiyorum.','Yeni yerler gezmeyi çok seviyorum.'],
    grammar:{title:'Gostar de fazer: -meyi e -mekten',rules:['<b>sevmek</b> usa verbo nominalizado em -(y)i: yüzmeyi seviyorum.','<b>hoşlanmak</b> usa -den/-dan: yüzmekten hoşlanıyorum.','Hábitos gerais podem usar o aoristo: okurum, giderim.'],table:{headers:['Estrutura','Exemplo','Português'],rows:[['-meyi sevmek','okumayı seviyorum','gosto de ler'],['-mekten hoşlanmak','yüzmekten hoşlanıyorum','gosto de nadar'],['aoristo','kitap okurum','costumo ler']]}},
    quiz:[{q:'“Gosto de ler” é:',a:'Okumayı seviyorum.',opts:['Okumak seviyorum.','Okumayı seviyorum.','Okumadan seviyorum.','Okuyorum sevgi.']},{q:'Como perguntar sobre o tempo livre?',a:'Boş zamanlarında ne yaparsın?',opts:['Ne iş yaparsın?','Boş zamanlarında ne yaparsın?','Saat kaçta?','Nereye gidersin?']},{q:'Qual expressão significa tirar fotos?',a:'fotoğraf çekmek',opts:['film izlemek','fotoğraf çekmek','müzik dinlemek','spor yapmak']},{q:'“Não gosto muito” é:',a:'Pek sevmiyorum.',opts:['Çok seviyorum.','Pek sevmiyorum.','Hiç bilmiyorum.','Hoş geldin.']}],
    speak:['Boş zamanlarında ne yaparsın?','Kitap okumayı seviyorum.','Fotoğraf çekmekten hoşlanıyorum.','Futbolu pek sevmiyorum.']
  },
  {
    id:321,title:'Acil Durum',emoji:'🆘',lang:'tr',course:'turkish',verbs:['yardım etmek','aramak','kaybetmek','bulmak'],
    vocab:[{en:'yardım',pt:'ajuda'},{en:'polis',pt:'polícia'},{en:'ambulans',pt:'ambulância'},{en:'yangın',pt:'incêndio'},{en:'kayıp',pt:'perdido'},{en:'tehlike',pt:'perigo'},{en:'acil',pt:'urgente'},{en:'adres',pt:'endereço'}],
    expressions:[{expr:'Yardım edin!',meaning:'Socorro! / Ajude!',example:'Lütfen yardım edin!'},{expr:'Polisi arayın.',meaning:'Chame a polícia.',example:'Çantam çalındı, polisi arayın.'},{expr:'Pasaportumu kaybettim.',meaning:'Perdi meu passaporte.',example:'Pasaportumu kaybettim, ne yapmalıyım?'}],
    sentences:['Bir ambulans çağırın.','Telefonumu kaybettim.','En yakın polis merkezi nerede?','Bu acil bir durum.','Adresinizi söyler misiniz?','Lütfen sakin olun.'],
    grammar:{title:'Imperativo formal e urgência',rules:['Formal/plural: raiz + <b>-in/-ın/-un/-ün</b>: arayın, bekleyin.','Mais formal: <b>-iniz</b>: bekleyiniz.','Perguntar “o que devo fazer?”: <b>Ne yapmalıyım?</b>'],table:{headers:['Verbo','Formal','Português'],rows:[['aramak','Arayın!','Ligue!'],['beklemek','Bekleyin!','Espere!'],['yardım etmek','Yardım edin!','Ajude!']]}},
    quiz:[{q:'Como pedir socorro?',a:'Yardım edin!',opts:['Yardım var.','Yardım edin!','Yardım ettim.','Yardım yok.']},{q:'“Perdi meu passaporte” é:',a:'Pasaportumu kaybettim.',opts:['Pasaportum var.','Pasaportumu kaybettim.','Pasaport arıyorum.','Pasaport nerede?']},{q:'Qual palavra significa ambulância?',a:'ambulans',opts:['polis','ambulans','yangın','tehlike']},{q:'“Chame a polícia” é:',a:'Polisi arayın.',opts:['Polis geliyor.','Polisi arayın.','Polise gittim.','Polis nerede?']}],
    speak:['Yardım edin!','Bir ambulans çağırın.','Pasaportumu kaybettim.','Ne yapmalıyım?']
  },
  {
    id:322,title:'Türk Kültürü',emoji:'🧿',lang:'tr',course:'turkish',verbs:['ikram etmek','kutlamak','ziyaret etmek','saygı göstermek'],
    vocab:[{en:'misafir',pt:'convidado'},{en:'ikram',pt:'algo oferecido ao visitante'},{en:'bayram',pt:'feriado / celebração'},{en:'nazar boncuğu',pt:'olho turco'},{en:'gelenek',pt:'tradição'},{en:'komşu',pt:'vizinho'},{en:'düğün',pt:'casamento'},{en:'kahve falı',pt:'leitura da borra do café'}],
    expressions:[{expr:'Hoş geldiniz.',meaning:'Bem-vindo(a).',example:'Evimize hoş geldiniz.'},{expr:'Hoş bulduk.',meaning:'Resposta a “bem-vindo”.',example:'— Hoş geldiniz! — Hoş bulduk.'},{expr:'Ellerinize sağlık.',meaning:'Elogio a quem preparou a comida.',example:'Yemek harika, ellerinize sağlık.'}],
    sentences:['Türkler misafire çay ikram eder.','Bayramlarda aileler birbirini ziyaret eder.','Nazar boncuğu popüler bir semboldür.','Türk kahvesi yavaş içilir.','Eve girerken ayakkabılar çıkarılır.','Komşuluk kültürü hâlâ önemlidir.'],
    grammar:{title:'Voz passiva cotidiana',rules:['A passiva usa <b>-il/-ıl/-ul/-ül</b> ou <b>-in</b>.','Ayakkabılar çıkarılır = os sapatos são tirados.','Kahve içilir = café é bebido; descreve costume geral.'],table:{headers:['Ativo','Passivo','Português'],rows:[['ikram eder','ikram edilir','é oferecido'],['içer','içilir','é bebido'],['çıkarır','çıkarılır','é retirado']]}},
    quiz:[{q:'O que responder a “Hoş geldiniz”?',a:'Hoş bulduk.',opts:['Güle güle.','Hoş bulduk.','Afiyet olsun.','Geçmiş olsun.']},{q:'Como elogiar quem cozinhou?',a:'Ellerinize sağlık.',opts:['Kolay gelsin.','Ellerinize sağlık.','Çok yaşa.','Başınız sağ olsun.']},{q:'Qual palavra significa tradição?',a:'gelenek',opts:['misafir','gelenek','bayram','komşu']},{q:'“O chá é oferecido” é:',a:'Çay ikram edilir.',opts:['Çay ikram eder.','Çay ikram edilir.','Çay içiyor.','Çay istiyor.']}],
    speak:['Hoş geldiniz.','Hoş bulduk.','Ellerinize sağlık.','Türkler misafire çay ikram eder.']
  },
  {
    id:323,title:'Fikirler ve Bağlaçlar',emoji:'💭',lang:'tr',course:'turkish',verbs:['düşünmek','katılmak','açıklamak','karşılaştırmak'],
    vocab:[{en:'çünkü',pt:'porque'},{en:'ama',pt:'mas'},{en:'bu yüzden',pt:'por isso'},{en:'bence',pt:'na minha opinião'},{en:'sence',pt:'na sua opinião'},{en:'belki',pt:'talvez'},{en:'gerçekten',pt:'realmente'},{en:'ayrıca',pt:'além disso'}],
    expressions:[{expr:'Bence çok güzel.',meaning:'Na minha opinião, é muito bonito.',example:'Bence İstanbul çok güzel.'},{expr:'Sana katılıyorum.',meaning:'Concordo com você.',example:'Evet, sana katılıyorum.'},{expr:'Emin değilim.',meaning:'Não tenho certeza.',example:'Belki haklısın ama emin değilim.'}],
    sentences:['Türkçe zor ama çok güzel.','Evde kaldım çünkü hastaydım.','Yağmur yağıyor, bu yüzden şemsiye aldım.','Bence bu film çok ilginç.','Ayrıca müzikleri de harika.','Sence hangi şehir daha güzel?'],
    grammar:{title:'Conectar ideias naturalmente',rules:['<b>çünkü</b> introduz a razão depois da ideia principal.','<b>bu yüzden</b> introduz o resultado.','<b>ama</b> contrasta; <b>ayrıca</b> adiciona informação.'],table:{headers:['Função','Conector','Exemplo'],rows:[['razão','çünkü','Gelmedim çünkü hastaydım.'],['resultado','bu yüzden','Hastaydım, bu yüzden gelmedim.'],['contraste','ama','Zor ama güzel.']]}},
    quiz:[{q:'Qual conector significa “porque”?',a:'çünkü',opts:['ama','çünkü','bu yüzden','ayrıca']},{q:'“Na minha opinião” é:',a:'bence',opts:['sence','bence','belki','gerçekten']},{q:'Como dizer “Concordo com você”?',a:'Sana katılıyorum.',opts:['Seni görüyorum.','Sana katılıyorum.','Seni dinliyorum.','Sana gidiyorum.']},{q:'Qual conector apresenta resultado?',a:'bu yüzden',opts:['çünkü','ama','bu yüzden','belki']}],
    speak:['Bence Türkçe çok güzel.','Sana katılıyorum.','Zor ama eğlenceli.','Emin değilim.']
  },
  {
    id:324,title:'İstanbul’da Bir Gün',emoji:'🏆',lang:'tr',course:'turkish',verbs:['hatırlamak','anlatmak','sipariş vermek','yol sormak'],
    vocab:[{en:'meydan',pt:'praça'},{en:'boğaz',pt:'estreito / Bósforo'},{en:'cami',pt:'mesquita'},{en:'çarşı',pt:'mercado'},{en:'köprü',pt:'ponte'},{en:'manzara',pt:'vista / paisagem'},{en:'hatıra',pt:'lembrança'},{en:'gezi',pt:'passeio'}],
    expressions:[{expr:'Kayboldum.',meaning:'Estou perdido(a).',example:'Affedersiniz, kayboldum.'},{expr:'Ne tavsiye edersiniz?',meaning:'O que você recomenda?',example:'İlk kez buradayım, ne tavsiye edersiniz?'},{expr:'Harika bir gündü.',meaning:'Foi um dia maravilhoso.',example:'Çok yoruldum ama harika bir gündü.'}],
    sentences:['Sabah vapurla Eminönü’ne gittim.','Önce bir kafede kahvaltı yaptım.','Sonra Kapalıçarşı’yı gezdim.','Öğleden sonra Boğaz turuna katıldım.','Akşam balık sipariş ettim.','Çok yoruldum ama harika bir gündü.'],
    grammar:{title:'Revisão integrada A1',rules:['Use passado -di para narrar etapas concluídas.','Use önce, sonra e öğleden sonra para organizar a história.','Use casos de lugar para destino, posição e origem.'],table:{headers:['Momento','Estrutura','Exemplo'],rows:[['início','önce','Önce kahvaltı yaptım.'],['sequência','sonra','Sonra çarşıya gittim.'],['contraste','ama','Yoruldum ama mutluydum.']]}},
    quiz:[{q:'Como perguntar por uma recomendação?',a:'Ne tavsiye edersiniz?',opts:['Nerede inmeliyim?','Ne tavsiye edersiniz?','Bu ne kadar?','Saat kaç?']},{q:'“Estou perdido” é:',a:'Kayboldum.',opts:['Yoruldum.','Kayboldum.','Acıktım.','Geç kaldım.']},{q:'Qual palavra significa paisagem?',a:'manzara',opts:['meydan','manzara','köprü','hatıra']},{q:'Qual frase encerra uma narrativa positiva?',a:'Harika bir gündü.',opts:['Hava nasıl?','Harika bir gündü.','Yardım edin.','Henüz bilmiyorum.']}],
    speak:['Kayboldum, yardım eder misiniz?','Ne tavsiye edersiniz?','Sonra Boğaz turuna katıldım.','Harika bir gündü.']
  }
];

const TURKISH_A2_BLUEPRINTS = [
  {id:325,title:'Hiç Türkiye’ye Gittin mi?',emoji:'🌍',objective:'Converse sobre experiências de vida sem dizer quando aconteceram',focus:'experiências · hiç · daha önce',stage:'A2 · Deneyimler',verbs:['denemek','ziyaret etmek','tatmak','yaşamak'],words:[['deneyim','experiência'],['daha önce','antes / anteriormente'],['hiç','alguma vez'],['henüz','ainda'],['birkaç kez','algumas vezes'],['yurt dışı','exterior'],['unutulmaz','inesquecível'],['macera','aventura']],expr:[['Hiç Türkiye’ye gittin mi?','Você já foi à Turquia?'],['Daha önce denemedim.','Nunca experimentei antes.'],['Üç kez gittim.','Fui três vezes.']],sentences:['Hiç Türk kahvesi içtin mi?','Daha önce İstanbul’a gittim.','Henüz Kapadokya’yı görmedim.','Bu unutulmaz bir deneyimdi.','İki kez yurt dışına çıktım.'],grammar:['Experiências usam passado -di com <b>hiç</b> em perguntas.','<b>henüz ... -medi</b> significa “ainda não”.','Número de vezes usa <b>kez</b>: iki kez.']},
  {id:326,title:'Daha Büyük, En Güzel',emoji:'📏',objective:'Compare lugares, objetos e experiências com naturalidade',focus:'daha · en · kadar',stage:'A2 · Karşılaştırma',verbs:['karşılaştırmak','tercih etmek','benzemek','farklı olmak'],words:[['büyük','grande'],['küçük','pequeno'],['hızlı','rápido'],['yavaş','lento'],['kalabalık','lotado'],['sakin','tranquilo'],['ucuz','barato'],['pahalı','caro']],expr:[['Ankara’dan daha büyük.','Maior que Ancara.'],['Bence en güzeli bu.','Acho que este é o mais bonito.'],['Senin kadar hızlı değil.','Não é tão rápido quanto você.']],sentences:['İstanbul Ankara’dan daha kalabalık.','Bu otel diğerinden daha ucuz.','Boğaz şehrin en güzel yeridir.','Tren otobüs kadar rahat.','Bugün dünden daha sıcak.'],grammar:['Comparativo: X-den <b>daha</b> + adjetivo.','Superlativo: <b>en</b> + adjetivo.','Igualdade: X <b>kadar</b> + adjetivo.']},
  {id:327,title:'Duyduğuma Göre',emoji:'👂',objective:'Conte informações que ouviu e descobertas inesperadas',focus:'passado -miş · evidência',stage:'A2 · Anlatım',verbs:['duymak','öğrenmek','şaşırmak','söylemek'],words:[['haber','notícia'],['söylenti','boato'],['meğer','pelo visto'],['galiba','aparentemente'],['duyduğuma göre','pelo que ouvi'],['şaşırtıcı','surpreendente'],['doğru','verdadeiro'],['yanlış','falso']],expr:[['Duyduğuma göre taşınmış.','Pelo que ouvi, ele se mudou.'],['Meğer çok yakınmış.','Pelo visto, era bem perto.'],['Galiba unutmuş.','Aparentemente, esqueceu.']],sentences:['Ayşe yeni bir işe başlamış.','Meğer restoran kapalıymış.','Duyduğuma göre yarın yağmur yağacakmış.','Bu haber doğru değilmiş.','Anahtar çantamdaymış.'],grammar:['<b>-miş</b> indica informação não presenciada ou descoberta.','Em nomes: güzelmiş, öğrenciymiş.','Relato futuro: gelecekmiş; relato contínuo: geliyormuş.']},
  {id:328,title:'Eğer Vaktim Olursa',emoji:'🔀',objective:'Fale de condições reais e resultados possíveis',focus:'eğer · -se/-sa',stage:'A2 · Koşullar',verbs:['olmak','yetişmek','başarmak','seçmek'],words:[['eğer','se / caso'],['koşul','condição'],['fırsat','oportunidade'],['mümkün','possível'],['imkânsız','impossível'],['sonuç','resultado'],['karar','decisão'],['şans','sorte / chance']],expr:[['Vaktim olursa gelirim.','Se eu tiver tempo, venho.'],['Yağmur yağarsa evde kalırız.','Se chover, ficamos em casa.'],['Mümkünse bugün bitirelim.','Se possível, terminemos hoje.']],sentences:['Erken çıkarsak trene yetişiriz.','Türkçe konuşursan daha hızlı öğrenirsin.','Hava güzel olursa piknik yapacağız.','Fırsat bulursam seni ararım.','İstersen birlikte çalışabiliriz.'],grammar:['Condição real usa <b>-se/-sa</b>.','Resultado comum aparece no aoristo ou futuro.','<b>istersen</b> é uma forma muito usada para oferecer opções.']},
  {id:329,title:'Beni Arayan Kişi',emoji:'🧩',objective:'Descreva pessoas e coisas usando orações relativas simples',focus:'particípio -en/-an',stage:'A2 · Tanımlama',verbs:['aramak','çalışmak','beklemek','tanımak'],words:[['kişi','pessoa'],['çalışan','funcionário / que trabalha'],['bekleyen','que espera'],['gelen','que vem / veio'],['giden','que vai / foi'],['tanıdık','conhecido'],['yabancı','estranho / estrangeiro'],['komik','engraçado']],expr:[['Beni arayan kişi kim?','Quem é a pessoa que me ligou?'],['Köşede bekleyen adam.','O homem que espera na esquina.'],['Türkiye’de yaşayan arkadaşım.','Meu amigo que mora na Turquia.']],sentences:['Dün gelen misafir çok nazikti.','Bu şirkette çalışan kadın müdür.','Masada duran kitap benim.','Türkçe öğrenen öğrenciler burada.','Beni bekleyen taksi dışarıda.'],grammar:['Quem faz a ação recebe <b>-en/-an</b>: gelen kişi.','A oração relativa vem antes do substantivo.','Não se usa pronome relativo equivalente a “que”.']},
  {id:330,title:'Eskiden Böyleydi',emoji:'📼',objective:'Compare hábitos antigos com sua vida atual',focus:'eskiden · artık · aoristo',stage:'A2 · Alışkanlıklar',verbs:['alışmak','değişmek','kullanmak','geçirmek'],words:[['eskiden','antigamente'],['artık','agora / já não'],['alışkanlık','hábito'],['sık sık','frequentemente'],['nadiren','raramente'],['genellikle','geralmente'],['değişiklik','mudança'],['çocukken','quando criança']],expr:[['Eskiden çok okurdum.','Eu costumava ler muito.'],['Artık erken kalkıyorum.','Agora acordo cedo.'],['Çocukken burada yaşardım.','Quando criança, morava aqui.']],sentences:['Eskiden her gün gazete okurdum.','Çocukken sokakta oynardık.','Artık toplu taşıma kullanıyorum.','Önceden kahve içmezdim.','Hayatım son yıllarda çok değişti.'],grammar:['Hábito passado usa aoristo + passado: <b>-rdi</b>.','Negativo: <b>-mazdı/-mezdi</b>.','<b>eskiden</b> contrasta com <b>artık</b>.']},
  {id:331,title:'Yapmam Gerekiyor',emoji:'✅',objective:'Expresse obrigação, proibição e ausência de necessidade',focus:'gerekiyor · zorunda · yasak',stage:'A2 · Gereklilik',verbs:['gerekmek','zorunda olmak','izin vermek','yasaklamak'],words:[['zorunlu','obrigatório'],['yasak','proibido'],['izin','permissão'],['gerekli','necessário'],['gereksiz','desnecessário'],['kural','regra'],['sorumluluk','responsabilidade'],['serbest','permitido / livre']],expr:[['Gitmem gerekiyor.','Preciso ir.'],['Erken gelmek zorundayım.','Sou obrigado a vir cedo.'],['Yapmana gerek yok.','Você não precisa fazer.']],sentences:['Burada sigara içmek yasak.','Kimliğinizi göstermeniz gerekiyor.','Bugün çalışmak zorunda değilim.','Önceden rezervasyon yapmalısınız.','Bu formu doldurmana gerek yok.'],grammar:['Necessidade: verbo nominal + <b>gerekiyor</b>.','Obrigação forte: <b>zorunda</b> + pessoa.','“Não precisa”: <b>-mana/-mene gerek yok</b>.']},
  {id:332,title:'İş Yerinde',emoji:'💼',objective:'Participe de conversas profissionais e escreva mensagens curtas',focus:'registro profissional · rica',stage:'A2 · İş Türkçesi',verbs:['toplantı yapmak','sunmak','göndermek','ertelemek'],words:[['toplantı','reunião'],['proje','projeto'],['rapor','relatório'],['son tarih','prazo final'],['müşteri','cliente'],['meslektaş','colega'],['görev','tarefa'],['sunum','apresentação']],expr:[['Dosyayı gönderebilir misiniz?','Pode enviar o arquivo?'],['Toplantıyı ertelememiz gerekiyor.','Precisamos adiar a reunião.'],['Bilginize sunarım.','Para sua informação (formal).']],sentences:['Toplantı saat onda başlayacak.','Raporu cuma gününe kadar bitirmeliyiz.','Müşteri yeni bir teklif istedi.','Sunumu ben hazırlayacağım.','E-postanıza en kısa sürede cevap vereceğim.'],grammar:['Pedidos profissionais preferem <b>-ebilir misiniz</b>.','Prazo usa <b>-e kadar</b>.','Intenção/compromisso usa futuro com primeira pessoa.']},
  {id:333,title:'Bence Haklısın, Fakat…',emoji:'🗣️',objective:'Discorde com educação e sustente sua opinião',focus:'fakat · ancak · rağmen',stage:'A2 · Tartışma',verbs:['savunmak','itiraz etmek','açıklamak','ikna etmek'],words:[['görüş','opinião'],['neden','motivo'],['örnek','exemplo'],['avantaj','vantagem'],['dezavantaj','desvantagem'],['fakat','porém'],['rağmen','apesar de'],['kesinlikle','definitivamente']],expr:[['Seni anlıyorum, fakat katılmıyorum.','Entendo você, porém não concordo.'],['Bunun iki nedeni var.','Há duas razões para isso.'],['Bana göre avantajı daha fazla.','Na minha visão, há mais vantagens.']],sentences:['Fikir ilginç, ancak pahalı.','Yağmura rağmen dışarı çıktık.','Bence bu çözüm daha pratik.','Sana kısmen katılıyorum.','Örneğin toplu taşıma daha ucuz.'],grammar:['<b>fakat/ancak</b> contrastam duas ideias.','<b>-e rağmen</b> significa “apesar de”.','Opiniões podem começar com bence, bana göre ou fikrimce.']},
  {id:334,title:'Doğa İçin Ne Yapabiliriz?',emoji:'🌿',objective:'Fale sobre problemas ambientais e proponha soluções',focus:'passiva · öneri · amaç',stage:'A2 · Dünya',verbs:['korumak','geri dönüştürmek','azaltmak','tasarruf etmek'],words:[['çevre','meio ambiente'],['atık','resíduo'],['geri dönüşüm','reciclagem'],['kirlilik','poluição'],['enerji','energia'],['kaynak','recurso'],['iklim','clima'],['çözüm','solução']],expr:[['Daha az plastik kullanmalıyız.','Devemos usar menos plástico.'],['Su tasarrufu yapmak önemli.','Economizar água é importante.'],['Atıklar geri dönüştürülüyor.','Os resíduos são reciclados.']],sentences:['Çevreyi korumak hepimizin sorumluluğu.','Evde çöpleri ayırıyoruz.','Toplu taşıma kullanarak kirliliği azaltabiliriz.','Enerji tasarrufu için ışıkları kapatın.','Bu bölgede ağaçlar dikiliyor.'],grammar:['Proposta coletiva usa <b>-malıyız/-meliyiz</b>.','Finalidade usa <b>için</b>.','Processos ambientais aparecem muito na passiva.']},
  {id:335,title:'Dijital Hayat',emoji:'📱',objective:'Converse sobre tecnologia, mídia e hábitos digitais',focus:'enquanto · desde · frequência',stage:'A2 · Teknoloji',verbs:['paylaşmak','indirmek','yüklemek','takip etmek'],words:[['uygulama','aplicativo'],['hesap','conta'],{en:'şifre',pt:'senha'},['bildirim','notificação'],['içerik','conteúdo'],['ekran','tela'],['bağlantı','conexão'],['gizlilik','privacidade']],expr:[['İnternet bağlantısı kesildi.','A conexão caiu.'],['Şifremi unuttum.','Esqueci minha senha.'],['Bildirimleri kapattım.','Desativei as notificações.']],sentences:['Bu uygulamayı iki yıldır kullanıyorum.','Sosyal medyada çok zaman geçiriyorum.','Video yüklerken bağlantı kesildi.','Gizlilik ayarlarını değiştirdim.','Ekrana bakmak yerine kitap okuyorum.'],grammar:['“Há X tempo” usa <b>-dir</b>: iki yıldır.','Simultaneidade usa <b>-ken</b>: yüklerken.','Preferência contrastiva usa <b>yerine</b>: yerine kitap.']},
  {id:336,title:'A2 Görevi: Yeni Bir Şehir',emoji:'🎓',objective:'Integre o A2 planejando, narrando e defendendo uma escolha',focus:'projeto final A2',stage:'A2 · Final',verbs:['araştırmak','planlamak','önermek','değerlendirmek'],words:[['rota','rota'],{en:'bütçe',pt:'orçamento'},['konaklama','hospedagem'],['etkinlik','atividade / evento'],['ulaşım','transporte'],['öneri','sugestão'],['deneyim','experiência'],['tercih','preferência']],expr:[['Bu şehri seçmemin nedeni…','A razão de escolher esta cidade…'],['Vaktimiz olursa…','Se tivermos tempo…'],['Bence en iyi seçenek…','Na minha opinião, a melhor opção…']],sentences:['Üç günlük bir gezi planladım.','Daha önce gitmediğim bir şehir seçtim.','Bütçemiz sınırlı olduğu için trenle gideceğiz.','Vaktimiz olursa müzeyi ziyaret ederiz.','Bence bu rota hem ucuz hem ilginç.'],grammar:['Combine razão, condição e comparação em um mesmo discurso.','Use passado para experiências e futuro para o plano.','Feche com opinião sustentada por pelo menos dois motivos.']}
];

function buildTurkishA2Lesson(b,index){
  const vocab=b.words.map(w=>Array.isArray(w)?{en:w[0],pt:w[1]}:{en:w.en,pt:w.pt});
  const expressions=b.expr.map(([expr,meaning])=>({expr,meaning,example:expr}));
  const quiz=vocab.slice(0,4).map((v,i)=>({q:`“${v.pt}” em turco é:`,a:v.en,opts:[v.en,...vocab.filter(x=>x.en!==v.en).slice(i+1,i+4).map(x=>x.en)].slice(0,4)}));
  return {...b,vocab,expressions,quiz,speak:b.sentences.slice(0,4),grammar:{title:b.focus,rules:b.grammar,table:{headers:['Estrutura','Uso'],rows:b.grammar.map((r,i)=>[`Padrão ${i+1}`,r.replace(/<[^>]+>/g,'')])}},duration:'30 min',order:25+index,lang:'tr',course:'turkish'};
}
LESSONS_TR.push(...TURKISH_A2_BLUEPRINTS.map(buildTurkishA2Lesson));

const TURKISH_LESSON_META = [
  ['Cumprimente e se apresente em situações reais','Merhaba · nasılsın · teşekkürler','Başlangıç'],
  ['Leia as letras especiais sem sotaque inglês','ç · ş · ğ · ı · ö · ü','Başlangıç'],
  ['Diga quem você é e de onde vem','pessoa + terminação nominal','Başlangıç'],
  ['Use números em idade, preço e telefone','números + substantivo singular','Başlangıç'],
  ['Apresente sua família e fale de posse','sufixos possessivos','Temel'],
  ['Descreva uma rotina simples','presente contínuo -iyor','Temel'],
  ['Fale do que come, bebe e prefere','acusativo definido','Temel'],
  ['Faça um pedido completo em um café','pedidos educados','Temel'],
  ['Peça e compreenda direções','-de · -e · -den','Günlük Hayat'],
  ['Pergunte preço, cor e tamanho','var · yok · mı','Günlük Hayat'],
  ['Combine horários e compromissos','horas e calendário','Günlük Hayat'],
  ['Resolva situações básicas de viagem','destino + intenção','Günlük Hayat'],
  ['Converse sobre o clima de hoje e amanhã','adjetivos + olacak','Günlük Hayat'],
  ['Descreva sua casa e a posição dos objetos','üstünde · altında · yanında','Günlük Hayat'],
  ['Explique sintomas e entenda conselhos','-meli/-malı · gerekiyor','Günlük Hayat'],
  ['Use metrô, ônibus e ferry com segurança','binmek · inmek · -la','Yolculuk'],
  ['Faça check-in e resolva problemas no hotel','-(y)ebilir · pedidos','Yolculuk'],
  ['Conte o que fez ontem','passado -di','Zamanlar'],
  ['Fale de planos para amanhã','futuro -ecek/-acak','Zamanlar'],
  ['Converse sobre hobbies e preferências','-meyi sevmek','Sohbet'],
  ['Peça ajuda em uma emergência','imperativo formal','Yolculuk'],
  ['Use expressões sociais da cultura turca','passiva cotidiana','Kültür'],
  ['Expresse opinião, causa e resultado','çünkü · ama · bu yüzden','Sohbet'],
  ['Integre todo o A1 em um dia em Istambul','revisão comunicativa','Final']
];

LESSONS_TR.forEach((lesson,index)=>{
  const meta=TURKISH_LESSON_META[index]||[];
  lesson.objective=meta[0]||lesson.objective||'';
  lesson.focus=meta[1]||lesson.focus||'';
  lesson.stage=meta[2]||lesson.stage||'Türkçe A1';
  lesson.duration=lesson.duration||(index<4?'20 min':'25 min');
  lesson.order=index+1;
});

if (typeof window !== 'undefined') window.LESSONS_TR = LESSONS_TR;
