import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { PrerecordedModuleVO } from 'src/app/model/PrerecordedModels';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { PreRecordedModuleService } from 'src/app/services/pre-recorded-module.service';

@Component({
  selector: 'app-batchprerecordedmodules',
  standalone: true,
  imports: [],
  templateUrl: './batchprerecordedmodules.component.html',
  styleUrl: './batchprerecordedmodules.component.scss'
})
export class BatchprerecordedmodulesComponent implements OnInit {
  @Input() batchId!: number;
  id: number | undefined;
  moduleName!: string;
  modules: PrerecordedModuleVO[] = [];

  constructor(
    private http: PreRecordedModuleService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.fetchMappedModules();
  }

  back() {
    this.id = undefined;
    this.moduleName = '';
  }

  fetchMappedModules() {
    this.loader
      .showLoader(this.http.fetchMappedModules(this.batchId))
      .subscribe({
        next: (data: ApiResponse) => {
          this.modules = data.body;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(error.error.message);
        },
      });
  }
}
