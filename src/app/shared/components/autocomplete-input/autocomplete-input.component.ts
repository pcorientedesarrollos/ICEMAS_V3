import { Component, Input, Output, EventEmitter, signal, effect, inject, DestroyRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface AutocompleteOption {
    id: number | string;
    label: string;
    subtitle?: string;
}

@Component({
    selector: 'app-autocomplete-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './autocomplete-input.component.html',
    styleUrl: './autocomplete-input.component.css'
})
export class AutocompleteInputComponent implements OnDestroy {
    @Input() placeholder = 'Buscar...';
    @Input() label = '';
    @Input() disabled = false;
    @Input() required = false;
    @Input() options: AutocompleteOption[] = [];
    @Input() loading = false;
    @Input() minChars = 2;

    @Output() search = new EventEmitter<string>();
    @Output() select = new EventEmitter<AutocompleteOption>();
    @Output() clear = new EventEmitter<void>();

    searchValue = signal('');
    showDropdown = signal(false);
    highlightedIndex = signal(-1);

    private searchSubject = new Subject<string>();
    private destroyRef = inject(DestroyRef);

    constructor() {
        // Debounce search input
        this.searchSubject
            .pipe(
                debounceTime(300),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(value => {
                if (value.length >= this.minChars) {
                    this.search.emit(value);
                    this.showDropdown.set(true);
                } else {
                    this.showDropdown.set(false);
                }
            });
    }

    ngOnDestroy(): void {
        this.searchSubject.complete();
    }

    onInput(value: string): void {
        this.searchValue.set(value);
        this.highlightedIndex.set(-1);

        if (!value) {
            this.showDropdown.set(false);
            this.clear.emit();
            return;
        }

        this.searchSubject.next(value);
    }

    onSelectOption(option: AutocompleteOption): void {
        this.searchValue.set(option.label);
        this.showDropdown.set(false);
        this.highlightedIndex.set(-1);
        this.select.emit(option);
    }

    onKeydown(event: KeyboardEvent): void {
        if (!this.showDropdown()) return;

        const maxIndex = this.options.length - 1;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.highlightedIndex.update(i =>
                    i < maxIndex ? i + 1 : 0
                );
                break;

            case 'ArrowUp':
                event.preventDefault();
                this.highlightedIndex.update(i =>
                    i > 0 ? i - 1 : maxIndex
                );
                break;

            case 'Enter':
                event.preventDefault();
                const index = this.highlightedIndex();
                if (index >= 0 && index <= maxIndex) {
                    this.onSelectOption(this.options[index]);
                }
                break;

            case 'Escape':
                event.preventDefault();
                this.showDropdown.set(false);
                this.highlightedIndex.set(-1);
                break;
        }
    }

    onBlur(): void {
        // Delay to allow click on dropdown item
        setTimeout(() => {
            this.showDropdown.set(false);
            this.highlightedIndex.set(-1);
        }, 200);
    }

    onFocus(): void {
        const value = this.searchValue();
        if (value.length >= this.minChars && this.options.length > 0) {
            this.showDropdown.set(true);
        }
    }

    clearInput(): void {
        this.searchValue.set('');
        this.showDropdown.set(false);
        this.highlightedIndex.set(-1);
        this.clear.emit();
    }
}
