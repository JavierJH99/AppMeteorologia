import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'prediccion',
  templateUrl: './prediccion.component.html',
  styleUrls: ['./prediccion.component.scss']
})
export class PrediccionComponent implements OnInit {
  @Input() prediccion:any;
  constructor() { }

  ngOnInit(): void {
  }

}
