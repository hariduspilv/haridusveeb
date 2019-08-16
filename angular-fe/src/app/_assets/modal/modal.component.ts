import { Component, Input, OnInit, ElementRef, HostBinding } from '@angular/core';
import { focus } from '@app/_core/utility';
import { ModalService } from '@app/_services';

@Component({
  selector: 'modal-content',
  template: '<ng-content *ngIf="!loading"></ng-content>' +
  '<loader *ngIf="loading"></loader>',
})

export class ModalContentComponent {
  @Input() id: string;
  @Input() loading: boolean = false;
  private focusElem: string;
  ngOnInit() {
    this.focusElem = `modal-${this.id}`;
    focus(this.focusElem);
  }
}

@Component({
  selector: 'htm-modal',
  templateUrl: './modal.template.html',
  styleUrls: ['./modal.styles.scss'],
})

export class ModalComponent implements OnInit {
  @Input() id: string;
  @Input() title: string = '';
  public opened: boolean = false;
  private element: any;
  private focusStart: string;
  @Input() titleExists: boolean = true;
  @Input() topAction: boolean = true;
  @Input() bottomAction: boolean = true;
  // Modal opening button for story
  @Input() stateButton: boolean = false;
  @HostBinding('class') get hostClasses(): string {
    return this.opened ? 'modal modal-open' : 'modal';
  }

  constructor(
    private elem: ElementRef,
    private modalService: ModalService,
  ) {
    this.element = elem.nativeElement;
  }

  ngOnInit() {
    // Outside click close
    this.focusStart = `modal-${this.id}`;
    this.element.addEventListener('click', (el) => {
      if (el.target.className && el.target.className.includes('modal__backdrop')) {
        this.stateChange(false);
      }
    });
    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
  }

  setFocus() {
    focus(this.focusStart);
  }

  stateChange(state: boolean): void {
    this.modalService.modalOpened[this.id] = state;
    this.opened = state;
  }
}
