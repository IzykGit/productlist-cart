import { useState, useEffect } from "react"
import axios from 'axios'

import emptyCart from '/assets/images/illustration-empty-cart.svg'


import cartIcon from '/assets/images/icon-add-to-cart.svg'

import "./App.css"

const App = () => {

    
    const screenWidth = () => {
        if(screen.width > 1200) {
            return "desktop"
        }
        else if (screen.width > 800) {
            return "tablet"
        }
        else {
            return "mobile"
        }
    }

    const [products, setProducts] = useState([])

    const [cartItems, setCartItems] = useState([])

    const [selectedProducts, setSelectedProducts] = useState([])
    
    const getProducts = async () => {
        try {
            const response = await axios.get('./data.json')
            setProducts(response.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getProducts()
    }, [])

    useEffect(() => {
        screenWidth()
    }, [screen.width])


    const addToCart = (product) => {
        setCartItems(prevItems => [...prevItems, product])

        let exists = false;
        const existingProducts = [...selectedProducts]

        existingProducts.forEach(selection => {
            if(selection.name === product.name) {
                return console.log(true)
            }
        })


        setSelectedProducts(prevCounts => [
            ...prevCounts,
            {
                itemName: product.name,
                thumbnail: product.image.thumbnail,
                price: product.price,
                count: 1
            }
        ])
    }


    return (
        <main className="main">
            <section className="product_section">
                <h1>Desserts</h1>

                <div className="products_grid">


                {products && products.map(product => {
                    const screenType = screenWidth()
                    const imageUrl = product.image[screenType]

                    return (
                        <div key={product.name} className="product_container">
                            <img aria-label={`Image of ${product.name}`}
                            src={imageUrl} className="product_image"/>

                            <div className="cart_button_container">

                                <div className="default_add" role="button" aria-label="Add to cart" onClick={() => addToCart(product)}>
                                    <img src={cartIcon}/>
                                    <p>Add to cart</p>
                                </div>



                            </div>

                            <p className="product_category">{product.category}</p>

                            <p className="product_name">{product.name}</p>

                            <p className="product_price">${product.price}</p>
                        </div>
                    )
                })}


                </div>
            </section>

            <section className="cart_section">
                <h2>Your Cart ({cartItems.length})</h2>

                {cartItems && (
                    <div className={cartItems.length === 0 ? "empty_cart" : ""}>

                        <img src={cartItems.length === 0 ? emptyCart : ""}/>

                        {cartItems.length === 0 && <p className="empty_text">Your added items will appear hear</p>}

                    </div>
                )}

                {!cartItems && (
                    <div>

                    </div>
                )}
            </section>
        </main>
    )
}

export default App
