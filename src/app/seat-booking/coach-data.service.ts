import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// Represents a Row of a coach
type SEAT_ROW = {
  row: number;
  booked: number;
  max: number;
  start: number;
  booked_seats: number[];
};

// Represents a coach
type COACHDATA = {
  seatChart: SEAT_ROW[];
  total: number;
  booked: number;
  rem: number;
};

@Injectable()
export class CoachDataService {
  constructor() { }
  // Defining Coach Data 
  private coachData: COACHDATA = {
    seatChart: [
      { row: 1, booked: 0, max: 7, start: 1, booked_seats: [] },
      { row: 2, booked: 0, max: 7, start: 8, booked_seats: [] },
      { row: 3, booked: 0, max: 7, start: 15, booked_seats: [] },
      { row: 4, booked: 0, max: 7, start: 22, booked_seats: [] },
      { row: 5, booked: 0, max: 7, start: 29, booked_seats: [] },
      { row: 6, booked: 0, max: 7, start: 36, booked_seats: [] },
      { row: 7, booked: 0, max: 7, start: 43, booked_seats: [] },
      { row: 8, booked: 0, max: 7, start: 50, booked_seats: [] },
      { row: 9, booked: 0, max: 7, start: 57, booked_seats: [] },
      { row: 10, booked: 0, max: 7, start: 64, booked_seats: [] },
      { row: 11, booked: 0, max: 7, start: 71, booked_seats: [] },
      { row: 12, booked: 0, max: 3, start: 78, booked_seats: [] }
    ],
    total: 80,
    booked: 0,
    rem: 80
  };
  private _data = new BehaviorSubject<COACHDATA>(this.coachData);

  get data() {
    return this._data.asObservable();
  }

  // Book Seats in a particular row 
  bookSeatsInRow(finalRow, seatsCount) {

    finalRow.booked = finalRow.booked + seatsCount
    let newBookings = []
    const totalSeatCountPerRow = finalRow.start + finalRow.max - 1
    for (let seat = finalRow.start; seat <= totalSeatCountPerRow; seat++) {

      if ((seatsCount > 0) && !finalRow.booked_seats.includes(seat)) {

        finalRow.booked_seats.push(seat)
        newBookings.push(seat)
        seatsCount--
      }
    }

    return [newBookings, finalRow]
  }

  // checking weather contaneous seats are present in a row 
  haveSeatsTogether(prev, booked_seats, next, wantedSeatCount) {

    if (booked_seats.length == 0)
      return true
    let maxConteneousSeat = 0
    for (let seatNumber of booked_seats) {
      maxConteneousSeat = Math.max(seatNumber - prev - 1, maxConteneousSeat)
      prev = seatNumber
    }
    maxConteneousSeat = Math.max(next - prev - 1, maxConteneousSeat)

    return maxConteneousSeat >= wantedSeatCount
  }

  // make seat booking
  bookSeats(seatsToBook: any) {
    let maxRemainingSeatInRow = 0
    let bookedSeats = []
    let finalRow = null
    let rowIndex = 0
    let maxIndex = -1

    // finding a row where seats are together 
    main: for (let row of this.coachData.seatChart) {

      let remainingRowSeats = row.max - row.booked;
      if (remainingRowSeats >= seatsToBook) {

        const seatsTogether = this.haveSeatsTogether(row.start - 1, row.booked_seats, row.start + row.max, seatsToBook)
        // when contaneous seats are present we will book that set of seats
        if (seatsTogether) {
          finalRow = row;
          break main;
        }
        finalRow = row
      }
      
      if (remainingRowSeats > maxRemainingSeatInRow) {
        maxRemainingSeatInRow = remainingRowSeats
        maxIndex = rowIndex
      }
      rowIndex++;
    }

    // There are enough empty seats in a row to book Seats together
    if (finalRow) {
      const result = this.bookSeatsInRow(finalRow, seatsToBook)
      this.coachData.rem -= seatsToBook
      this.coachData.booked = this.coachData.booked + seatsToBook
      return [result[0], this.coachData.rem]
    }
    else {

      // Since the seats are not contaneous in a row so we have to book the near by seats
      if (maxRemainingSeatInRow == 0 || maxIndex == -1) {
        console.log("no seats left")
      }

      // we will make the priority of getting the max seat in a row and book the remaining seats then after
      const seatsLeft = this.coachData.seatChart[maxIndex].max - this.coachData.seatChart[maxIndex].booked

      let bookingSeats = this.bookSeatsInRow(this.coachData.seatChart[maxIndex], seatsLeft)[0];
      this.coachData.rem -= seatsLeft
      this.coachData.booked = this.coachData.booked + seatsLeft

      // Now the remaining seats are booked 
      const remainingSeats = seatsToBook - seatsLeft;
      let remainingBookingSeats = []
      if (remainingSeats > 0)
        remainingBookingSeats = this.bookSeats(remainingSeats)[0]
      const ans = remainingBookingSeats.concat(bookingSeats)
      return [ans, this.coachData.rem]
    }
  }
}
