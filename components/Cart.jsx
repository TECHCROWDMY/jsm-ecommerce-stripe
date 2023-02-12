import React, { useRef } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutLineShopping, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline} from 'react-icons/ti';
import toast from 'react-hot-toast';
import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';
import {CryptoJS} from 'crypto-js/md5';

const Cart = () => {
  const cartRef = useRef();
  const {totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove }= useStateContext();
  
  const cryptoData={
      "amount": "5",
      "currency": "USDT", 
      "network": "TRON", 
      "order_id": "1",
      "address": "TDD97yguPESTpcrJMqU6h2ozZbibv4Vaqm", 
      "url_callback": "https://instagram.com", 
      "is_subtract": "1",
  }
  const handleCheckout = async () => {
    const stripe = await getStripe();
    
    const response = await fetch('/api/stripe',{
                                  method:'POST',
                                  headers:{
                                    'Content-Type':'application/json',
                                  },
                                  body:JSON.stringify(cartItems),
    });
    if(response.statusCode===500) return;

    const data = await response.json();
     
    toast.loading('Redirecting...');

    stripe.redirectToCheckout({sessionId:data.id});

    
  } 
  
  const handleCheckout2 = async () => {

    let newData=JSON.stringify(cryptoData)
    let apiKey = 'bCjEPeLBKsWf2w1mta5agxbr1zSb0jUe18a1lJFPYbxAPE32fSLjZ8MBrzcanOSz1edzinFY5aQRpN65D1Wcak7enaT7il9eH2EUqEZ4OGpI7DiTpxbEDUxaLh8c1qjp'

    const signature = CryptoJS.MD5(btoa(newData)+apiKey)
 
    const response = await fetch('https://api.cryptomus.com/v1/payment',{
                                  method:'POST',
                                  headers:{
                                    'merchant': 'e57f7922-0879-4306-a6a0-6cdc3ea42dcd',
                                    'sign': signature ,
                                    'Content-Type':'application/json',

                                  },
                                  body:JSON.stringify(data),
    });

    if(response.statusCode===500) return;

    const data = await response.json();
     
    toast.loading('Redirecting...');

 
    
  }   
  
  return (
    <div className='cart-wrapper' ref={cartRef}>
      <div className='cart-container'>
        <button
        type='button'
        className='cart-heading'
        onClick={()=>setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className='heading'>Your cart</span>
          <span className='cart-num-items'>({totalQuantities} items)</span>
        </button>

        {cartItems.length < 1 && (
          <div className='empty-cart'>
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
              type='button'
              onClick={()=> setShowCart(false)}
              className="btn">
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
        <div className='product-container'>
          {cartItems.length >= 1 && cartItems.map((item,index)=>(
            <div
            className='product'
            key={item._id}
            >
              <img src={urlFor(item?.image[0])}
              className="cart-product-image" />
              <div className='item-desc'>
                <div className='flex top'>
                  <h5>{item.name}</h5>
                  <h4>{item.price}</h4>
                </div>
                <div className='flex bottom'>
                  <div>
                  <p className='quantity-desc'>
                            <span className='minus'
                            onClick={() => toggleCartItemQuantity(item._id, 'dec') }>
                                <AiOutlineMinus />
                            </span>
                            <span className='num'
                            onClick="">
                                {item.quantity}
                            </span>
                            <span className='plus'
                            onClick={() => toggleCartItemQuantity(item._id, 'inc') }>
                                <AiOutlinePlus />
                            </span>
                        </p>
                  </div>
                  <button
                  type='button'
                  className='remove-item'
                  onClick={() => onRemove(item)}><TiDeleteOutline/></button>
                </div>
              </div>
            </div>
          ))}

        </div>
        {cartItems.length<=1 &&(
          <div className='cart-bottom'>
            <div className='total'>
              <h3>Subtotal:</h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className='btn-container'>
              <button
              type='button'
              className='btn'
              onClick={handleCheckout}
              >Pay with Stripe</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart