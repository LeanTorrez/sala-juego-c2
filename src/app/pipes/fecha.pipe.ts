import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'fecha',
  standalone: true
})
export class FechaPipe implements PipeTransform {

  transform(value: any, ...args: any[]): string {

    /* Correjir */
   
    const fecha = new Date(value.seconds * 1000);
    let fechaEscrita = fecha.getDate() + "/" + ( fecha.getMonth() + 1 ) + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":"+fecha.getMinutes();
    return fechaEscrita;

  }
}
