
export interface Node {
    visit<T>(visitor: NodeVisitor<T>): T;
}


export interface NodeVisitor<T> {
    number(n: Number): T;
    const(c: Const): T;
    list(l: List): T;
    dice(d: Dice): T;
    operation(o: Operation): T;
    embraced(e: Embraced): T;
    propertyAccess(p: PropertyAccess): T;
    call(f: Call): T;
    with(w: With): T;
}


export class Number implements Node {
    public readonly value: number;

    constructor(value: number) {
        this.value = value;
    }

    visit<T>(visitor: NodeVisitor<T>): T {
        return visitor.number(this);
    }
}


export class Const implements Node {
    public readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    visit<T>(visitor: NodeVisitor<T>): T {
        return visitor.const(this);
    }
}


export class Operation implements Node {
    public readonly op: string;
    public readonly left: Node;
    public readonly right: Node;

    constructor(op: string, left: Node, right: Node) {
        this.op = op;
        this.left = left;
        this.right = right;
    }

    visit<T>(visitor: NodeVisitor<T>): T {
        return visitor.operation(this);
    }
}


export class Dice implements Node {
    public readonly amount: number;
    public readonly sides: number;

    constructor(amount: number, sides: number) {
        this.amount = amount;
        this.sides = sides;
    }

    visit<T>(visitor: NodeVisitor<T>): T {
        return visitor.dice(this);
    }
}


export class Embraced implements Node {
    public readonly expression: Node;

    constructor(expression: Node) {
        this.expression = expression;
    }

    visit<T>(visitor: NodeVisitor<T>): T {
        return visitor.embraced(this);
    }
}


export class List implements Node {
    public readonly items: Node[];

    constructor(items: Node[]) {
        this.items = items;
    }

    visit<T>(visitor: NodeVisitor<T>): T {
        return visitor.list(this);
    }
}


export class PropertyAccess implements Node {
    public readonly object: Node;
    public readonly propertyname: string;

    constructor(object: Node, methodname: string) {
        this.object = object;
        this.propertyname = methodname;
    }

    visit<T>(visitor: NodeVisitor<T>): T {
        return visitor.propertyAccess(this);
    }
}


export class Call implements Node {
    public readonly object: Node;
    public readonly arguments: Node[];

    constructor(object: Node, args: Node[]) {
        this.object = object;
        this.arguments = args;
    }

    visit<T>(visitor: NodeVisitor<T>): T {
        return visitor.call(this);
    }
}


interface Binding {
    name: string,
    expression: Node
}

export class With implements Node {
    public readonly expression: Node;
    public readonly bindings: Binding[];

    constructor(expression: Node, bindings: Binding[]) {
        this.expression = expression;
        this.bindings = bindings;
    }

    visit<T>(visitor: NodeVisitor<T>): T {
        return visitor.with(this);
    }
}
