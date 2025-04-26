# gospel-harmonizer 📖

A website for viewing and comparing **parallel** events from the four New Testament Gospels side by side. Ideal for students of the New Testament or just casual theology enthusiasts.

## Running Locally

1. Clone the repository
   `git clone evancolewright/gospel-harmonizer`

2. Create a new file called `config.js` at the root level of the project and copy the contents of `config.example.js` into it.

   > You will need an api key from https://scripture.api.bible/

3. From the root directory of the source code, run: `npx serve .`

4. Navigate to `localhost:3000/` in your browser

## Current Limitations

The primary limitation is the set of available translations within the site. I've contacted API.Bible and hope to receive access to the **NIV (New International Version)** and **ESV (English Standard Version)** for my demo site in the coming weeks. Also, only the Text Critical New Testament translation has the words of Jesus in red.

## Demo

Live at https://evancolewright.github.io/gospel-harmonizer

## Images

![ui](image.png 'ui')
