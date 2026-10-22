# Frontend Mentor - Shortly URL shortening API Challenge solution

This is a solution to the [Shortly URL shortening API Challenge challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/url-shortening-api-landing-page-2ce3ob-G) by [Walker Alfaro](https://walkeralfaro.com/). 

## Table of contents

- [Frontend Mentor - Shortly URL shortening API Challenge solution](#frontend-mentor---shortly-url-shortening-api-challenge-solution)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
    - [The challenge](#the-challenge)
    - [Links](#links)
  - [My process](#my-process)
    - [Built with](#built-with)
    - [What I learned](#what-i-learned)
    - [Continued development](#continued-development)
  - [Author](#author)


## Overview

### The challenge

Users should be able to:

- View the optimal layout for the site depending on their device's screen size
- Shorten any valid URL
- See a list of their shortened links, even after refreshing the browser
- Copy the shortened link to their clipboard in a single click
- Receive an error message when the `form` is submitted if:
  - The `input` field is empty

### Links

- Solution URL: [Code](https://github.com/walkeralfaro/url-shortener.git)
- Live Site URL: [Urlshortener](https://urlshortener.walkeralfaro.com/)

## My process

### Built with

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - JS library
- React-Hook-Form
- Shadcn
- Mongoose
- MongoDB Atlas


### What I learned

I developed this project **without using the [Clean URI API](https://cleanuri.com/docs)**, which was originally suggested in the challenge. Instead, I built a **custom backend** that handles **GET requests** to any route following the pattern `mydomain.com/r/123abc`.

When this request is made, the backend performs the following steps:

1. **Checks the database** to see if the provided parameter (`123abc`) exists.

   ```js
   const record = await LinkModel.findOne({ shortUrl });
   ```
2. **Retrieves the corresponding original URL** associated with that short code.
3. **Validates that the retrieved URL is a real and properly formatted address**, using a schema defined with **Zod**:

   ```js
   const parsed = LinkSchema.safeParse({ url: record.url });
   ```

For **input validation**, I used **Zod** both on the frontend and backend to ensure data consistency across the entire stack.

This project was built with **Next.js**, taking advantage of its **full-stack capabilities**, and uses **MongoDB Atlas** as the database.

### Continued development

This project has the potential to evolve into a **fully functional URL shortening service**. A good starting point would be to **add authentication**, supporting both **email/password** and **Google OAuth** login.

Each registered user would have access to their own collection of shortened URLs once logged in.

Additionally, the platform could be expanded with features such as:

* **Analytics** to track how many times each shortened link has been accessed.
* **Custom branded URLs** for businesses.
* **UTM campaign tracking** for marketing purposes.
* Other tools to enhance link management and insights.

## Author

- [Walker Alfaro](https://walkeralfaro.com/)
- Frontend Mentor: [@walkeralfaro](https://www.frontendmentor.io/profile/walkeralfaro)

