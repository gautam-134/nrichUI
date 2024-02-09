import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileCheckService {

  constructor() { }

  isFileExcel(file: any) {
    const acceptedVideoTypes = ['text/csv', 'text/xls', 'text/xls'];
    return file && acceptedVideoTypes.includes(file['type']);
  }
  isFileVideo(file: any) {
    const acceptedVideoTypes = ['video/mp4', 'video/ogg'];
    return file && acceptedVideoTypes.includes(file['type']);
  }
  isFileAudio(file: any) {
    const acceptedAudioTypes = ['audio/mpeg'];
    return file && acceptedAudioTypes.includes(file['type']);
  }
  isFileImage(file: any) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type']);
  }
  isFilePpt(file: any) {
    const acceptedVideoTypes = ['application/vnd.ms-powerpoint'];
    return file && acceptedVideoTypes.includes(file['type']);
  }

  isFilePDF(file: any) {
    const acceptedImageTypes = ['application/pdf'];
    return file && acceptedImageTypes.includes(file['type']);
  }

  isFileMsword(file: any) {
    if (
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'.includes(
        file.type
      )
    )
      return true;
    return false;
  }

}
