import { Injectable, RendererFactory2, ViewEncapsulation, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class AmpService {
  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document,
  ) {
  }

  /**
   * Adds AMP tag to head
   * @param tag - LinkDefinition type
   * @param [forceCreation] - -f the creation of the tag
   */
  addTag(tag: LinkDefinition, forceCreation?: boolean) {

    try {
      const renderer = this.rendererFactory.createRenderer(this.document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {},
      });

      const link = renderer.createElement('link');

      const head = this.document.head;
      const selector = this.parseSelector(tag);

      if (head === null) {
        throw new Error('<head> not found within DOCUMENT.');
      }

      Object.keys(tag).forEach((prop: string) => {
        return renderer.setAttribute(link, prop, tag[prop]);
      });

      // [TODO]: get them to update the existing one (if it exists) ?
      renderer.appendChild(head, link);

    } catch (e) {
    }
  }

  /**
   * Removes AMP tag from HEAD
   * @param attrSelector - attribute to search the AMP tag by
   */
  removeTag(attrSelector: string) {
    if (attrSelector) {
      try {
        const renderer = this.rendererFactory.createRenderer(this.document, {
          id: '-1',
          encapsulation: ViewEncapsulation.None,
          styles: [],
          data: {},
        });
        const head = this.document.head;
        if (head === null) {
          throw new Error('<head> not found within DOCUMENT.');
        }
        const linkTags = this.document.querySelectorAll(`link[${attrSelector}]`);
        for (const link of linkTags) {
          renderer.removeChild(head, link);
        }
      } catch (e) {
      }
    }
  }

  private parseSelector(tag: LinkDefinition): string {
    // Possibly re-work this
    const attr: string = tag.rel ? 'rel' : 'hreflang';
    return `${attr}="${tag[attr]}"`;
  }
}

export declare type LinkDefinition = {
  charset?: string;
  crossorigin?: string;
  href?: string;
  hreflang?: string;
  media?: string;
  rel?: string;
  rev?: string;
  sizes?: string;
  target?: string;
  type?: string;
} & {
  [prop: string]: string;
};
