class CalcControler{
    constructor(){
        this._audio = new Audio('click.mp3'); // Atributo que armazena o áudio
        this._ultimoOperador = ''; // Atributo que armazena o último operador
        this._ultimoNumero = ''; // Atributo que armazena o último número
        this._audioOnOff = false; // Atributo que armazena o estado do áudio
        this._local="pt-BR"; // Atributo que armazena o local "pt-BR
        this._dataAtualCalculadora; // Atributo que armazena a data atual
        this._displayCalculadoraElemento= document.querySelector("#display");
        this._dataElemento = document.querySelector("#data");
        this._horaElemento = document.querySelector("#hora");
        this.inicializar(); // Método que inicia a calculadora
        this.initButtonsEvents(); // Método que inicia os eventos dos botões
        this.initTeclado(); // Método que inicia o teclado
        this._operacao = [];

    }



    inicializar(){
        this.setDisplayDataHora();
        setInterval(() => {
             this.setDisplayDataHora();
        }, 1000);
    
        this.colarDaAreaTransferencia();
        document.querySelectorAll(".btn-ac").forEach(btn => {
            btn.addEventListener("dblclick", e => {
                this.onOffAudio();
            });
        });


    }

    onOffAudio(){
        this._audioOn = !this._audioOn;
    }
    playAudio(){
        if(this._audioOn){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }


    addEventListenerAll(elementos, eventos, fn){
        eventos.split(' ').forEach(evento => {
            elementos.addEventListener(evento, fn, false);
        });

    
    }
    
    limpaTudo(){
        this._operacao = [];
        this._ultimoNumero = '';
        this._ultimoOperador = '';
        this.setUltimoDisplay();
    }
    LimpaEntrada(){
        this._operacao.pop();

        this.setUltimoDisplay();
    }   
   
    setError(){
        this.displayCalculadora = "Error";
    }
    isOperador(valor){
        return (['+','-','*','/','%'].indexOf(valor) > -1);
    }

    setUltimoOperador(valor){
        this._operacao[this._operacao.length-1] = valor;
    }
    getUltimoOperador(){
        
        return this._operacao[this._operacao.length-1];
    }

    pushOperacao(valor){
        this._operacao.push(valor);
        if(this._operacao.length > 3){
            
            this.calc();
        }
    }
    getUltimoItem(isOperador=true){
        let ultimoItem;
        for(let i = this._operacao.length-1; i >= 0; i--){
            if(this.isOperador(this._operacao[i]) == isOperador){
                ultimoItem = this._operacao[i];
                break;
            }
        }
        if(!ultimoItem){
            ultimoItem = (isOperador) ? this._ultimoOperador : this._ultimoNumero;
        }
        return ultimoItem;
    }

    setUltimoDisplay(){
        
        let ultimoNumero = this.getUltimoItem(false);
        if(!ultimoNumero) ultimoNumero = 0;
        this.displayCalculadora = ultimoNumero;
    }
    getResultado(){
        try{
            return eval(this._operacao.join(""));
        }
        catch(e){
            setTimeout(() => {
                this.setError();
            }, 1);
        }
    }

    calc(){
        let ultimo = '';
        this._ultimoOperador = this.getUltimoItem();
        if(this._operacao.length < 3){
            let primeiroItem = this._operacao[0];
            this._operacao = [primeiroItem,this._ultimoOperador,this._ultimoNumero];
        }

        if(this._operacao.length > 3) {
            ultimo = this._operacao.pop();
            this._ultimoNumero = this.getResultado();
            
        }else if(this._operacao.length == 3){
            this._ultimoNumero = this.getUltimoItem(false);
            
        }
    
        console.log("n",this._ultimoNumero);
        console.log("o",this._ultimoOperador);
        
        let resultado = this.getResultado();
        if(ultimo == "%"){
            resultado /= 100;
            this._operacao = [resultado];
            
        }else{

            this._operacao = [resultado];
            if(ultimo) this._operacao.push(ultimo);
        }

        this.setUltimoDisplay();

    }

    

    addOperacao(valor){
        
        if(isNaN(this.getUltimoOperador())){
            
            if(this.isOperador(valor)){
                
                this.setUltimoOperador(valor);
            }else{
                
                this.pushOperacao(valor);
                this.setUltimoDisplay();
            }

        }else{
            if(this.isOperador(valor)){
                
                this.pushOperacao(valor);
            }else{
                
                let novoValor = this.getUltimoOperador().toString() + valor.toString();
                this.setUltimoOperador(novoValor);

                this.setUltimoDisplay();
            }
        }
    
    }
    
    addPonto(){
        let ultimoOperador= this.getUltimoOperador();
        if(typeof ultimoOperador === "string" && ultimoOperador.split("").indexOf(".") > -1) return;

        console.log("ultimo operador",ultimoOperador);
        if(this.isOperador(ultimoOperador) || !ultimoOperador){
            this.pushOperacao("0.");
        }else{
            this.setUltimoOperador(ultimoOperador.toString() + ".");
        }
        this.setUltimoDisplay();

    }


    execBtn(botao){
        this.playAudio();
        switch(botao){
            case "ac":
                this.limpaTudo();
                break;
            case "ce":
                this.LimpaEntrada();
                break;
            case "soma":
                this.addOperacao("+");
                break;
            case "subtracao":
                this.addOperacao("-");
                break;
            case "divisao":
                this.addOperacao("/");
                break;
            case "multiplicacao":
                this.addOperacao("*");
                break;
            case "porcento":
                this.addOperacao("%");
                break;
            case "igual":
                this.calc();
                break;
            case "ponto":
                this.addPonto(".");
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                
               
                this.addOperacao(parseInt(botao));
                break;
            default:
                this.setError();
                break;
        }
    }

    
    initTeclado(){
        document.addEventListener("keyup", e => {
            this.playAudio();
            
            switch(e.key){
                case "Escape":
                    this.limpaTudo();
                    break;
                case "Backsapce":
                    this.LimpaEntrada();
                    break;
                case "Enter":
                case "=":
                    this.calc();
                    break;
                case ".":
                case ",":
                    this.addPonto(".");
                    break;
                case "+":
                case "-":
                case "/":
                case "*":
                case "%":
                    this.addOperacao(e.key);
                    break;
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperacao(parseInt(e.key));
                    break;
                case "c":
                    if(e.ctrlKey) this.copiarParaAreaTransferencia();
                    break;

            }
        
            
        });
    }

    copiarParaAreaTransferencia(){
        let input = document.createElement("input");
        input.value = this.displayCalculadora;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
        
    }

    colarDaAreaTransferencia(){
        document.addEventListener("paste", e => {
            let texto = e.clipboardData.getData("Text");
            this.displayCalculadora = parseFloat(texto);
        });
    }

    initButtonsEvents(){
        let botoes = document.querySelectorAll("#buttons > g, #parts > g");
        botoes.forEach((btn,index)=> {
            this.addEventListenerAll(btn,"click drag", e => {
                
                let textoBtn =btn.className.baseVal.replace("btn-","");
                this.execBtn(textoBtn);
            });

            this.addEventListenerAll(btn,"mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });

        }); 

    }

    setDisplayDataHora(){
        this.displayData = this.dataAtualCalculadora.toLocaleDateString(this._local);
        this.displayHora = this.dataAtualCalculadora.toLocaleTimeString(this._local);
    }

    // Métodos de acesso aos atributos da classe
    get displayCalculadora(){

        return this._displayCalculadoraElemento.innerHTML;
    }

    set displayCalculadora(valor){
        if(valor.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalculadoraElemento.innerHTML = valor;
    }

    get displayData(){
        return this._dataElemento.innerHTML;
    }

    set displayData(valor){
        this._dataElemento.innerHTML = valor;
    }

    get displayHora(){
        return this._horaElemento.innerHTML;
    }

    set displayHora(valor){
        this._horaElemento.innerHTML = valor;
    }

    get dataAtualCalculadora(){
        return new Date();
    }

    set dataAtualCalculadora(valor){
        this._dataAtualCalculadora = valor;
    }


}