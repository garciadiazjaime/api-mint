# Events API

[![Build Status](https://travis-ci.org/garciadiazjaime/api-events.svg)](https://travis-ci.org/garciadiazjaime/api-events)

## Run project:
a) Install Dependencies

`yarn`

b) Start Server

`yarn dev`

By default server will run on http://localhost:3030

### Graphql Queries
http://0.0.0.0:49161/weather?query={weather{celsius,fahrenheit,pressure,relativeHumidity,lightLevel}}

http://0.0.0.0:49161/events?query={event(uuid:%22%22){title,image,description,url,uuid,price,date}}
