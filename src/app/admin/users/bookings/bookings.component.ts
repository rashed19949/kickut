import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss', '../../admin.component.scss']
})
export class BookingsComponent implements OnInit {
  bookingList: any = [];
  user_id: any;
  FromDateSort:boolean = true;
  toDateSort:boolean=true;

  constructor(
    private route: ActivatedRoute,
    private booking_service: BookingService
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.user_id = params['id'];
      if (this.user_id) {
        this.getUserBookings(this.user_id);
      }
    });
  }

  getUserBookings(id: any): void {
    this.booking_service
      .getBookingById(id)
      .subscribe(
        (response: any) => {
          this.bookingList = response;
          this.bookingList.sort((a: any, b: any) => {
            const dateA :any = new Date(a.fromDate ?? '');
            const dateB :any = new Date(b.fromDate ?? '');
          
            return dateB - dateA;
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }
  sortHeader(header:any){
    if( header === "formDate"){
      this.FromDateSort = ! this.FromDateSort
      if(this.FromDateSort){
        this.bookingList.sort((a: any, b: any) => {
          const dateA :any = new Date(a.fromDate ?? '');
          const dateB :any = new Date(b.fromDate ?? '');
        
          return dateB - dateA;
        });
      }else if(!this.FromDateSort){
        this.bookingList.sort((a: any, b: any) => {
          const dateA :any = new Date(a.fromDate ?? '');
          const dateB :any = new Date(b.fromDate ?? '');
        
          return dateA - dateB;
        });
      }
    }else if(header==="toDate"){
      console.log('header: ', header);
      this.toDateSort =! this.toDateSort
      if(this.toDateSort){
        this.bookingList.sort((a: any, b: any) => {
          const dateA :any = new Date(a.toDate ?? '');
          const dateB :any = new Date(b.toDate ?? '');
        
          return dateB - dateA;
        });
      }else if(!this.toDateSort){
        this.bookingList.sort((a: any, b: any) => {
          const dateA :any = new Date(a.toDate ?? '');
          const dateB :any = new Date(b.toDate ?? '');
        
          return dateA - dateB;
        });
    }
   
    

  }
}

}
