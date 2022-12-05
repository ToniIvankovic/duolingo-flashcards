import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionResultsComponent } from './session-results.component';

@NgModule({
    declarations: [SessionResultsComponent],
    exports: [SessionResultsComponent],
    imports: [CommonModule],
})
export class SessionResultsModule {}
