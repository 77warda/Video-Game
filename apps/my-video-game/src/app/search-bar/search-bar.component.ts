import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'video-game-db-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  searchForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required],
    });
  }

  onSubmit() {
    // this.router.navigate(['search', form.value.search]);
    console.log(this.searchForm.value);
  }
}
