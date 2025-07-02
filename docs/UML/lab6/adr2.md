## Stocks service returning an error if no more stocks
### Context
When the orchestrator is reserving stocks, it first has to check if there's enough because the *StocksService* allows for stocks to go below 0. The orchestrator thus has to do 2 different requests back-to-back. 

### Decision
A way to fix this would be to make the *StocksService* check if stocks will be going below 0 and then return an error. Then the orchestrator would only have to tell the *StocksService* to reduce stocks instead of doing 2 requests to check then reduce.  

### Status
Not implemented yet

### Consequence
This is a good improvement, but i haven't done it yet.