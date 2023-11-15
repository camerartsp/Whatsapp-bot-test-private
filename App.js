const fs = require('fs');
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Cliente está pronto!');
});

client.on('message', async message => {
    const chat = await message.getChat();
    if (chat.isGroup && chat.name === 'TURMA DVF 300/2023') {
        if(message.hasMedia) {
            const media = await message.downloadMedia();
            if (media.mimetype.includes('image')) {
                fs.writeFileSync(`imagens/${message.id._serialized}.${media.mimetype.split('/')[1]}`, media.data, 'base64');
            } else if (media.mimetype.includes('video')) {
                fs.writeFileSync(`videos/${message.id._serialized}.${media.mimetype.split('/')[1]}`, media.data, 'base64');
            } else if (media.mimetype.includes('application/pdf')) {
                fs.writeFileSync(`pdfs/${message.id._serialized}.pdf`, media.data, 'base64');
            }
        } else {
            fs.appendFileSync('mensagens.txt', `${message.body}\n`);
        }
        if(message.body === '!atividades') {
            let atividades;
            try {
                atividades = fs.readFileSync('atividades.txt', 'utf8');
            } catch (err) {
                atividades = 'Desculpe, não foi possível encontrar as atividades.';
            }
            message.reply(`Aqui estão suas atividades: ${atividades}`);
        } else if(message.body === '!mídias') {
            let midias;
            try {
                midias = fs.readFileSync('midias.txt', 'utf8');
            } catch (err) {
                midias = 'Desculpe, não foi possível encontrar as mídias.';
            }
            message.reply(`Aqui estão suas mídias: ${midias}`);
        } else if(message.body === '!fotos') {
            let fotos;
            try {
                fotos = fs.readFileSync('fotos.txt', 'utf8');
            } catch (err) {
                fotos = 'Desculpe, não foi possível encontrar as fotos.';
            }
            message.reply(`Aqui estão suas fotos: ${fotos}`);
        } else if(message.body === '!pdfs') {
            let pdfs;
            try {
                pdfs = fs.readFileSync('pdfs.txt', 'utf8');
            } catch (err) {
                pdfs = 'Desculpe, não foi possível encontrar os PDFs.';
            }
            message.reply(`Aqui estão seus PDFs: ${pdfs}`);
        }
    }
});

client.initialize();
