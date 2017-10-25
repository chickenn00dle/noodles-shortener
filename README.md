## Welcome to Chickenn00dle's URL Shortener Microservice

Using the provided URL, add an additional URL to be shortened. The Shortener Microservice will serve the URL in JSON format (along with the original).

IMPORTANT!

1. The microservice will concatenate the protocol to the beginning of your URL, so DO NOT INCLUDE https:// or http:// in your request!

2. Please replace any / in your URL with %2F.

Example:

https://noodles-shortener.glitch.me/www.twitter.com%2FChickenn00dle

Should result in:

{ "originalURL": "https://www.twitter.com/Chickenn00dle", 
  "shortURL": "https://noodles-shortener.glitch.me/[someNumber]" }


Made by [Chickenn00dle](https://twitter.com/ChickenN00dle)
