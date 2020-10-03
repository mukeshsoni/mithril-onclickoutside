### mithril-onclickoutside

A wrapper component which handles clicks outside the wrapped element and fires
a callback when there is a click outside the wrapped element.

### Usage

#### Install mithril-onclickoutside

```
npm install -S mithril-onclickoutside
```

#### Wrap your element inside OnClickOutside component

```
import OnClickOutside from 'mithril-onclickoutside';

const ComponentToTest = {
  view: (vnode) => {
    return m("div", [
      m(
        "button",
        {
          onclick: (e) => {
            e.stopPropagation();
            vnode.state.showList = !vnode.state.showList;
          },
        },
        "Open list"
      ),
      vnode.state.showList &&
        m(
          OnClickOutside,
          {
            onDocumentClick: () => {
              vnode.state.showList = false;
              // since this click handler is outside mithril ecosystem, we 
              // have to force redraw
              m.redraw();
            },
          },
          m("ul", { "data-testid": "the-list" }, [(m("li", 1), m("li", 2))])
        ),
    ]);
  },
};
```

One important thing to keep in mind is that since mithril auto redraws if 
a callback related to one of the event handlers within mithril eco system is 
called, user has to force redraw if they want to, in the `onDocumentClick`
callback.

### Testing your component

If you plan to write a test for clicking on the document and verifying if an
element visibility changes as a result, you have to add a timer before you fire
a click on the document or something outside the wrapped element. This is 
because this component attaches the document click listener inside a setTimeout
of 0.

Otherwise sometimes the very click which triggered the rendering of this
element invokes onDocumentClick callback for same event. Probably because it's 
caught in the bubbling phase.

### Contributing

```
# install dependencies
npm install
# run tests
npm test 
# or run tests in watch mode
npm test -- --watch
```
