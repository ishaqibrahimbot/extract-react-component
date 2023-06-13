## This is a work in progress

## End goal

Build a codemod that can easily extract a bunch of JSX from any file and refactor it into a separate component. It should be able to detect any props the component would need and copy over those as well.

## Milestones

- Use ts-morph to make a very small modification (done)
- Copy over a bunch of code to another file (wip)
- Copy over a particular JSX element that does not have any props to another file
- Copy over a JSX element with potential props
- Let the user decide WHICH JSX element needs to be copied over
