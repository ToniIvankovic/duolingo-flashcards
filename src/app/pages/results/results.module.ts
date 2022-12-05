import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results.component';
import { MatCardModule } from '@angular/material/card';
import { SessionResultsModule } from 'src/app/components/session-results/session-results.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [ResultsComponent],
    exports: [ResultsComponent],
    imports: [CommonModule, MatCardModule, SessionResultsModule, MatButtonModule],
})
export class ResultsModule {}
