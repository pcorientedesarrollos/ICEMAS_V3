import { Component, ElementRef, ViewChild, output, input, signal, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-signature-pad',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="signature-pad-container">
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <label class="block text-sm font-medium text-gray-700">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500">*</span>
          }
        </label>
        <div class="flex gap-2">
          <button
            type="button"
            (click)="clear()"
            class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpiar
          </button>
        </div>
      </div>

      <!-- Canvas Container -->
      <div 
        class="relative bg-white rounded-lg border-2 border-dashed transition-colors"
        [class.border-gray-300]="!isSigning()"
        [class.border-primary-500]="isSigning()"
      >
        <canvas
          #signatureCanvas
          class="w-full h-48 rounded-lg cursor-crosshair touch-none"
          (mousedown)="startDrawing($event)"
          (mousemove)="draw($event)"
          (mouseup)="stopDrawing()"
          (mouseleave)="stopDrawing()"
          (touchstart)="startDrawingTouch($event)"
          (touchmove)="drawTouch($event)"
          (touchend)="stopDrawing()"
        ></canvas>
        
        <!-- Placeholder text -->
        @if (!hasSignature()) {
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p class="text-gray-400 text-sm">Firme aquí</p>
          </div>
        }
      </div>

      <!-- Saved signature preview -->
      @if (savedSignature()) {
        <div class="mt-3">
          <p class="text-xs text-gray-500 mb-2">Firma guardada:</p>
          <div class="bg-gray-50 rounded-lg p-2 border border-gray-200">
            <img [src]="savedSignature()" alt="Firma" class="max-h-24 mx-auto" />
          </div>
        </div>
      }

      <!-- Actions -->
      @if (hasSignature() && showSaveButton()) {
        <div class="mt-3 flex justify-end">
          <button
            type="button"
            (click)="save()"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Guardar Firma
          </button>
        </div>
      }
    </div>
  `,
    styles: [`
    .signature-pad-container {
      width: 100%;
    }
    
    canvas {
      background-color: #fefefe;
      background-image: 
        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
      background-size: 20px 20px;
    }
  `]
})
export class SignaturePadComponent implements AfterViewInit, OnDestroy {
    @ViewChild('signatureCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    // Inputs
    label = input<string>('Firma');
    required = input<boolean>(false);
    showSaveButton = input<boolean>(true);
    savedSignature = input<string | null>(null);

    // Outputs
    signatureSaved = output<string>();
    signatureCleared = output<void>();

    // State
    hasSignature = signal(false);
    isSigning = signal(false);

    private ctx: CanvasRenderingContext2D | null = null;
    private isDrawing = false;
    private lastX = 0;
    private lastY = 0;
    private resizeObserver: ResizeObserver | null = null;

    ngAfterViewInit(): void {
        this.initCanvas();
        this.setupResizeObserver();
    }

    ngOnDestroy(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    private initCanvas(): void {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d');

        if (this.ctx) {
            // Set canvas size to match display size
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;

            // Scale context to account for pixel ratio
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            // Configure drawing style
            this.ctx.strokeStyle = '#1e3a5f';
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
        }
    }

    private setupResizeObserver(): void {
        this.resizeObserver = new ResizeObserver(() => {
            this.initCanvas();
        });
        this.resizeObserver.observe(this.canvasRef.nativeElement);
    }

    private getMousePosition(event: MouseEvent): { x: number; y: number } {
        const canvas = this.canvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    private getTouchPosition(event: TouchEvent): { x: number; y: number } {
        const canvas = this.canvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0];
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }

    startDrawing(event: MouseEvent): void {
        event.preventDefault();
        const pos = this.getMousePosition(event);
        this.isDrawing = true;
        this.isSigning.set(true);
        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    startDrawingTouch(event: TouchEvent): void {
        event.preventDefault();
        const pos = this.getTouchPosition(event);
        this.isDrawing = true;
        this.isSigning.set(true);
        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    draw(event: MouseEvent): void {
        if (!this.isDrawing || !this.ctx) return;
        event.preventDefault();

        const pos = this.getMousePosition(event);
        this.drawLine(pos.x, pos.y);
    }

    drawTouch(event: TouchEvent): void {
        if (!this.isDrawing || !this.ctx) return;
        event.preventDefault();

        const pos = this.getTouchPosition(event);
        this.drawLine(pos.x, pos.y);
    }

    private drawLine(x: number, y: number): void {
        if (!this.ctx) return;

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();

        this.lastX = x;
        this.lastY = y;
        this.hasSignature.set(true);
    }

    stopDrawing(): void {
        this.isDrawing = false;
        this.isSigning.set(false);
    }

    clear(): void {
        if (!this.ctx) return;

        const canvas = this.canvasRef.nativeElement;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.hasSignature.set(false);
        this.signatureCleared.emit();
    }

    save(): void {
        const dataUrl = this.getSignatureAsBase64();
        if (dataUrl) {
            this.signatureSaved.emit(dataUrl);
        }
    }

    getSignatureAsBase64(): string | null {
        if (!this.hasSignature()) return null;

        const canvas = this.canvasRef.nativeElement;
        return canvas.toDataURL('image/png');
    }

    // Public method to check if signature exists
    isEmpty(): boolean {
        return !this.hasSignature();
    }
}
