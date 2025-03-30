import { Routes } from "@angular/router";
import { ContentComponent } from "./content/content.component";
import { DetailsComponent } from "./details/details.component";

const routeConfig: Routes = [
    {
        path: '',
        component: ContentComponent,
        title: 'Home Page'
    },
    {
        path: 'details/:id',
        component: DetailsComponent,
        title: 'Details Page'
    }
];

export default routeConfig;