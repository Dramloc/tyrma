export type Leaf<T> = { node: T };
export type Branch<T> = { node: T; left: BinaryTree<T>; right: BinaryTree<T> };
export type BinaryTree<T> = Leaf<T> | Branch<T>;

export const leafOf = <T>(node: T): Leaf<T> => ({ node });
export const branchOf = <T>(node: T, left: BinaryTree<T>, right: BinaryTree<T>): Branch<T> => ({ node, left, right });

export const isBranch = <T>(tree: BinaryTree<T>): tree is Branch<T> => {
  const branch = tree as Branch<T>;
  return branch.left !== undefined && branch.right !== undefined;
};
export const isLeaf = <T>(tree: BinaryTree<T>): tree is Leaf<T> => {
  const branch = tree as Branch<T>;
  return branch.left === undefined && branch.right === undefined;
};

export const node = <T>(tree: BinaryTree<T>): T => tree.node;
export const left = <T>(branch: Branch<T>): BinaryTree<T> => branch.left;
export const right = <T>(branch: Branch<T>): BinaryTree<T> => branch.right;
export const children = <T>(branch: Branch<T>): [BinaryTree<T>, BinaryTree<T>] => [left(branch), right(branch)];

export const map = <T, U>(fn: (value: T) => U, tree: BinaryTree<T>): BinaryTree<U> => {
  if (isLeaf(tree)) {
    return leafOf(fn(node(tree)));
  }
  return branchOf(fn(node(tree)), map(fn, left(tree)), map(fn, right(tree)));
};
export const mapLeaves = <T, U>(fn: (value: T) => U, tree: BinaryTree<T>): BinaryTree<U> => {
  if (isLeaf(tree)) {
    return leafOf(fn(node(tree)));
  }
  return branchOf(node(tree), mapLeaves(fn, left(tree)), mapLeaves(fn, right(tree)));
};

export const leaves = <T>(tree: BinaryTree<T>): Leaf<T>[] => {
  const $leaves = (currentLeaves: Leaf<T>[], tree: BinaryTree<T>): Leaf<T>[] => {
    if (isLeaf(tree)) {
      return [tree];
    }
    return children(tree).flatMap((child) => $leaves(currentLeaves, child as BinaryTree<T>));
  };
  return $leaves([], tree);
};

export const branches = <T>(tree: BinaryTree<T>): Branch<T>[] => {
  const $branches = (currentBranches: Leaf<T>[], tree: BinaryTree<T>): Branch<T>[] => {
    if (isLeaf(tree)) {
      return [];
    }
    return [tree, ...children(tree).flatMap((child) => $branches(currentBranches, child as BinaryTree<T>))];
  };
  return $branches([], tree);
};
