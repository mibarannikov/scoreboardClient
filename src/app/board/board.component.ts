import {Component, OnInit} from '@angular/core';
import {BoardService} from "../service/board.service";
import {Train} from "../model/train";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {PointOfSchedule} from "../model/pointOfSchedule";


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  public arrdep: PointOfSchedule[] = [];
  trains: Train[] = [];
  statuses:string[] =[];
  myControl2 = new FormControl('', Validators.required);
  options2: string[] = [];
  isLoaded: boolean = false;
  st: any;

  constructor(private boardService: BoardService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.boardService.getSearchStations('').subscribe(data => {
      this.options2 = [];
      for (let s of data) {
        this.options2.push(s.nameStation);
      }
    });
  }

  getSchedule() {
    this.st = this.myControl2.value;
    this.getTrainsForSchedule()
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
    this.initSchedule();
    // @ts-ignore
    setInterval(()=>{
      this.initSchedule();
    },3000);
  }

  initSchedule(){
    this.boardService.scheduleUpdate(this.st).subscribe(data => {
      this.arrdep = [];
      this.statuses=[];
      this.trains = data;
      let arrPoint;
      if (this.trains) {
        for (let tr of this.trains) {
          let status='';
          // @ts-ignore
          switch (tr.pointsOfSchedule.find(p => p.nameStation === this.st).delayed) {
            case 'schedule': {
              // @ts-ignore
              if ((new Date(tr.pointsOfSchedule.find(p => p.nameStation === this.st).arrivalTime) < new Date())
                // @ts-ignore
                && (new Date(tr.pointsOfSchedule.find(p => p.nameStation === this.st).departureTime) > new Date())) {
                status = 'Прибыл';
              } else {
                status = 'Ожидается прибытие';
              }
              break;
            }
            case 'running_with_errors': {
              // @ts-ignore
              if ((new Date(tr.pointsOfSchedule.find(p => p.nameStation === this.st).arrivalTime) < new Date())
                // @ts-ignore
                && (new Date(tr.pointsOfSchedule.find(p => p.nameStation === this.st).departureTime) > new Date())) {                status = 'Прибыл';
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
          // @ts-ignore
          this.arrdep.push(tr.pointsOfSchedule.find(p => p.nameStation === this.st));
          this.statuses.push(status);
        }
      }
      this.isLoaded = true;
    });
  }

}
