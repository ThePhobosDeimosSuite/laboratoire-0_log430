# REST API

### Context
The user needs to be able to view each product in the database. He's also going to create and modify orders which will be added to the server. These require alot of input from the user.

### Decision
The recommended way to do such a simple project would be a small and simple command line program. I personnally think having the user type complex orders with multiple product ids and corresponding amounts can get convoluted with simply the command line. That's why i'm going to focus on making a proper REST API which will hopefully streamline inputs coming to the server. Furthermore, the server needs to support at least 3 users simultaneously which a REST API can easily do.

### Status
Accepted
### Consequence
It will inevitabely be a more complicated app to develop but i think it's going to be simpler to test. Tools like Postman make it very easy to test HTTP request which i think will be less of a pain in the long run compared to typing stuff in the terminal.