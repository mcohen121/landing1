const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("cart-modal")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart =[];

//open modal cart
cartBtn.addEventListener("click",function(){
updateCartModal()
cartModal.style.display = "flex"
  
})


//end modal when click
cartBtn.addEventListener("click",function(event){
  if(Event.target === cartModal){
    cartModal.style.display = "none"
  } 
})
//for close modal cart
closeModalBtn.addEventListener("click",function(){
  cartModal.style.display = "none"
}) 

menu.addEventListener("click",function(event){
//console.log(evente.target)

let parentButton = event.target.closest(".add-to-cart-btn")
 
if(parentButton){
  const name = parentButton.getAttribute("data-name")
  const price = parseFloat(parentButton.getAttribute("data-price"))
  //console.log(name)
  //console.log(price)
addToCart(name,price)
} 
})

// function for add cart
function addToCart(name,price){
  const existingItem = cart.find(item => item.name === name)
  //alert("the item is "+ price)

  if(existingItem){
    //se existe item,aumeta a quantidade + 1
  existingItem.quantity += 1;
  }else{
    cart.push({
      name,
      price,
      quantity: 1,
    })
  }
  updateCartModal()
}

 //atualize the cart
  function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item =>{
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("flex","justify-between","mb-4","flex-col");

      cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
       <p class="font-bold">${item.name}</P>
       <P>Qtd: ${item.quantity}</p>
       <P class="font-medium mt-4">U$ ${item.price.toFixed(2)}</p>
       </div>

       
       <button class="remove-from-cart-btn" data-name="${item.name}">
       Remover
       </button>
      
       </div>
       `
        total += item.price * item.quantity;

       cartItemsContainer.appendChild(cartItemElement);

    })

    cartTotal.textContent = total.toLocaleString("en",{
      style: "currency",
      currency: "GYD"
    });

    cartCounter.innerHTML = cart.length;

  }

  //function remove item cart
   cartItemsContainer.addEventListener("click",function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
      const name = event.target.getAttribute("data-name")

      removeItemcart(name);
      
    }
   })

  function removeItemcart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
      const item = cart[index];
      
      if(item.quantity > 1){
        item.quantity -= 1
        updateCartModal()
        return
      }
      cart.splice(index,1)
      updateCartModal()

      }
  }

addressInput.addEventListener("input",function(event){
  let inputValue = event.target.value

  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
})


//end delivery
checkoutBtn.addEventListener("click",function(){

   const isOpen = checkOpen()
    if(!isOpen){
       
      Toastify({
        text: "We're closed",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
        onClick: function(){} // Callback after click
      }).showToast();
      
      return;
    }
  

  if(cart.length === 0)return
  if(addressInput.value === ""){
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return
  }

//send orden for api for whatssap
const cartItems = cart.map((item )=>{
    return (
      ` ${item.name} Quantidade: (${item.quantity}) Preco: G$${item.price} |`
    )
}).join("")

const message = encodeURIComponent(cartItems)
const phone = "92991200028"

window.open(`https://wa.me/${phone}?text=${message} Address: ${addressInput.value}`,"_blank")
})

cart = [];
updateCartModal();

//checar time open
function checkOpen(){
  const data = new Date()
  const hora = data.getHours()
  return hora >= 8 && hora < 16
  }

  


const spanItem = document.getElementById("date-span")
const isOpen = checkOpen()

if(isOpen){
  spanItem.classList.remove("bg-red-500")
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}
