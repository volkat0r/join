import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/db/tasks.db';

@Component({
    selector: 'app-task-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './task-detail.html',
    styleUrls: ['./task-detail.scss'],
})
export class TaskDetailComponent {
    task = input.required<Task>();
    close = output<void>();

    /** returns the appropriate priority icon path for the current task */
    get priorityIcon(): string {
        const pr = this.task()?.priority?.toLowerCase() || '';
        switch (pr) {
            case 'low':
                return 'assets/icons/prio-low-small-task-32px.svg';
            case 'medium':
                return 'assets/icons/prio-medium-small-task-32px.svg';
            case 'urgent':
                return 'assets/icons/prio-urgent-small-task-32px.svg';
            default:
                return '';
        }
    }


    get categoryColor(): string {
        const cat = this.task()?.category?.toLowerCase() || '';
        switch (cat) {
            case 'user story':
                return '#3f51b5';
            case 'technical task':
                return '#009688';
            case 'bug':
                return '#e91e63';
            default:
                return '#607d8b';
        }
    }


    initials(name: string): string {
        if (!name) return '';
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .slice(0, 2)
            .toUpperCase();
    }
}
