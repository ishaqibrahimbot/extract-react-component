## This is a work in progress

## End goal

Build a codemod that can easily extract a bunch of JSX from any file and refactor it into a separate component. It should be able to detect any props the component would need and copy over those as well.

## Milestones

Figure out how to:

- Use ts-morph to make a very small modification (done)
- Copy over a bunch of code to another file (done)
- Copy over a particular JSX element that does not have any props to another file (done)
- Copy over a JSX element with potential props (wip)
  - Tricky bit is extracting props from JSX expressions in which a deep property is being accessed from the prop or the prop is an array that's being mapped
- Let the user decide WHICH JSX element needs to be copied over

## Try it out

1. Run `yarn` to install dependencies
2. Delete the `NewComponent.tsx` file if it's there (it's okay even if you don't, it gets over-written)
3. Open up your terminal and run `ts-node analyzer.ts`
4. A file `NewComponent.tsx` should have been created
5. In `Component.tsx`, the `div` element (or whichever one was targeted by the analyzer script) should have been replaced with `NewComponent` in JSX form with its props
