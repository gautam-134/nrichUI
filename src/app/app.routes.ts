import { RouterModule,Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./marketing/marketing.module').then((m) => m.MarketingModule),
    }
];

