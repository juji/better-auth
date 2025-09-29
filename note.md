# An Experiment

This is an experiment to implement authentication systems.

It tries to show how services can be build with auth. Using better-auth.

It also kinda tries to separate concers between auth and the app. 
It creates a separate-entity in an the application stack... in this case, a hono server for auth.
And it also tries to separate the auth-database from the rest of the application.

## First, a simple client-server connection

The client (What you are using right now) is NextJS, and the API server is Hono. You are currently authenticating current session with a hono server.

[/auth-init.png]

I like separating the concern between main app and other services... so i'm choosing this architecture. 
There are plenty of auth service out there. That sends a signal to me, that maybe, auth is that thing that will need to be separated.. eventually scaled-up.

And, i found writing APIs are better using Hono or Express. so there you go... it's a Hono server.

Okay, so the login goes to Hono, and it sends http-only cookies on success. Http-only cookies are better for security.

Below, you can find a result of requesting data to the hono server. If it's green, that means you are authenticated. The data you see is just an echo of the authenticated user's data. This user data is retrieved from the database. It is saying who is currently accessing the API server.

<AccessProtectedResource url={process.env.NEXT_PUBLIC_HONO_SERVER + "/protected"} />

## Second, communicating with other services

So how about communicating with other server? how do i persist this authenticated-state when communicating with other services? 
This communication should be agnostic.. meaning: it should not connect to the auth database to be able to know who the user is.

The answer i found was using JWT and JWKS: https://www.better-auth.com/docs/plugins/jwt

[/jwt.png]

This is rather expensive. since we need to request jwt, everytime we need to authenticate a request. 
But that is the expense of separating concern (we don't want the auth db to be accessed by nextjs or express).

So, the best way is to cache the JWT in memory, client side. JWTs are short-lived.. it is supposed to be short lived. 
This app uses 15-minutes lifetime for jwt tokens.

So caching this in memory makes sense, while preventing security vulnerabilities introduced by using LocalStorage.

This is the result for nextjs /api dir:

<AccessProtectedResource url={"/api/protected"} />

And this is the result for express:

<AccessProtectedResource url={process.env.NEXT_PUBLIC_EXPRESS_SERVER + "/protected"} />

The requests you see there does not touch the auth database. It carries along user data in the JWT.

And from 'honoServerTimestamp', you should be able to see how they both have the same values.. Meaning, we don't request jwt for each request. Rather, we store the jwt in memory, with a pre-determined time-to-live (in our case: 15 mins).

# Third, making it accessible throughout multiple subdomain.

IT IS already acessible throughout different subdomains. check this out:

[iframe to : process.env.NEXT_PUBLIC_BURGUNDY_SERVER]

Nothing more was needed.
