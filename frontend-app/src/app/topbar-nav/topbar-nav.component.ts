import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topbar-nav',
  templateUrl: './topbar-nav.component.html',
  styleUrls: ['./topbar-nav.component.css']
})
export class TopbarNavComponent implements OnInit {

  contentType: string;
  constructor(private route: ActivatedRoute) {
    console.log(this.route);
    this.route.paramMap.subscribe(
      params => this.contentType = params.get('contentType')
    );
  }

  ngOnInit() {
  }

}
