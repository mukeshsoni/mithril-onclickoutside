import m from "mithril";
import { render, fireEvent, waitFor } from "mithril-testing-library";

import OnClickOutside from "../index";

async function wait(waitTime) {
  return new Promise((res) => setTimeout(res, waitTime));
}

test("call onDocumentClick callback on clicking outside the wrapped element", async () => {
  const handleDocumentClick = jest.fn();

  const ComponentToTest = {
    view: () => {
      return m(
        "div",
        m(
          OnClickOutside,
          { onDocumentClick: handleDocumentClick },
          m("div", "Wrapped div")
        )
      );
    },
  };

  const { getByText } = render(ComponentToTest);

  await wait(1);
  fireEvent.click(document);

  await waitFor(() => {
    expect(handleDocumentClick).toHaveBeenCalledTimes(1);
  });
});

test("a slightly more involved example", async () => {
  const handleDocumentClick = jest.fn();

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

  const { getByText, queryByTestId } = render(ComponentToTest);
  expect(queryByTestId("the-list")).toBeNull();
  fireEvent.click(getByText("Open list"));

  await waitFor(() => {
    expect(queryByTestId("the-list")).not.toBeNull();
  });

  await wait(1);
  fireEvent.click(document);

  await waitFor(() => {
    expect(queryByTestId("the-list")).toBeNull();
  });
});
