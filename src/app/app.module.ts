import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
// import { HelloComponent } from "./hello.component";
import { SeatBookingComponent } from "./seat-booking/seat-booking.component";
import { CoachDataService } from "./seat-booking/coach-data.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule,MatIconModule],
  declarations: [AppComponent,SeatBookingComponent],
  bootstrap: [AppComponent],
  providers: [CoachDataService]
})
export class AppModule {}
