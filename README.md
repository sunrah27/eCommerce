# eCommerce
An ecommerce site with a shopping basket. Products details are retrived from a JSON file named productdb.json.

Sign-up functionality has not been developed as the site is only displayed using GitHub pages. To login you can try any of the following  user logins.

Pages link can be found at [https://sunrah27.github.io/eCommerce/](https://sunrah27.github.io/eCommerce/)

> [!WARNING]
> Login and Basket information is stored in the browser storage. You can clear local storage by running the command `clearLocalStorage()` in your console.

```
username: john.smith@gmail.com
password: johnspassword
```
```
username: joe.bloggs@gmail.com
password: bloggy
```

## Features
Site has following features completed:
- [x] Build Homepage `index.html`
- [x] Build Products page `products.html`
- [x] Build Products Details page `product-details.html?sku=xxxxx`
- [x] Build Cart page `cart.html`
- [x] Build Login page `login.html`
- [x] Build Contact page `contact.html`
- [x] Create `productDB.json` file
- [x] Refactor Products page to populate from productDB
- [x] Refactor Product Details page to populate using sku passed va URI
- [x] Refactor Homepage to pull product data from producDB
- [x] Refactor Related Products on Product Details page based on pType
- [x] Code shopping Cart functionality
- [x] Create `userDB.json`
- [x] Code User login functionality
- [x] Code filter feature in the Products Page
- [x] Code sort feature
- [x] Replace browser alerts with pop-up notifications
- [x] Added pop-up notification after login
- [x] Added pop-up notification after adding item to shopping basket

## Detailed breakdown of website development

### Inspiration
------
During my Introduction to Web Development Bootcamp I learned a lot about front end web development and wanted to put this knowledge to the test. While brain storming ideas for a project I ultimately settled on an eCommerce website. It had all of the features a typical website may have and to test my knowledge as well as fill any gaps I decided to give it go.

### Challenges
------
First challenge from the very get go was design. Designing an entire website from scratch was difficult and it is important I did not include to many extra features else there was a risk I would over load myself. To this end I decided to go with a simple eCommerce website, with 5 pages.

Second challenge came about after building the static version of the website. I had a website that looked nice but didn't do much. If it was a design prototype I would have ended there but I wanted to build an eCommerce website that offered a variety of features incluing a list of products and a shopping cart. It took me couple of weeks thinking of a way to have a local Database of products. Eventually I overcame this when I realised I could just create a JSON file with all of my product information.

### Building static HTML and CSS
------
Creating the static HTML was not too difficult but setting up all of the CSS was a challenge. Once I maanaged to complete the static HYML and CSS I was forced to refactor it completely in order to make sure I can reuse sections of the code. This took multiple attempts and several moments of frustration where a simple change in CSS or the addition of an extra `div` would cause the site to display incorrectly.

Eventually it became an iterative process. After building couple of pages, I would write the CSS `@media queries` then after building a new page I'd go back to the previous pages and try to consolidate the changes by trying reuse classes.

Howevere, my site only had one product and a lot of non-fuctional links. I was staring at the daunting task of building static pages for every product which I was not very keen and pushed it aside as a last resort. Fortunately I would come across an idea how to over come this issue using JavaScript later.

### Creating JSON files for Products
------
Before I could even touch JavaScript I had to build my `peoductsDB.json` file. Based on my designs I managed to outline few information I required for every product.

But I would ultimately modify the productsDB and remove the two Product Name entries and settle on one. I also needed to include data/time with every product as my Homepage had a latest product module. I debated weather to hard code the ratings amd ultimately decided to incluide it as part of the DB. One odd issue I came across later was tha Product Description. I was unable to include any bullet points, this forced me to spllit it into three differnt properties. Product Description, Product List and Product Materials. A surprise outcome of the DB was the easy way to manage product images. Renaming all of the images with Product SKU made it significantly easier to fetch using JS.

Final Structure of the ProductDB;
```
Unique Product ID: Text
Product Name: Text
Product Description: Text
Product List: Array
Product Materials: Text
Product Type: Text
Product Sizes: Array
Product Images: Array
Product Price: Text
Product Ratings: Text
Product Date: Text
```
### Adding JavaScript
------

#### Building Products Page
Ah, the land of mangic. I decided to populate the Products Page with the products in the `productsDB.json`. This was not a complicated task as all I had to do was to read the data form the JSON file, store it in an object and then reference the information I need. I found myself consolidating a lot of my HTML code and creating simple templates which was looped over multiple times to generate HTML to display all of the products. 

#### Building Product Details Page
Once done I realised I could overcome another issue I was having. What if I passed the product SKU via URL to the Product Details Page and then read the SKU in the URL to display the relevant product information. This will mean I only need one Product Details Page and I can also use the product SKU on the Products Page as part of the anchor link.

I needed to figure out how to pass information via URL and also how to extract this information. After some research I wrote the following fuction:

```javascript
// Function to read SKU from URL
function getSKUFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('sku');
}
```
With this I was now able to search the productDB and display the relevant information. Next step build the Related Products module.

#### Related Products Module
This module proved more difficult then I had first intended. I was able to display all products related to the product on the page but I was also displaying the existing product. After a lot of time tinkering with JS and pulling my hair out I realised all I needed to do was add `!== currentSku` when declaring the relatedProducts object. Some solutions are strangly simple.

```javascript
// Filter products based on the pType of the current product
const relatedProducts = productData.filter(product => product.pType === currentProduct.pType && product.pSku !== currentSku);
```

#### Latest Products Module
Building the Latest Product Module was pretty straight forward after Related Products Module. However, I started noticing a lot of console errors appearing. I had JavaScript code which should run only on specific pages. Thus began the first of many JavaScript refactoring and breaking my site.

#### Building the Shopping Cart
Building the Shopping Cart was pretty simple. I knew from the start I am going to use the browsers local storage. The main issue I began to have was the EventListner not attaching to the button on the Product Details page. After a lot of debugging I discovered the issue was due to the Button HTML being generated using JS in the Products Details page. To resolve this issue I was finally forced to clean up my JavaScript and break my code in to smaller functions. Adding Async and Wait to functions to ensure JS codes only ran after the pages were loaded. I also took time to refactor my code and reduce duplication. One major change was storing the `productDB.json` to a single object called `productData` reducing multiple function calls. I also removed as much code outside of the `document.addEventListener('DOMContentLoaded', async function () { }` as possible. This helped me finally resolve the issue with being able to add an item to the Shopping Cart.

#### Presistent Login and Contact Us
I had originally planned to have a login page which would display the user profile but I decided to skip on the user profile and just create a login feature. The `user`information was stored in a `user.json` file and when the user logs in a key is saved to the browsers local storage. I wrote a new function to run on every page to check if the user is logged in. I also changed the Login link in the main nav to display a greeting message to the `user` after login. Also only when the user is logged in can they access the Shopping Cart page.

#### Filters and Sorts
The final feature left to code was the product filters and the product sort which were part of the design for the Products page. This required a complete rewrite of the JS function poulating the Products Page along with several additional functions had to be created:

- `function populateProductsPage(productData, filterType = 'all', sortType = 'default')`
⋅⋅⋅ Function updated to take filter and sorty arguments

- `function generateProductHTML(product)`
⋅⋅⋅ Function only used to generte HTML code for the products page

- `function populateFilterByTypeDropdown(productData)`
⋅⋅⋅ Function to populate the Filter dropdown using all of the different product types

- `function setupFilterAndSortEventListeners(productData)`
⋅⋅⋅ Function to add Event Listenrs

- `function sortProducts(products, sortType)`
⋅⋅⋅ Function to sort products based on default, price (high and low) and ratings

## Future development
Once I have enough knowledge of Python and MySQL I plan to host a DB which will allow;
- User Registration
- User Accounts Page
- User Purchase History
- Products database
- Product Update UI
- Sales Dashboard
- Email functionality
