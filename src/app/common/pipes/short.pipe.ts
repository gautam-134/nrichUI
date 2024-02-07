import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'short',
})
export class ShortPipe implements PipeTransform {
  transform(value: any[], typeOfProp: string, typeOfShorting: any): any[] {
    let index = 0;
    // if (!value || typeOfShorting === '' || !typeOfShorting) {
    //   return value;
    // }
    if (value.length <= 1) {
      return value;
    }

    for (let i of Object.keys(value[0])) {
      if (i == typeOfProp) {
        index = Object.keys(value[0]).indexOf(i);
        value = value.sort((a: any, b: any) => {
          if (
            typeof Object.values(a)[index] == 'string' ||
            (typeof Object.values(a)[index] == 'object' &&
              typeof Object.values(b)[index] == 'string') ||
            (typeof Object.values(b)[index] == 'object' &&
              Object.values(a)[index] != null &&
              Object.values(b)[index] != null)
          ) {
            if (typeOfShorting == false) {
              if (
                JSON.stringify(Object.values(a)[index] as any).replace(/\s/g, "").toLowerCase() <
                JSON.stringify(Object.values(b)[index] as any).replace(/\s/g, "").toLowerCase()
              ) {
                return -1;
              } else if (
                JSON.stringify(Object.values(b)[index] as any).replace(/\s/g, "").toLowerCase() >
                JSON.stringify(Object.values(a)[index] as any).replace(/\s/g, "").toLowerCase()
              ) {
                return +1;
              } else {
                return 0;
              }
            } else {
              if (
                JSON.stringify(Object.values(a)[index] as any).replace(/\s/g, "").toLowerCase() >
                JSON.stringify(Object.values(b)[index] as any).replace(/\s/g, "").toLowerCase()
              ) {
                return -1;
              } else if (
                JSON.stringify(Object.values(b)[index] as any).replace(/\s/g, "").toLowerCase() <
                JSON.stringify(Object.values(a)[index] as any).replace(/\s/g, "").toLowerCase()
              ) {
                return +1;
              } else {
                return 0;
              }
            }
          } else {
            if (typeOfShorting == false) {
              if (
                (Object.values(a)[index] as any) <
                (Object.values(b)[index] as any)
              ) {
                return -1;
              } else if (
                (Object.values(b)[index] as any) >
                (Object.values(a)[index] as any)
              ) {
                return +1;
              } else {
                return 0;
              }
            } else {
              if (
                (Object.values(a)[index] as any) >
                (Object.values(b)[index] as any)
              ) {
                return -1;
              } else if (
                (Object.values(b)[index] as any) <
                (Object.values(a)[index] as any)
              ) {
                return +1;
              } else {
                return 0;
              }
            }
          }
        });
      }
    }
    return value;
  }
}
