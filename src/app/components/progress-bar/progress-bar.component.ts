import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  isLoading$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    this.isLoading$ = this.loaderService.loaderState$;
  }
}