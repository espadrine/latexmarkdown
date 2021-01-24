// Debug primitives

// 1. Node handling helpers.

function getSiblings(node) {
  return [node].concat(node.next? getSiblings(node.next): []);
}

module.exports.getChildren =
function getChildren(node) {
  return node.firstChild? getSiblings(node.firstChild): [];
}

// Construct an exact replica of the node’s subtree.
// Warning: we clone the whole subtree, but not the parent or siblings.
module.exports.cloneNode =
function cloneNode(node) {
  const clone = Object.assign(Object.create(Object.getPrototypeOf(node)), node);
  if (clone.firstChild) {
    clone._firstChild = cloneNode(clone.firstChild);
    clone.firstChild._parent = clone;
    let child = clone.firstChild;
    while (child.next) {
      let next = child.next;
      const clonedNext = cloneNode(next);
      child._next = clonedNext;
      clonedNext._prev = child;
      clonedNext._parent = clone;
      // Iterate to next child.
      child = clonedNext;
    }
    clone._lastChild = child;
  }
  return clone;
}

// 2. Debugging the commonmark.js library’s output.

module.exports.debugNode =
function debugNode(node) {
  return {
    type: node.type,
    literal: node.literal,
    sourcepos: node.sourcepos,
    info: node.info,
    level: node.level,
  };
}

module.exports.debugAST =
function debugAST(node) {
  const getSiblings = n =>
    [n].concat(n.next? getSiblings(n.next): []);
  const getChildren = n =>
    n.firstChild? getSiblings(n.firstChild): [];
  return {
    type: node.type,
    literal: node.literal,
    sourcepos: node.sourcepos,
    info: node.info,
    level: node.level,
    children: getChildren(node).map(debugAST),
  };
}
