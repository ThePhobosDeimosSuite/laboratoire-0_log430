# Inheritence

### Context
There are 3 different types of users: 
- an employee working at one of the store location 
- an employee working at the supply center
-  a manager who oversees all activities.

The manager has more power than the supply center employee and the supply center employee has more power than the store employee. A manager has to be able to retrieve stocks to generate a sales report, just like the store employee needs to retrieve stocks to order more stocks. 

### Decision
The manager will inherit from the supply center employee and the supply center employee will inherit from the store employee. This means the manager has the power to do everything as the employees. 


### Status
Accepted

### Consequence
Pictured in the **class diagram** is how each type of users will inherit form one another. Each view will use a specific controller depending on which user is logged in. This will also allow for each users to be tested upon using Jest.