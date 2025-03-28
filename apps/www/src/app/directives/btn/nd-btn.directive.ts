import { Directive, HostBinding, input } from '@angular/core';

type BtnVariants = 'primary' | 'secondary' | 'invisible' | 'bordered';
type BtnSizes = 'sm' | 'md' | 'lg';

const btnVariants: Record<BtnVariants, string> = {
  primary: 'bg-white text-black' + ' duration-200 ease-in-out hover:scale-105',
  secondary: 'bg-black text-white',
  invisible: 'bg-transparent text-white',
  bordered:
    'bg-transparent text-white border-2 border-opacity-50 border-white' +
    ' duration-200 ease-in-out hover:border-opacity-100',
};

const btnSizes = {
  sm: 'px-12 py-3 text-sm',
  md: 'px-16 py-4 text-md',
  lg: 'px-20 py-5 text-lg',
};

@Directive({
  selector: '[ndBtn]',
})
export class NdBtnDirective {
  public readonly variant = input<BtnVariants>('primary');
  public readonly size = input<BtnSizes>('md');
  public readonly blocked = input<boolean>(false);

  @HostBinding('class') get classes(): string {
    return `rounded-md ${btnSizes[this.size()]} ${
      btnVariants[this.variant()]
    } ${this.blocked() ? 'cursor-not-allowed opacity-50' : ''}`;
  }
}
