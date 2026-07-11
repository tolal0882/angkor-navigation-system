import { Temple, TempleCategory } from "../types/temple";

export class CategoryNode {
  name: string;
  children: Map<string, CategoryNode>;
  temples: Temple[];

  constructor(name: string) {
    this.name = name;
    this.children = new Map();
    this.temples = [];
  }

  addChild(name: string): CategoryNode {
    if (!this.children.has(name)) this.children.set(name, new CategoryNode(name));
    return this.children.get(name)!;
  }
}

export class CategoryTree {
  root: CategoryNode;

  constructor(rootName = "Temples") {
    this.root = new CategoryNode(rootName);
  }

  // Insert a temple under a category path. Example path: ["Angkor Wat Complex", "Outer Temples"]
  insert(temple: Temple, path: string[] = [temple.category]) {
    let node = this.root;
    for (const p of path) node = node.addChild(p);
    node.temples.push(temple);
  }

  // Find node by path
  findNode(path: string[]): CategoryNode | undefined {
    let node = this.root;
    for (const p of path) {
      const next = node.children.get(p);
      if (!next) return undefined;
      node = next;
    }
    return node;
  }

  // Get all temples for a category (non-recursive)
  listTemples(path: string[]): Temple[] {
    const node = this.findNode(path);
    return node ? [...node.temples] : [];
  }

  // Traverse and collect a summary
  traverse(): { path: string[]; count: number }[] {
    const out: { path: string[]; count: number }[] = [];

    const visit = (node: CategoryNode, curPath: string[]) => {
      if (node.temples.length > 0) out.push({ path: curPath, count: node.temples.length });
      for (const [name, child] of node.children) visit(child, [...curPath, name]);
    };

    visit(this.root, []);
    return out;
  }

  // Convenience: organize a list of temples by their category into the tree
  static fromList(temples: Temple[]) {
    const tree = new CategoryTree();
    for (const t of temples) tree.insert(t, [t.category]);
    return tree;
  }
}

export default CategoryTree;
