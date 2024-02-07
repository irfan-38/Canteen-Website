// color change on click
function myFun(id, itemId) {
  let divId = document.getElementById(id);
  let x = document.getElementById(itemId);
  console.log(x.innerText);
  if (divId.classList == "items") {
    divId.classList.add("ncls");
    x.innerText = "Added to Cart";
  } else {
    divId.classList.remove("ncls");
    x.innerText = "Add to Cart";
  }
}
// smooth scrolling
function scrollToSection(id) {
  var section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
    });
  }
}

// Add click event listeners to the anchor tags
document.querySelectorAll("#categories a").forEach(function (anchor) {
  anchor.addEventListener("click", function (event) {
    event.preventDefault();
    var targetSectionId = this.getAttribute("href").substring(1); // Remove the '#' symbol
    scrollToSection(targetSectionId);
  });
});
// navigation bar toggle
function tog(id) {
  let x = document.getElementById(id);
  if (x.className === "nav-item") {
    x.classList.remove("nav-item");
    x.classList.add("respon");
  } else {
    x.classList.remove("respon");
    x.classList.add("nav-item");
  }
}


// regitration form validation
function validation() {
  let rollno = document.getElementById("rn").value;
  let fname = document.getElementById("first_name").value;
  let lname = document.getElementById("last_name").value;
  let email = document.getElementById("last_name").value;
  let pass = document.getElementById("password").value;
  let cpass = document.getElementById("Cpassword").value;
}
//<================cart functionality====================>
function showCart(crtId) {
  let cId = document.getElementById(crtId);
  if (cId.classList == "cartTab") {
    cId.classList.add("tog-cart");
    cId.classList.remove("cartTab");
  }
}
function closeCart(crtId) {
  let cId = document.getElementById(crtId);
  if (cId.classList == "tog-cart") {
    cId.classList.remove("tog-cart");
    cId.classList.add("cartTab");
  }
}
let listProductHTML = document.querySelector(".menu");
let listProducts = [];
let listCartHTML=document.querySelector(".listCart");
let iconCartSpan=document.querySelector('.cart-items')
let carts=[];
const addDataToHTML = () => {
  listProductHTML.innerHTML ='';
  if (listProducts.length > 0) {
    listProducts.forEach((product) => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('items');
      newProduct.dataset.id=product.id;
      newProduct.innerHTML = `
        <div class="item-image">
          <img src="${product.image}" alt="" />
        </div>
        <div class="item-discription">
          <h2>
            ${product.name}<br>
            <span><i class="uil uil-rupee-sign"></i>${product.price}/-</span>
          </h2>
        </div>
        <div class="btn">
          <button id=${product.btnId} class="addcart" onclick="myFun(${product.id},${product.btnId})">Add to Cart</button>
        </div>
        `;
        listProductHTML.appendChild(newProduct);
    });
  }
}
listProductHTML.addEventListener('click',(event)=>{
  let positionClick=event.target;
  if(positionClick.classList =='addcart'){
      let product_id=positionClick.parentElement.parentElement.dataset.id;
      addToCart(product_id);
  }
})
const addToCart =(product_id)=>{
    let positionThisProductInCart=carts.findIndex((value)=>value.product_id== product_id);
    if(carts.length<=0){
      carts=[{
        product_id: product_id,
        quantity: 1
      }]
    }
    else if(positionThisProductInCart <0)
    {
      carts.push({
          product_id: product_id,
          quantity: 1
      });
    }
    else{
      carts[positionThisProductInCart].quantity++;
    }
   addCartToHTML();
   addCartToMemory();
}
const addCartToMemory=()=>{
  localStorage.setItem("cart",JSON.stringify(carts));
}
const addCartToHTML= ()=>{
  listCartHTML.innerHTML='';
  let totalQuantity=0;
  if(carts.length>0){
    carts.forEach(cart =>{
      totalQuantity=totalQuantity+cart.quantity;
      let newCart = document.createElement('div');
      newCart.classList.add('items');
      newCart.dataset.id=cart.product_id;
      let positionProduct=listProducts.findIndex((value)=> value.id== cart.product_id);
      let info=listProducts[positionProduct];
      newCart.innerHTML=`
      <div class="image">
        <img src="${info.image}" alt="" width="100px">
      </div>
      <div class="name">
        ${info.name}
      </div>
      <div class="totalPrice">
        ${info.price * cart.quantity}
       
      </div>
      <div class="quantity">
        <span class="minus"><</span>
        <span>${cart.quantity}</span>
        <span class="plus">></span>
      </div>
      `;
    listCartHTML.appendChild(newCart);
    })
  }
  iconCartSpan.innerHTML=totalQuantity;
}
listCartHTML.addEventListener('click',(event)=>{
  let positionClick=event.target;
  if(positionClick.classList=='minus'||positionClick.classList=='plus') {
        let product_id=positionClick.parentElement.dataset.id;
        let type='minus';
        if(positionClick.classList.contains('plus')){
          type='plus';
        }
        changeQuantity(product_id,type);
  }
})
const changeQuantity=(product_id,type)=>{
  let positionItemInCart = carts.findIndex((value)=>value.product_id==product_id)
  if(positionItemInCart >=0){
      switch(type){
        case 'plus':
          carts[positionItemInCart].quantity++;
          break;
        default:
          let valueChange =carts[positionItemInCart].quantity--;
          if(valueChange>0){
            carts[positionItemInCart].quantity=valueChange
          }else{
            carts.splice(positionItemInCart,1);
          }
          break;
      }
  }
  addCartToMemory();
  addCartToHTML();
  
}
const initApp = () => {
  // get data from json
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      listProducts = data;
      console.log(listProducts);
      addDataToHTML();
      // get cart from memory
      if(localStorage.getitem('cart')){
        carts=JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
      }
    });
};
initApp();
