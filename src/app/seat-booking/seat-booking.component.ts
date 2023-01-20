import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { CoachDataService } from './coach-data.service';

@Component({
  selector: 'app-seat-booking',
  templateUrl: './seat-booking.component.html',
  styleUrls: ['./seat-booking.component.css']
})
export class SeatBookingComponent implements OnInit {
  bookingForm: any;
  bookingData: any
  public sevenSeater = [1, 2, 3, 4, 5, 6, 7];
  public threeSeater = [1, 2, 3];
  public message = "";
  total: number = 0;
  booked: number = 0;
  rem: any = 0;
  bookings: any = []
  constructor(private _fb: FormBuilder, private databaseService: CoachDataService) { }
  ngOnInit(): void {
    this.createForm();
    this.databaseService.data.pipe(tap(d => (this.rem = d.rem))).subscribe(ans => {
      this.bookingData = ans
    });
  }

  createForm() {
    this.bookingForm = this._fb.group({
      seatsToBook: ["", Validators.required]
    });
  }

  //  return sear number 
  getSeatNum(n: number, row: number): number {
    return (row - 1) * 7 + n;
  }

  // check weather seat is booked or not 
  idSeatBooked(n: number, row: number, bs: number[]): boolean {
    const seat = this.getSeatNum(n, row);
    return bs.some(bs => bs === seat);
  }

  // book seats
  book() {
    if (!this.bookingForm.valid) return;
    let { seatsToBook } = this.bookingForm.value;

    // When available seats are less than input seats
    if (this.rem < seatsToBook) {
      this.message = `Only ${this.rem} seats available`;
      return;
    }

    // Booking seats 
    const [bookedSeats, rem] = this.databaseService.bookSeats(seatsToBook);

    // Display Ticket Confirmed Chart
    this.rem = rem;
    this.bookings.unshift({
      time: Date.now(),
      seats: bookedSeats
    });
  }

}
