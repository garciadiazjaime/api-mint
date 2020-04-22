# Mint API

[![Build Status](https://travis-ci.org/garciadiazjaime/api-mint.svg)](https://travis-ci.org/garciadiazjaime/api-mint)

## Run project:

- Move to right node version
`nvm use`

- Install Dependencies
`npm i`

- Start Server

`npm start`

By default server will run on http://localhost:3030


- Print sorted items
`items.forEach(item => console.log(new Date(item.post.createdAt), item.rank, item.id))`
