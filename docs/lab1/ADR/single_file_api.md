# Single file API

### Context
This app is about a small business application with products and orders where a user can lookup products and create or modify sales. This should be a relatively small app that probably doesn't need anything too fancy. The second ADR addresses how i will be developing a REST api to fufill that goal.

### Decision
If stuff doesn't get too out of hand, i think i'm going to put everything into one file called `app.ts`. I don't think there's gonna be that many routes to deal with so i'm going to try to keep everything as simple as possible considering the small scale of the app.

### Status
Proposed
### Consequence
The app could be more complex that expected. If so i'll have to split code into different files to prevent `app.ts` from becoming too large, for instance by separating the *express* routes from the data fetching done by the *ORM*. 