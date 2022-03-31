export class PointOfSchedule {
  id?: number;
  nameStation: String | undefined;
  arrivalTime: string | undefined;
  arrivalTimeInit?:string;
  departureTime?: string;
  departureTimeInit?:string;
  delayed?: string;
}
