import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { StickyNotesComponent } from '../sticky-notes.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SocialApiService } from '../../social-api.service';
import { ApiResponse } from '../../../model/ApiResponse';
import { StickyNoteVO } from '../../../model/StickyNoteVO';
import { AuthService } from '../../../services/auth.service';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-add-sticky-note',
   
  templateUrl: './add-sticky-note.component.html',
  styleUrl: './add-sticky-note.component.scss'
})
export class AddStickyNoteComponent implements OnInit {
  refresh = new EventEmitter<boolean>();
  form!: FormGroup;
  stickyNoteVO: StickyNoteVO={};
  constructor(
    public dialogRef: MatDialogRef<StickyNotesComponent>,
    private fb: FormBuilder,private loader:LoaderService,
    private socialConnectService: SocialApiService,@Inject(MAT_DIALOG_DATA)
    public data: { noteVO:any }
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data?.noteVO.id ? this.data?.noteVO.id:null],
      content: [this.data?.noteVO.content ? this.data?.noteVO.content:''],
    });
  }
  get controls() {
    return this.form.controls;
  }
  closeDialog(): void {
    this.dialogRef.close();
  } 

  onSubmit() {
    this.stickyNoteVO.id=this.form?.controls['id']?.value;
    this.stickyNoteVO.content = this.form?.controls['content'].value;
    this.stickyNoteVO.instituteId=AuthService.getInstituteId;
    this.loader.showLoader(
    this.socialConnectService.addStickyNote(this.stickyNoteVO)).subscribe({
      next: (data: ApiResponse) => {
        this.refresh.emit(true);
      },
    });
  }
}

