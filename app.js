function sortear() {
    let quantidade = parseInt(document.getElementById('quantidade').value, 10);
    let de = parseInt(document.getElementById('de').value, 10);
    let ate = parseInt(document.getElementById('ate').value, 10);

    const resultado = document.getElementById('resultado');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnSortear = document.getElementById('btn-sortear');

    
    if (Number.isNaN(quantidade) || Number.isNaN(de) || Number.isNaN(ate)) {
        resultado.innerHTML = `<label class="texto__paragrafo">Preencha corretamente os 3 campos antes de sortear.</label>`;
        return;
    }
    if (quantidade < 1) {
        resultado.innerHTML = `<label class="texto__paragrafo">Quantidade deve ser pelo menos 1.</label>`;
        return;
    }

    
    if (de > ate) {
        [de, ate] = [ate, de];
    }

    const rangeSize = ate - de + 1;
    if (quantidade > rangeSize) {
        resultado.innerHTML = `<label class="texto__paragrafo">Erro: o intervalo de ${de} a ${ate} contém apenas ${rangeSize} valores únicos — você pediu ${quantidade}. Aumente o intervalo ou diminua a quantidade.</label>`;
        return;
    }

   
    btnReiniciar.disabled = true;
    btnReiniciar.classList.add('container__botao-desabilitado');
    btnReiniciar.classList.remove('container__botao');

    btnSortear.disabled = true;
    btnSortear.classList.add('container__botao-desabilitado');
    btnSortear.classList.remove('container__botao');

    resultado.innerHTML = `<label class="texto__paragrafo">Sorteando números...</label>`;

    function tocarSom() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = 800;
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
    }

   
    function tocarSomFinal() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.frequency.linearRampToValueAtTime(1760, ctx.currentTime + 0.4);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {  }
    }

    
    let sorteados = [];
    let i = 0;
    const MAX_ATTEMPTS_PER_NUMBER = 5000; 
    const intervalo = setInterval(() => {
        
        let numero = obterNumeroAleatorio(de, ate);
        let attempts = 0;
        while (sorteados.includes(numero) && attempts < MAX_ATTEMPTS_PER_NUMBER) {
            numero = obterNumeroAleatorio(de, ate);
            attempts++;
        }

        if (attempts >= MAX_ATTEMPTS_PER_NUMBER) {
            
            clearInterval(intervalo);
            resultado.innerHTML = `<label class="texto__paragrafo">Erro ao gerar número único — tente novamente ou aumente o intervalo.</label>`;

            btnReiniciar.disabled = false;
            btnReiniciar.classList.remove('container__botao-desabilitado');
            btnReiniciar.classList.add('container__botao');

            btnSortear.disabled = false;
            btnSortear.classList.remove('container__botao-desabilitado');
            btnSortear.classList.add('container__botao');
            return;
        }
 
        sorteados.push(numero);
        tocarSom(); 

        
        const html = sorteados
            .map((n, idx) => idx === sorteados.length - 1 ? `<span class="numero-destaque">${n}</span>` : n)
            .join(', ');
        resultado.innerHTML = `<label class="texto__paragrafo">Números sorteados: ${html}</label>`;

        i++;
        if (i >= quantidade) {
            clearInterval(intervalo);

            
            tocarSomFinal();

            btnReiniciar.disabled = false;
            btnReiniciar.classList.remove('container__botao-desabilitado');
            btnReiniciar.classList.add('container__botao');

            btnSortear.disabled = false;
            btnSortear.classList.remove('container__botao-desabilitado');
            btnSortear.classList.add('container__botao');
        }
    }, 300);
}


function obterNumeroAleatorio (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function alterarStatusBotao() {
   let botao = document.getElementById('btn-reiniciar');
   if (botao.classList.contains('container__botao-desabilitado')) {
        botao.classList.remove('container__botao-desabilitado');
        botao.classList.add('container__botao');
} else {
    botao.classList.remove('container__botao');
    botao.classList.add('container__botao-desabilitado');
   }
}

function reiniciar() {
    document.getElementById('quantidade').value = '';
    document.getElementById('de').value = '';
    document.getElementById('ate').value = '';
    document.getElementById('resultado').innerHTML = '<label class="texto__paragrafo">Números sorteados: nenhum até agora</label>';
    alterarStatusBotao();
}

function verificarCamposPreenchidos() {
    const quantidade = document.getElementById('quantidade').value.trim();
    const de = document.getElementById('de').value.trim();
    const ate = document.getElementById('ate').value.trim();
    
    const todosPreenchidos = quantidade !== '' && de !== '' && ate !== '';

    document.getElementById('btn-sortear').disabled = !todosPreenchidos;
    document.getElementById('btn-reiniciar').disabled = !todosPreenchidos;
}

function configurarEnter() {
    const campos = ['quantidade', 'de', 'ate'];
    
    campos.forEach((id, index) => {
        const campo = document.getElementById(id);
        campo.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                const proximoCampo = campos.find(cid => document.getElementById(cid).value.trim() === '');
                
                if (proximoCampo && proximoCampo !== id) {
                    
                    document.getElementById(proximoCampo).focus();
                } else {
                    const botaoSortear = document.getElementById('btn-sortear');
                    if (!botaoSortear.disabled) sortear();
                }
            }
        });
    });
}

['quantidade', 'de', 'ate'].forEach(id => {
    document.getElementById(id).addEventListener('input', verificarCamposPreenchidos);
});


configurarEnter();
verificarCamposPreenchidos();