class OnClickOutside {
  constructor(vnode) {
    this.handleDocumentClick = this.handleDocumentClick.bind(
      this,
      vnode.attrs.onDocumentClick
    );
  }

  handleDocumentClick(onDocumentClick) {
    if (this.dom && !this.dom.contains(e.target)) {
      onDocumentClick();
    }
  }

  oncreate(vnode) {
    // Get dom on create
    this.dom = vnode.dom;

    // Add click event listener
    // Wrapping the event registration inside a 0 setTimeout
    // Otherwise sometimes the very click which triggered the rendering of this
    // element invokes onDocumentClick callback for same event
    // Probably because it's caught in the bubbling phase
    setTimeout(() => {
      window.document.addEventListener(
        'click',
        this.handleDocumentClick
      );
    }, 0);
  }

  onupdate(vnode) {
    // Get dom on update
    this.dom = vnode.dom;
  }

  onremove(vnode) {
    // Unsetting dom variable. Not sure if this is needed
    this.dom = null;

    // remove event listener
    document.removeEventListener('click', this.handleDocumentClick);
  }

  view(vnode) {
    return vnode.children;
  }
}

export default OnClickOutside;

