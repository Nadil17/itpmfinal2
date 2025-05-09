import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios";
//


function Cart() {

  const { userId } = useParams();
  const [cartItems , setCartItems] = useState([]);
  const [checkedOrders , setCheckedOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productPrices, setProductPrices] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);



  useEffect(() => {
    axios.get(`http://localhost:8080/api/orders/getCartItems/${userId}`)
      .then((res) => {
        const items = res.data;
        setCartItems(items);
        console.log(items);
  
        // Fetch prices for each product
        items.forEach(item => {
          axios.get(`http://localhost:8080/auth/products/getProductPrice/${item.productId}`)
            .then(priceRes => {
              setProductPrices(prev => ({
                ...prev,
                [item.productId]: priceRes.data.price // adjust this if your DTO structure is different
              }));
            })
            .catch(err => {
              console.error(`Error fetching price for product ${item.productId}`, err);
            });
        });
      });
  }, [userId]);
  

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //Total price for all products
  useEffect(() => {
    let total = 0;
  
    cartItems.forEach(item => {
      if (item.onCart) {
        const price = productPrices[item.productId];
        if (price) {
          total += price * item.quantity;
        }
      }
    });
  
    setTotalPrice(total);
  }, [cartItems, productPrices]);
  
  
  //handle checkbox change
  const handleCheckboxChange = (orderId) => {
    setCheckedOrders(prevCheckedOrders => {
      if(prevCheckedOrders.includes(orderId)){
        return prevCheckedOrders.filter(id => id !== orderId);
      }
      else{
        return [...prevCheckedOrders,orderId];
      }
    });
  }

  const handleConfirmOrder = () => {
    console.log("Selected order IDs:", checkedOrders); // Display the selected orderIds

    

    for (let i = 0; i < checkedOrders.length; i++) {

      const orderId = checkedOrders[i]
      const confirmObject = {
        orderId: orderId,   
        onCart: false,
        status : "Pending"        
      };
    
      axios.put(`http://localhost:8080/api/orders/confirmOrderById`,confirmObject).then((res) => {
        console.log("Order Confirmerd");
        //Remove the item from the UI state after Update Oncart to false
        setCartItems(prevCartItems => prevCartItems.filter(item => item.orderId !== orderId));
      }).catch((err) => {
        alert(err);
      })
    }
    
  };

  const handleRemoveItemsButton = () => {
    for (let i = 0; i < checkedOrders.length; i++) {
      const orderId = checkedOrders[i];
  
      const orderData = {
        orderId: orderId
      };
  
      axios.delete(`http://localhost:8080/api/orders/removeItem`, { data: orderData }).then((res) => {
        console.log("Order removed");
        //Remove the item from the UI state after deletion
        setCartItems(prevCartItems => prevCartItems.filter(item => item.orderId !== orderId));
      }).catch((err) => {
        alert(err);
      });
    }
  };

  return (
    <div>
      
    <div className="container mx-auto px-4 py-6">
      
    <div className="flex justify-end mb-4">
  <div className="bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold">
      Total Price: Rs. {totalPrice.toFixed(2)}
    </h2>
  </div>
</div>

      
      <div className="bg-white shadow-md rounded-lg p-6">
        <ul className="space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              item.onCart ? (
                <li key={index} className="p-4 border-b border-gray-300 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    
                    {/* Checkbox on the left */}
                    <input
                      type="checkbox"
                      className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onChange={() => handleCheckboxChange(item.orderId)}
                    />

                    <div className="flex flex-col">
                      <p className="text-lg font-medium text-gray-700">Product ID: {item.productId}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    
                    <p className="text-xl font-semibold text-green-500">
                      {productPrices[item.productId]
                        ? `Rs. ${(productPrices[item.productId] * item.quantity).toFixed(2)}`
                        : 'Loading...'}
                    </p>


                    <h1>{item.orderId}</h1>
                  </div>
                </li>
              ) : null // Return null if `item.onCart` is false (doesn't render anything)
            ))
          ) : (
            <p className="text-center text-gray-500">No items in the cart.</p>
          )}
        </ul>
      </div>
      
      {/* Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <button 
          onClick={handleConfirmOrder} 
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Confirm Orders
        </button>

        <button 
          onClick={handleRemoveItemsButton} 
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Remove Items
        </button>
      </div>
    </div>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
   
    </div>
  )
}

export default Cart