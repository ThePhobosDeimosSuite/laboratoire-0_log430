## No persistence for Online Sales Orchestrator
### Context
The online sales orchestrator has to save its state somewhere because the second request can't be made before the first one.

### Decision
We save the shopping cart to *ShoppingCartService* after the `/cart` request and save the sales to *SalesService* after the `/checkout` request.

### Status
Accepted

### Consequence
Instead of having a dedicated database for Online Sales Orchestrator where the state of every request is saved, we simply use the already existing services (*ShoppingCartService* and *SalesService*) to keep track of the state. I don't think we really need to save the state in its own database because everytime we make a request it either ends at **State.SagaEnded** or **State.ShoppingCartAdded**. A downside could be that we have to fetch the shopping cart when receiving the `/checkout` request.