import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { Transacao } from './extrato.interfaces';
import { ExtratoService } from './extrato.service';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss'],
})
export class ExtratoComponent implements OnInit {
  //Tipagem
  transacoes!: Transacao[];

  estaCarregando!: boolean;
  erroNoCarregamento!: boolean;

  /*
   Importe, e depois instancia dentro do constructor: ExtratoService do serviço (extrato.service.ts):
  extratoService: any;
   */

  /*
    #Services e Injeção de Dependência

    - Depedência injetada pelo Injector do Angular:
    constructor(private extratoService: ExtratoService) {}

    - Uma vez injetada, a dependência torna-se disponível para ser utilizada pelo Component:
    ngOnInit(): void {
    this.transacoes = this.extratoService.getTransacoes();
     }

     Dentro do constructor, ela tem tanta outra service de back end tanto a service de log.
     Pode ter diversas injeções para uma mesma service no constructor:

     constructor(private backend: BackendService, private logger: Logger) {}

  */
  constructor(private extratoService: ExtratoService) {}

  ngOnInit(): void {
    //Chamar a função
    this.carregarExtrato();
  }

  carregarExtrato(){
    //Quanto estive carregando é true - irá aparecer spinner
    this.estaCarregando = true;
    this.erroNoCarregamento = false;
    /*
    Observable; retornar um objetivo tipo observable o objeto que pode
    observar quando tiver a resposta, quando completado conseguir pegar
    o retorno.
    */
    this.extratoService
      .getTransacoes()
      .pipe(
        finalize(() =>
          //Quando terminar de carregar é false - irá sumir o spinner.
          this.estaCarregando = false)
      )

      /*
      - inscrever nesse objeto, observar o objeto quando vai terminar.
      - response; quando tiver a resposta faz alguma coisa
      */
      .subscribe(
        response => this.onSucesso(response),
        error => this.onError(error),

      );
  }

  onSucesso(response: Transacao[]){

     this.transacoes = response;
  }

  onError(error: any){
    this.erroNoCarregamento = true;
    console.error(error);
  }
}