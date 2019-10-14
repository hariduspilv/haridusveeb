import { storiesOf } from '@storybook/angular';
import { AssetsModule } from '@app/_assets';
import listItemMd from './list-item.md';
import listItemHtml from './list-item.html';
import { TranslateModule } from '@app/_modules/translate';
import { list } from './list-item.data';
const moduleMetadata = {
  imports: [
    AssetsModule,
    TranslateModule.forRoot(),
  ],
};

const stories = storiesOf('Assets', module);

stories.add('List item', () => {

  return {
    moduleMetadata,
    props: {
      list,
    },
    template: listItemHtml,
  };
},          {
  notes: { markdown: listItemMd },
});