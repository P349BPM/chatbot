// bot.js
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();

const SITE_LINK = 'https://www.adrenalinapolicial.com';
const PURCHASE_LINK = 'https://www.adrenalinapolicial.com/checkout';

// Planos
const PLANS = {
    '1': { // Mudei para 1, 2, 3 para não conflitar com menu
        id: '3meses',
        title: 'PLANO 3 MESES',
        price: 399.00,
        features: [
            'Material completo atualizado',
            'Podcast interativo',
            'Organizador de estudos',
            'Cronograma personalizado',
            'Aulas AO VIVO quinzenais',
            'Simulados com correção',
            'Suporte via WhatsApp'
        ]
    },
    '2': {
        id: '6meses',
        title: 'PLANO 6 MESES',
        price: 599.00,
        features: [
            'Tudo do plano 3 meses',
            'Preparação TAF completa',
            'Acompanhamento físico',
            'Metas de evolução'
        ]
    },
    '3': {
        id: '12meses',
        title: 'PLANO 12 MESES',
        price: 799.00,
        features: [
            'Tudo do plano 6 meses',
            'Conteúdo PP-MG e PMMG',
            'Assessoria TAF com oficial especialista',
            'Preparação física com multicampeão',
            'Fardamento para primeiros colocados'
        ]
    }
};

const delay = ms => new Promise(res => setTimeout(res, ms));

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot conectado!');
});

client.initialize();

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

