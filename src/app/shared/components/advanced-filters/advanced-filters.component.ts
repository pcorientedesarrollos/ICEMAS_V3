import { Component, Input, Output, EventEmitter, signal, inject, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface FilterField {
    key: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'daterange';
    options?: { value: any; label: string }[];
    placeholder?: string;
}

export interface FilterValues {
    [key: string]: any;
}

@Component({
    selector: 'app-advanced-filters',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './advanced-filters.component.html',
    styleUrl: './advanced-filters.component.css'
})
export class AdvancedFiltersComponent implements OnInit {
    @Input() fields: FilterField[] = [];
    @Input() set initialValues(values: FilterValues) {
        if (values && Object.keys(values).length > 0) {
            this.filterForm.patchValue(values);
            this.updateActiveFiltersCount();
        }
    }

    @Output() filtersChanged = new EventEmitter<FilterValues>();
    @Output() filtersCleared = new EventEmitter<void>();

    @Input() inline = false; // When true, shows filters without accordion container

    private fb = inject(FormBuilder);
    private destroyRef = inject(DestroyRef);

    isExpanded = signal(false);
    activeFiltersCount = signal(0);
    filterForm: FormGroup = this.fb.group({});

    ngOnInit(): void {
        // Build form dynamically based on fields
        this.fields.forEach(field => {
            this.filterForm.addControl(field.key, this.fb.control(''));
        });

        // Subscribe to form changes
        this.filterForm.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.updateActiveFiltersCount();
            });
    }

    toggleFilters(): void {
        this.isExpanded.update(v => !v);
    }

    applyFilters(): void {
        const values = this.filterForm.value;
        // Only emit non-empty values
        const activeFilters: FilterValues = {};
        Object.keys(values).forEach(key => {
            const value = values[key];
            if (value !== null && value !== undefined && value !== '') {
                activeFilters[key] = value;
            }
        });

        this.filtersChanged.emit(activeFilters);
        this.isExpanded.set(false);
    }

    clearFilters(): void {
        // Reset all form controls to empty string instead of null
        const resetValues: { [key: string]: string } = {};
        this.fields.forEach(field => {
            resetValues[field.key] = '';
        });
        this.filterForm.reset(resetValues);
        this.activeFiltersCount.set(0);
        this.filtersCleared.emit();
        this.isExpanded.set(false);
    }

    private updateActiveFiltersCount(): void {
        const values = this.filterForm.value;
        const count = Object.keys(values).filter(key => {
            const value = values[key];
            return value !== null && value !== undefined && value !== '';
        }).length;

        this.activeFiltersCount.set(count);
    }

    getFieldControl(key: string) {
        return this.filterForm.get(key);
    }
}
