import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Difficulty, GenerateResult } from '../../core/models/generate.models';
import { Generate as GenerateService } from '../../core/services/generate';

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard'];

@Component({
  imports: [FormsModule, DecimalPipe],
  selector: 'app-generate',
  styleUrl: './generate.scss',
  templateUrl: './generate.html',
})
export class Generate {
  private readonly generateService = inject(GenerateService);

  readonly topic = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly result = signal<GenerateResult | null>(null);

  readonly groups = computed(() => {
    const result = this.result();
    if (!result) return [];
    return DIFFICULTY_ORDER.map((difficulty) => ({
      difficulty,
      questions: result.questions.filter((q) => q.difficulty === difficulty),
    })).filter((group) => group.questions.length > 0);
  });

  // [step name, latency ms][], in the order the pipeline actually ran them -
  // object key order is insertion order in JS, and the backend inserts them
  // in run order, so this needs no separate sorting.
  readonly stepTimeline = computed(() => {
    const metrics = this.result()?.metrics;
    return metrics ? Object.entries(metrics.step_latencies_ms) : [];
  });

  submit(): void {
    const topic = this.topic().trim();
    if (!topic || this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.result.set(null);

    this.generateService.generate(topic).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.result.set(res);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 403) {
          this.errorMessage.set(
            'Your access is not approved or has expired. Ask the owner to approve/re-approve your account.',
          );
        } else if (err.status === 502) {
          this.errorMessage.set('The LLM provider call failed (bad/missing API key, rate limit, or outage).');
        } else {
          this.errorMessage.set('Something went wrong generating questions. Please try again.');
        }
      },
    });
  }
}
