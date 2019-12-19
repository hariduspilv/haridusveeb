import {
  Component,
  Input,
  HostBinding,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnChanges,
  OnDestroy,
  ElementRef,
  forwardRef,
} from '@angular/core';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Subject } from 'rxjs';
import { RippleService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SlugifyPipe } from 'ngx-pipes';

@Component({
  selector: 'accordion-item',
  templateUrl: './accordion-item.template.html',
  providers: [SlugifyPipe],
  animations: [
    trigger('toggleBody', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('* => *', [
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)'),
      ]),
    ]),
  ],
})

export class AccordionItemComponent {
  public visible: boolean = false;
  public styleState: boolean = false;
  public bodyClass: string = '';
  public change = new Subject<any>();
  public id: string = Math.random().toString(36).substr(2, 9);
  private scroll: boolean = false;

  @Input() title: string = '';
  @Input() active: boolean = false;
  @HostBinding('class') get hostClasses(): string {
    return 'accordion__item';
  }

  constructor(
    private ripple: RippleService,
    private el: ElementRef,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private slugifyPipe: SlugifyPipe,
  ) {}

  public openAccordion() {
    if (this.styleState === this.active) {
      this.active = !this.active;
    }
    if (this.active) {
      this.change.next();
    }
    const slug = this.slugifyPipe.transform(this.title);
    const newUrl = this.router.url.split('#')[0];
    this.location.replaceState(`${newUrl}#${slug}`);
  }

  public closeAccordion() {
    this.active = false;
  }

  animationDone() {
    if (!this.active) {
      this.styleState = false;
    }
    if (this.scroll) {
      document.querySelector('.app-content').scrollTop =
        this.el.nativeElement.getBoundingClientRect().top;
      this.scroll = false;
    }
  }

  animationStart() {
    if (this.active) {
      this.styleState = true;
    }
  }

  ngOnInit(): void {
    const slug = this.slugifyPipe.transform(this.title);
    if (this.route.snapshot.fragment === slug) {
      this.scroll = true;
      this.openAccordion();
    }
  }
}

@Component({
  selector: 'accordion',
  templateUrl: './accordion.template.html',
  styleUrls: ['./accordion.styles.scss'],
})

export class AccordionComponent implements AfterContentInit, OnChanges, OnDestroy{

  private subscriptions = [];
  @Input() collapsible: boolean = false;

  @HostBinding('class') get hostClasses(): string {
    return 'accordion';
  }

  @ContentChildren(forwardRef(() => AccordionItemComponent))
    items: QueryList<AccordionItemComponent>;

  closeOthers() {
    if (this.collapsible && this.items) {
      const items = this.items.toArray();
      items.forEach((item) => {
        this.subscriptions.push(item.change.subscribe((response) => {
          const id = item.id;
          items.forEach((siblingItem) => {
            const siblingId = siblingItem.id;
            if (id !== siblingId) {
              siblingItem.closeAccordion();
            }
          });
        }));
      });
    }
  }

  destroySubscriptions() {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }

  ngAfterContentInit() {
    setTimeout(
      () => {
        this.closeOthers();
      },
      0);
  }

  ngOnChanges() {
    this.destroySubscriptions();
    this.closeOthers();
  }

  ngOnDestroy() {
    this.destroySubscriptions();
  }
}