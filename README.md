FIRECOMM:
Blah blah blah blah blah
Proto File
|                |                |
|----------------|----------------|

What are gRPC distributed systems
```mermaid
graph LR
A{gRPC Server <br> Node.js <br> Port: 3999 <br> Port: 2222 <br> Port: 300 <br> Port: 1111 <br> Port: 8080 <br> Port: 3333} ===|Channel<br/>3999|B(gRPC hybrid Server/Client <br> Node.js<br> Stub: 3999 <br> Port: 300)
B ===|Channel <br/> 7000| C
A ===|Channel <br/> 8080|C((gRPC Client <br/> Node.js <br> Stub: 7000 <br> Stub: 8080))
A ===|Channel <br/> 2222|D((gRPC Client <br/> Java <br> Stub: 2222 <br> Stub: 300))
A ===|Channel <br/> 300|D
A ===|Channel <br/> 1111|E((gRPC Client <br/> goLang <br> Stub: 1111))
A ===|Channel <br> 3333|F((gRPC CLient <br>
```