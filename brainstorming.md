Problem to work through: How to detect which identifiers are props, and which are not?

One very broad solution: if that identifier exists OUTSIDE of that JSX element's boundaries
as well, then it's a prop.

How do you detect if something is outside a JSX element's boundaries?

Let's say you have an identifier -> now you look for references of that identifier. Let's just try
and figure out how to get references first.
