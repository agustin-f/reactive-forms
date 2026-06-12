import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './country-page.html',
  styleUrl: './country-page.css',
})
export class CountryPage {
  fb = inject(FormBuilder);

  countryService = inject(CountryService);

  regions = signal(this.countryService.regions);

  countryByRegions = signal<Country[]>([]);

  borders = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  onFormChanged = effect((onCleanup) => {
    const regionSuscription = this.onRegionChanged();
    const countrySuscription = this.onCountryChanged();

    onCleanup(() => {
      regionSuscription.unsubscribe();
      countrySuscription.unsubscribe();
    });
  });

  onRegionChanged() {
    return this.myForm
      .get('region')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.myForm.get('border')!.setValue('')),
        tap(() => {
          this.borders.set([]);
          this.countryByRegions.set([]);
        }),
        switchMap((region) => this.countryService.getCountriesByRegion(region ?? '')),
      )
      .subscribe((countries) => {
        this.countryByRegions.set(countries);
      });
  }

  onCountryChanged() {
    return this.myForm
      .get('country')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((value) => value!.length > 0),
        switchMap((alphaCode) => this.countryService.getCountryByAlphaCode(alphaCode ?? '')),
        switchMap((country) => this.countryService.getCountryNamesByCodeArray(country.borders)),
      )
      .subscribe((borders) => {
        this.borders.set(borders);
      });
  }
}
