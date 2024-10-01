import { Component, Input, OnInit } from '@angular/core';
import { Puntaje } from '../../Interfaces/IPuntaje';
import { FechaPipe } from '../../pipes/fecha.pipe';

@Component({
  selector: 'app-table-puntajes',
  standalone: true,
  imports: [FechaPipe],
  templateUrl: './table-puntajes.component.html',
  styleUrl: './table-puntajes.component.css'
})
export class TablePuntajesComponent implements OnInit{

  @Input() listadoPuntajes!:Puntaje[];

  public esPuntaje = false;
  public esFecha = false;
  
  ngOnInit(): void {

  }

  ordernarPuntaje(){
    this.esPuntaje = !this.esPuntaje;
    if(this.esPuntaje){
      this.listadoPuntajes.sort((p1 ,p2)=> p1.puntaje - p2.puntaje);
    }else{
      this.listadoPuntajes.sort((p1 ,p2)=> p2.puntaje - p1.puntaje);
    }
  }
  
  ordernarFecha(){
    this.esFecha = !this.esFecha;
    if(this.esFecha){
      this.listadoPuntajes.sort((p1 ,p2)=> p1.fecha.valueOf() - p2.fecha.valueOf())
    }else{
      this.listadoPuntajes.sort((p1 ,p2)=> p2.fecha.valueOf() - p1.fecha.valueOf())
    }
  }
}
