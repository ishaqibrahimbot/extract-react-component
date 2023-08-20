So what is the testing strategy?

On a very high level, we want to be able to take an input -> run the codemod on it -> and then
compare the output with some expected output to ascertain if it all worked correctly.

What is the expected output in our case? Two things:

- The original components file has a NewComponent instead of the original component
- The new component file is exactly like we would expect

Now how to make this run. We create a function named runTest which takes the
source file, the codemod, and the expected output.

Inside the function, we're going to set up a new project, then run the codemod on the source
file and save. A new file will be created and one will get modified.

Ohhh so we need to maintain a folder of source and a folder of output. This is like jscodeshift

We import the file from the source, run the codemod on it, then compare the output with the
output files. If they are the same, yee-haw. If not, better luck next time.
