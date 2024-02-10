import { Component, OnInit } from '@angular/core';
import { AddStickyNoteComponent } from './add-sticky-note/add-sticky-note.component';
import { MatDialog } from '@angular/material/dialog';
import { SocialApiService } from '../social-api.service';
import { ApiResponse } from '../../model/ApiResponse';
import { StickyNoteVO } from '../../model/StickyNoteVO';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { LoaderService } from '../../loader.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sticky-notes',
   
  templateUrl: './sticky-notes.component.html',
  styleUrl: './sticky-notes.component.scss'
})
export class StickyNotesComponent implements OnInit {
  currentDate!: Date;
  stickyNoteList: StickyNoteVO[] = [];
  page: number = 0;
  size: number = 5;
  totalStickyNotes: number = 0;
  showLoader = false;
  constructor(
    private dialog: MatDialog,
    private socialConnectService: SocialApiService,
    private alertService: SwalAlertService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.currentDate = new Date();
    this.fetchStickyNotes(this.page, false);
  }
  fetchStickyNotes(page: number, flag: boolean) {
    this.socialConnectService.fetchStickyNotes(page, this.size).subscribe({
      next: (data: ApiResponse) => {
        if (flag == true) {
          this.stickyNoteList = this.stickyNoteList.concat(
            data.body?.stickyNotesList
          );
        } else {
          this.stickyNoteList = data.body?.stickyNotesList;
        }
        this.totalStickyNotes = data.body?.stickyNotesCount;
      },
    });
  }

  onScroll(event: any) {
    const element = event.target as HTMLElement;
    const scrollPosition = element.scrollHeight - element.scrollTop;
    const divHeight = element.clientHeight;

    if (scrollPosition === divHeight) {
      if (this.stickyNoteList.length != this.totalStickyNotes) {
        this.page += 1;
        this.fetchStickyNotes(this.page, true);
      }
    }
  }
  openAddStickyNote() {
    let dialogRef = this.dialog.open(AddStickyNoteComponent, {
      width: '800px',
      height: '307px',
    });
    dialogRef.componentInstance.refresh.subscribe((res: any) => {
      if (res) {
        this.fetchStickyNotes(0, false);
        dialogRef.close();
      }
    });
  }

  editStickyNote(note: any) {
    let dialogRef = this.dialog.open(AddStickyNoteComponent, {
      width: '800px',
      height: '307px',
      data: {
        noteVO: note,
      },
    });
    dialogRef.componentInstance.refresh.subscribe((res: any) => {
      if (res) {
        this.fetchStickyNotes(0, false);
        dialogRef.close();
      }
    });
  }

  deleteStickyNote(id: any) {
    this.alertService
      .buttonErrorAlert(
        'Are you sure you want to delete this Note?',
        'Yes, Delete'
      )
      .then((result: any) => {
        if (result.isConfirmed) {
          this.loader
            .showLoader(this.socialConnectService.deleteStickyNote(id))
            .subscribe({
              next: (response: any) => {
                this.alertService.successAlert(response.message);
                this.fetchStickyNotes(0, false);
              },
              error: (error: HttpErrorResponse) => {
                this.alertService.errorAlert('Error while deleting Note!');
              },
            });
        }
      });
  }
}