client.on('message', async msg => {
    try {
        const body = (msg.body || '').trim();
        const lower = body.toLowerCase();

        const contact = await msg.getContact();
        const userName = contact.pushname || contact.name || 'futuro aprovado';

        // Menu principal - agora só responde a palavras-chave específicas
        if (lower.match(/^(oi|ola|olá|iniciar|start|quero começar)$/i)) {
            const chat = await msg.getChat();
            await chat.sendStateTyping();
            await delay(1000);

            const welcome = `Olá ${userName.split(' ')[0]}! 👋

*Bem-vindo à Família Adrenalina!* 🛡️

Aqui você será acolhido por uma equipe que realmente conhece os concursos militares - todos nós já passamos pelas provas e sabemos exatamente o que você precisa!

Temos um *Oficial* que coordena toda a programação e conteúdo, e um *Oficial Especialista em TAF e Multicampeão* em diversas modalidades físicas para te acompanhar.

É uma metodologia inovadora que te ensina a estudar da forma certa!

*Escolha uma opção:*

1 - Conhecer os Planos
2 - Como Funciona Nossa Metodologia  
3 - Falar com Nossa Equipe
4 - Visitar Site Oficial`;

            await client.sendMessage(msg.from, welcome);
            return;
        }

        // Opção 1 - Planos (MENU)
        if (lower === '1') {
            const chat = await msg.getChat();
            await chat.sendStateTyping();
            await delay(800);

            const planText = `💵 *INVESTIMENTO PARA SUA APROVAÇÃO*

Aqui na Família Adrenalina, cada plano foi pensado com carinho:

🟢 *PLANO 3 MESES* - ${formatCurrency(PLANS['1'].price)}
🟣 *PLANO 6 MESES* - ${formatCurrency(PLANS['2'].price)}  
🟤 *PLANO 12 MESES* - ${formatCurrency(PLANS['3'].price)}

*Para ver detalhes de cada plano digite:*
🔸 11 - Plano 3 Meses
🔸 22 - Plano 6 Meses  
🔸 33 - Plano 12 Meses

Ou visite: ${SITE_LINK}`;

            await client.sendMessage(msg.from, planText);
            return;
        }

        // Planos específicos (11, 22, 33)
        if (['11', '22', '33'].includes(body)) {
            let planKey = '';
            let planName = '';
            
            if (body === '11') {
                planKey = '1';
                planName = '3 MESES';
            } else if (body === '22') {
                planKey = '2'; 
                planName = '6 MESES';
            } else if (body === '33') {
                planKey = '3';
                planName = '12 MESES';
            }
            
            const plan = PLANS[planKey];
            const chat = await msg.getChat();
            await chat.sendStateTyping();
            await delay(800);

            let personalMessage = '';
            if (body === '11') {
                personalMessage = `✨ *Perfeito para sua reta final!*\nCom 3 meses de preparo conosco, você chega na prova com confiança total!`;
            } else if (body === '22') {
                personalMessage = `🎯 *Preparação completa!*\nTempo ideal para evoluir em todas as matérias com nosso acompanhamento especializado!`;
            } else {
                personalMessage = `🏆 *A jornada definitiva!*\nCom assessoria TAF do nosso *Oficial Especialista e Multicampeão* em diversas modalidades físicas!`;
            }

            const planDetails = `🛡️ *PLANO ${planName}*

${personalMessage}

*O que você recebe:*
${plan.features.map(feat => `✅ ${feat}`).join('\n')}

💵 *Investimento:* ${formatCurrency(plan.price)}

${body === '33' ? '\n*Inclui assessoria completa com nosso Oficial Especialista em TAF e Multicampeão em diversas modalidades físicas!*' : ''}

*Quer fazer parte da Família Adrenalina?*
➡️ ${SITE_LINK}

*Digite 1 para voltar aos planos*`;

            await client.sendMessage(msg.from, planDetails);
            return;
        }

        // Opção 2 - Como Funciona (MENU)
        if (lower === '2') {
            const chat = await msg.getChat();
            await chat.sendStateTyping();
            await delay(800);

            const howText = `🎯 *NOSSA METODOLOGIA EXCLUSIVA*

Aqui na Adrenalina não é só sobre conteúdo, é sobre *transformação*!

Nossa equipe é formada por:
• 👮‍♂️ *Oficial* responsável por toda programação e conteúdo
• 💪 *Oficial Especialista em TAF e Multicampeão* em diversas modalidades físicas
• 🎓 *Aprovados* que já viveram essa jornada

*O que fazemos diferente:*
✅ Te ensinamos *COMO* estudar, não apenas o que estudar
✅ Mentorias ao vivo que realmente fazem diferença  
✅ Acompanhamento humanizado
✅ Metodologia testada e aprovada

*Somos uma família, não apenas um curso!*

Digite 1 para ver os planos ou 4 para visitar nosso site`;

            await client.sendMessage(msg.from, howText);
            return;
        }

        // Opção 3 - Atendente (MENU)
        if (lower === '3') {
            await client.sendMessage(msg.from, `👨‍💼 *Fale com Nossa Equipe!*\n\nÀs vezes, nada substitui uma conversa humana, né?\n\nNossa equipe de especialistas está aqui para:\n• Tirar TODAS suas dúvidas\n• Te ajudar a escolher o plano ideal\n• Contar nossa experiência pessoal\n• Te acolher na Família Adrenalina!\n\nVisite nosso site: ${SITE_LINK}\n\n*Ou se preferir*, me conte sua dúvida que eu já vou te dando uma orientação! 😊`);
            return;
        }

        // Opção 4 - Site (MENU)
        if (lower === '4') {
            await client.sendMessage(msg.from, `🌐 *NOSSO SITE OFICIAL*\n\n${SITE_LINK}\n\nLá você vai conhecer:\n• Nossa história e missão\n• Depoimentos reais de aprovados\n• Todos os planos detalhados\n• Conteúdos gratuitos para você começar\n\n*Venha fazer parte da Família Adrenalina!* 🛡️`);
            return;
        }

        // Compra
        if (lower.startsWith('comprar')) {
            await client.sendMessage(msg.from, `🎉 *Que notícia incrível!*\n\nEstamos muito felizes por você querer fazer parte da *Família Adrenalina*!\n\nPara escolher seu plano ideal, visite:\n${SITE_LINK}\n\n*Ou digite 1 para ver os planos disponíveis!* 🛡️`);
            return;
        }

        // Fallback - mais direto
        await client.sendMessage(msg.from, `😊 *Estamos aqui para te ajudar!*\n\n*Escolha uma opção:*\n\n1 - Ver Planos\n2 - Como Funciona\n3 - Falar com Equipe\n4 - Visitar Site\n\n*Juntos vamos conquistar sua aprovação!* 🛡️`);

    } catch (err) {
        console.error('Erro:', err);
    }
});