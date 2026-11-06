import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'mbs-confirm-dialog',
  styleUrl: './confirm-dialog.scss',
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly actionBtnText = input<string>('Delete');
  readonly actionBtnVariant = input<'primary' | 'danger'>('danger')

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
