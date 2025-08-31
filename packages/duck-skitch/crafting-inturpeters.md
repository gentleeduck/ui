## the parts of a language

1. **Lexer** takes in the linear stream of characters and chunks them together into a series of 
something more akin to “words”, which is what's called **Tokenization** in computer science.
2. **Parser**takes the flat sequence of tokens and builds a tree structure that mirrors the nested 
nature of the grammar. These trees have a couple of different names "parse tree" or 
ATS( abstract syntax tree ).
3. **Static Analysis** takes the parse tree and performs semantic checks to ensure that the code 
is valid, The first bit of analysis is to check that the code is valid, the second is to check that 
it is semantically correct.
4. **Intermediate Representation** takes the parse tree and builds an intermediate representation of
the code, which is a representation that is closer to the actual machine code, but is still 
human-readable, and is easier to work with, and avoid building a full compiler for each built target.
5. **Optimization** takes the intermediate representation and performs a series of transformations to
improve the performance of the code, such as removing dead code, inlining functions, etc.
6. **Code Generation** takes the optimized intermediate representation and generates the actual 
machine code, parse tree and generates an abstract representation of the code.
7. **Virtual Machine** takes the generated machine code and executes it, and returns the result to the
user.
8. **Runtime** takes the virtual machine and executes the code, and returns the result to the user.


# Wong points i have to clarify (FYI I AM NOT FLEXING I AM JUST TALKING)

Interpreters can operate in different ways, with two common types being AST (Abstract Syntax Tree) walking and JIT (Just-In-Time) compilation. JIT compilers are generally much faster than AST-walking interpreters because they convert source code into machine-level bytecode during runtime, which can then be executed much more efficiently. 

This is why JIT is favored in high-performance environments and is used in modern engines like V8 for JavaScript, PyPy for Python, LuaJIT for Lua, and even the .NET runtime for C#. 

In contrast, traditional interpreters that walk the AST tend to be slower since they interpret code directly without compiling it. JIT compilation serves as a hybrid approach it interprets code initially but compiles frequently used code paths into optimized machine code on the fly, improving performance over time. 

Compiled languages, like those written in C or C++, are transformed entirely into machine code ahead of time and can run independently without a separate interpreter or virtual machine. 

These compiled programs tend to have broader system access—such as reading files or accessing low-level memory—which makes them powerful but potentially riskier in terms of security. 

On the other hand, interpreted or VM-based languages (like JavaScript, Lua, and C# in Unity) typically run inside a sandboxed environment, giving the host program fine-grained control over what permissions they have. This makes them more suitable for applications where sandboxing and runtime safety are important-like games, web applications, or plugins. 

For this reason, game engines and app platforms often prefer using scripting languages like Lua or C# instead of native compiled languages, as this helps avoid security risks and enables easier plugin development. 

While the original statements may be casual in tone, the core information shared is largely accurate and reflects a solid foundational understanding of interpreters, compilers, and their real-world applications.
