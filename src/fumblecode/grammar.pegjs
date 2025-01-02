{
  let parser = this;
  function op(head, tail) {
      if (tail.length == 0) {
          return head;
        }
        else {
            var last = tail[tail.length - 1];
            var sign = last[1];
            var rhs = last[3];
            return new parser.Operation(sign, op(head, tail.slice(0, -1)), rhs);
        }
    }
}

Expression = With

With
    = cmp:Logic _ bindings:BindingList?
    {
        return !bindings
            ? cmp
            : new parser.With(cmp, bindings);
    }


BindingList
    = "with" _ head:Binding tail:(_ "," _ b:Binding { return b })*
    {
        return [head].concat(tail || []);
    }


Binding
    = name:Identifier _ "=" _ exp:Expression
    {
        return {name: name, expression: exp}
    }


Logic
    = head:Comparision tail:( _ ('and' / 'or') _ Comparision)*
    {
        return op(head, tail)
    }


Comparision
    = head:Sum tail:( _ ('<=' / '>=' / '<' / '>' / '=' / '!=') _ Sum)*
    {
        return op(head, tail)
    }

Sum
  = head:Mul tail:(_ ("+" / "-") _ Mul)*
    {
        return op(head, tail)
    }

Mul
  = head:Factor tail:(_ ("*" / "/") _ Factor)*
    {
        return op(head, tail)
    }


Factor
    = value:(Braces / List / Atom) suffixes:Suffix*
    {
        return suffixes.reduce(function (v, wrapper) {
            return wrapper(v);
        }, value);
    }


Suffix
    = PropertyAccess / Call


PropertyAccess
    = _ "." _ identifier:Identifier
    {
        return function (value) {
            return new parser.PropertyAccess(value, identifier);
        }
    }

Call
    = _ "(" _ args:ExpressionList? _ ")"
    {
        return function (value) {
            return new parser.Call(value, args || []);
        }
    }


Braces
    = "(" _ expr:Expression _ ")"
    {
        return new parser.Embraced(expr)
    }


List
    = "[" _ items:ExpressionList? _ "]"
    {
        return new parser.List(items || []);
    }



ExpressionList
    = head:Expression tail:( _ "," _ e:Expression { return e } )*
    {
        return [head].concat(tail)
    }


Atom = Dice
     / Integer
     / Const;


Const
    = c:Identifier
    {
        return new parser.Const(c)
    }


Integer "integer"
    = "-"? [0-9]+
    {
        return new parser.Number(parseInt(text(), 10));
    }

Dice "dice"
    = amount:[0-9]* [dDwW] sides:[0-9]+
    {
        return new parser.Dice(parser.asInt(amount) || 1, parser.asInt(sides))
    }

Identifier "identifier"
    = [a-zA-Z0-9]+
    {
        return text()
    }


_ "whitespace"
  = [ \t\n\r]*
  { return null }
