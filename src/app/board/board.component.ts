import { Component, OnInit } from '@angular/core';
import {BoardService} from "../service/board.service";
import {Train} from "../model/train";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {PointOfSchedule} from "../model/pointOfSchedule";
import {MatFormFieldControl} from "@angular/material/form-field";


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  public arrdep!: [{ arr: string | undefined, dep: string | undefined, status: string }] ;
  trains:Train[] = [];
  myControl2 = new FormControl('', Validators.required);
  options2: string[] = [];
  isLoaded:boolean=false;
  st: any;


  constructor(private boardService:BoardService,
              private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.boardService.getSearchStations('').subscribe(data => {
      this.options2 = [];
      for (let s of data) {
        this.options2.push(s.nameStation);
      }
    });
  }

  getSchedule() {
   //  this.isLoaded=false;
   //  setInterval(() => {
   //    console.log(1)
   //    this.boardService.scheduleUpdate().subscribe(data=>{
   //      console.log('-----------',data);
   //      this.trains=data;
   //      this.isLoaded=true;
   //    });
   // }, 1000);

    this.st = this.myControl2.value;
    this.getTrainsForSchedule();
  }

  onInputSchedule(event: Event) {
    // @ts-ignore
    this.boardService.getSearchStations(event.target.value).subscribe(data => {
      this.options2 = [];
      for (let s of data) {
        this.options2.push(s.nameStation);
      }
    });

  }

  private getTrainsForSchedule() {
    this.isLoaded = false;
    // @ts-ignore
    this.arrdep = [];


     setInterval(() => {
       console.log('1');
       this.boardService.scheduleUpdate().subscribe(data=>{
         console.log('-----------------------2');
         this.trains = data;
         console.log(data)
         if (this.trains) {
           for (let tr of this.trains) {
             let arrPoint: PointOfSchedule | undefined = tr.pointsOfSchedule.find(p => p.nameStation === this.myControl2.value);
             // @ts-ignore
             let status;
             console.log('+++++++++',arrPoint?.delayed);
             switch (arrPoint?.delayed) {
               case 'schedule': {
                 // @ts-ignore
                 if ((new Date(arrPoint.arrivalTime) < new Date()) && (new Date(arrPoint.departureTime) > new Date())) {
                   status = 'Прибыл';
                 } else {
                   status = 'Ожидается прибытие';
                 }
                 break;
               }
               case 'running_with_errors': {
                 // @ts-ignore
                 if ((new Date(arrPoint.arrivalTime) < new Date()) && (new Date(arrPoint.departureTime) > new Date())) {
                   status = 'Прибыл';
                 } else {
                   status = 'Задерживается';
                 }
                 break;
               }
               case 'cancel': {
                 status = 'Отменен';
                 break;
               }
               default: {
                 status = "нет информации";
                 break;
               }
             }

             console.log(arrPoint)
             // @ts-ignore
             this.arrdep.push({arr: arrPoint.arrivalTime, dep: arrPoint.departureTime, status: status})
           }
         }
         this.isLoaded = true;
       });
    }, 5000);




  }
}
