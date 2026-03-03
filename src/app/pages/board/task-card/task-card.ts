import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/db/tasks.db';
import { TruncatePipe } from '../../../services/truncate.pipe';

interface StatusOption {
    value: Task['status'];
    label: string;
}

@Component({
    selector: 'app-task-card',
    standalone: true,
    imports: [CommonModule, TruncatePipe],
    templateUrl: './task-card.html',
    styleUrls: ['./task-card.scss'],
})
export class TaskCardComponent {
    @Input() task!: Task;
    @Output() openTask = new EventEmitter<Task>();
    @Output() statusChange = new EventEmitter<{ task: Task; newStatus: Task['status'] }>();

    showMoveMenu = false;

    constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

    private readonly statusOptions: StatusOption[] = [
        { value: 'todo', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'await-feedback', label: 'Await Feedback' },
        { value: 'done', label: 'Done' },
    ];

    get availableStatuses(): StatusOption[] {
        return this.statusOptions.filter(option => option.value !== this.task.status);
    }

    toggleMoveMenu(event: Event): void {
        event.stopPropagation();
        this.showMoveMenu = !this.showMoveMenu;
    }

    moveToStatus(newStatus: Task['status']): void {
        this.showMoveMenu = false;
        this.statusChange.emit({ task: this.task, newStatus });
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.showMoveMenu) {
            return;
        }

        const target = event.target as HTMLElement | null;
        if (!target) {
            return;
        }

        const clickedInsideMenu = !!target.closest('.move-menu');
        const clickedToggleButton = !!target.closest('.option-btn');

        if (!clickedInsideMenu && !clickedToggleButton) {
            this.showMoveMenu = false;
        }
    }

    onClick() {
        this.openTask.emit(this.task);
    }


    get assignedNames(): string {
        return this.task?.contacts?.map(c => c.name).join(', ') || '';
    }


    get completedSubtasks(): string {
        const total = this.task?.subtasks?.length || 0;
        if (total === 0) {
            return '';
        }
        const done = this.task.subtasks.filter(s => s.done).length;
        return `${done}/${total} Subtasks`;
    }


    get subtaskPercent(): number {
        const total = this.task?.subtasks?.length || 0;
        if (total === 0) {
            return 0;
        }
        const done = this.task.subtasks.filter(s => s.done).length;
        return Math.round((done / total) * 100);
    }


    initials(name: string): string {
        if (!name) {
            return '';
        }
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .slice(0, 2)
            .toUpperCase();
    }
    getCategoryClass(): string {
        if (!this.task?.category) {
            return '';
        }
        //console.log(this.task.category.toLowerCase().replace(/\s+/g, '-'));
        return this.task.category.toLowerCase().replace(/\s+/g, '-');
    }

    get categoryColor(): string {
        const cat = this.task?.category?.toLowerCase() || '';
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
}
