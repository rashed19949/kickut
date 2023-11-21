import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss', '../../admin/admin.component.scss']
})

export class UserDashboardComponent implements OnInit {

  bookingList: any = [];
  bookingListFiltered: any = [];
  user: any;
  FromDateSort:boolean = true;
  toDateSort:boolean=true;
  searchValue: string = '';

  constructor(
    private router: Router,
    private booking_service: BookingService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    let data: any = localStorage.getItem('user');
    this.user = JSON.parse(data);
    this.getUserBookings(this.user?.uid)
  }


  getUserBookings(id: any): void {
    this.booking_service
      .getBookingById(id)
      .subscribe(
        (response: any) => {
          console.log('response: ', response);
          this.bookingList = response;
          this.bookingListFiltered = response
          console.log(' this.bookingListFiltered: ',  this.bookingListFiltered);
          this.bookingListFiltered.sort((a: any, b: any) => {
            const dateA :any = new Date(a.fromDate ?? '');
            const dateB :any = new Date(b.fromDate ?? '');
          
            return dateB - dateA;
          });
          // this.bookingListFiltered.sort((a: any, b: any) => {
          //   const dateA :any = new Date(a.toDate ?? '');
          //   const dateB :any = new Date(b.toDate ?? '');
          
          //   return dateB - dateA;
          // });
          console.log(' this.bookingListFiltered: ',  this.bookingListFiltered);

        },
        (error) => {
          console.log(error);
        }
      );
  }
  searchFilter(value: any) {
    let filterValueLower = this.searchValue.toLowerCase();
    if (this.searchValue === '') {
      this.bookingListFiltered = this.bookingList;
    }
    else {
      this.bookingListFiltered = this.bookingList.filter((employee: any) =>
          employee.fromTime.includes(filterValueLower)
       || employee.fromDate.includes(filterValueLower)
       || employee.toDate.includes(filterValueLower)
       || employee.toTime.includes(filterValueLower)
       || employee.userName.includes(filterValueLower)
       || employee.userEmail.includes(filterValueLower)
      )
    }
  }
  AddBooking() {
    this.router.navigateByUrl('/public/dashboard/addbooking');
  }
  editRecord(selectedRecord: any) {
    console.log('selectedRecod: ', selectedRecord);
    this.booking_service._updateRecordBooking.next(selectedRecord);
    this.router.navigateByUrl('/public/dashboard/addbooking');
  }

  deleteRecord(item: any, index: number) {
    console.log('deleteRecod: ', item);
    this.booking_service.deleteBooking(item.uid)
      .subscribe((res) => {
        this.bookingList.splice(index, 1);
        this.toastr.success("Booking Cancelled successfully");

      }),
      (err: any) => {
        console.log(err);
      }
  }
  sortHeader(header:any){
    if( header === "formDate"){
      this.FromDateSort = ! this.FromDateSort
      if(this.FromDateSort){
        this.bookingListFiltered.sort((a: any, b: any) => {
          const dateA :any = new Date(a.fromDate ?? '');
          const dateB :any = new Date(b.fromDate ?? '');
        
          return dateB - dateA;
        });
      }else if(!this.FromDateSort){
        this.bookingListFiltered.sort((a: any, b: any) => {
          const dateA :any = new Date(a.fromDate ?? '');
          const dateB :any = new Date(b.fromDate ?? '');
        
          return dateA - dateB;
        });
      }
    }else if(header==="toDate"){
      console.log('header: ', header);
      this.toDateSort =! this.toDateSort
      if(this.toDateSort){
        this.bookingListFiltered.sort((a: any, b: any) => {
          const dateA :any = new Date(a.toDate ?? '');
          const dateB :any = new Date(b.toDate ?? '');
        
          return dateB - dateA;
        });
      }else if(!this.toDateSort){
        this.bookingListFiltered.sort((a: any, b: any) => {
          const dateA :any = new Date(a.toDate ?? '');
          const dateB :any = new Date(b.toDate ?? '');
        
          return dateA - dateB;
        });
    }
   
    

  }
}
}
