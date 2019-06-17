import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as math from 'mathjs';
@Component({
  selector: 'euler',
  templateUrl: './euler.component.html',
  styleUrls: ['./euler.component.css']
})
export class EulerComponent implements OnInit {

  x0: number;
  a: number;
  b: number;
  h: number; 
  n = 0;
  mathFunctions: any;
  userFunciones: string;
  
  puntosEuler: number[];
  puntosEulerMejorado: number[];
  graficoEuler: Chart;
  

 
  
  constructor() { }

  ngOnInit() {

  }
  funcion() {
    const parser = math.parser();
    parser.eval(`f(t, x) = ${this.userFunciones}` );
    this.mathFunctions = parser;
  }


  metodoEuler() {
    this.agregarPuntosEuler(this.a, this.x0);
    const a = this.a;
    const h = this.h;
    const n = this.n;
    for ( let t = a + h, k = a; t <= n * h + a; t += h, k += h ) {
        this.agregarPuntosEuler(
          t,
          this.puntosEuler[k] + (h * this.mathFunctions.eval(`f(${k}, ${this.puntosEuler[k]})`))
        );
    }
  }

  calcularH() {
    this.h = (this.b - this.a)/(this.n)
  }

  
  

  

  

  agregarPuntosEulerMejorado(t, x) { this.puntosEulerMejorado[t] = x; }

  metodoEulerMejorado() {
    this.agregarPuntosEulerMejorado(this.a, this.x0);
    const a = this.a;
    const h = this.h;
    const n = this.n;

    for ( let t = a + h, k = a; t <= n * h + a; t += h, k += h) {
        const previousTvalue = k;
        const previousXvalue = this.puntosEuler[k];

        const predictor = previousXvalue + h * this.mathFunctions.eval(`f(${previousTvalue}, ${previousXvalue})`);
        const corrector =
              previousXvalue +
              h * 0.5 * (this.mathFunctions.eval(`f(${previousTvalue}, ${previousXvalue})`) +
              this.mathFunctions.eval(`f(${t}, ${predictor})`));


        this.agregarPuntosEulerMejorado(
          t, 
          corrector
        );
    }
  }

  dibujarEuler() {
    this.graficoEuler = new Chart('euler', {
      type: 'line',
      data: {
        labels: this.puntosEuler.map((value, index) => index),
        datasets: this.generarDatos()
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [ {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Eje t',
            },
          }],
          yAxes: [ {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Eje x'
            },
          }]
        }
      }
    });
  }

  

  puntosLineas(map, borderColor,backgroundColor, label) {
    return {
      data: this.generarPuntosGrafico(map),
      borderColor,
      backgroundColor,
      label,
      fill: false,
    };
  }

  generarPuntosGrafico(map) {
    const puntos = [];
    map.forEach((value, index) =>  {
      if(index <= this.b) {
        puntos.push({
          x: index,
          y: value
        });  
      }      
    });

    return puntos;
  }

  encontrarPuntosGrafico() {
    this.metodoEuler();
    this.metodoEulerMejorado();
  }
  
  reiniciar() {
    this.graficoEuler = new Chart('euler', {type: 'line', data: {}});
    this.puntosEuler = [];
    this.puntosEulerMejorado = [];
  }

  generarDatos() {
    return [
      this.puntosLineas(this.puntosEuler, 'blue','blue', 'EULER'),
      this.puntosLineas(this.puntosEulerMejorado, 'red','red', 'EULER MEJORADO'),
    ];
  }
  
  agregarPuntosEuler(t, x) { this.puntosEuler[t] = x; }

  ejecutar() {
    this.reiniciar();
    this.calcularH();
    this.funcion();
    this.encontrarPuntosGrafico();
    this.dibujarEuler();
  }
}
