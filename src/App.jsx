import { useState, useEffect } from "react"
import axios from 'axios'

import emptyCart from '/assets/images/illustration-empty-cart.svg'


import cartIcon from '/assets/images/icon-add-to-cart.svg';

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

    let screenType = screenWidth()
    

    const [products, setProducts] = useState([])

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
        let alreadySelected = selectedProducts.some(selection => selection.itemName === product.name);

        if (alreadySelected) {
            setSelectedProducts(prevSelections => 
                prevSelections.map(selection => {
                    if(selection.itemName === product.name) { 
                        return { ...selection, count: selection.count + 1 }
                    } else {
                        return selection
                    } 
                })
            );

            return
        }



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


    const removeItem = (product) => {
        const checkCount = selectedProducts.find(selection => selection.itemName === product.name)
        console.log(checkCount)

        if(checkCount.count > 1) {
            const updatedSelections = selectedProducts.map(selection => {
                if(selection.itemName === product.name) {
                    return { ...selection, count: selection.count - 1 };
                } else {
                    return selection;
                }
            });
            setSelectedProducts(updatedSelections);
        }
        else {
            const editedSelections = selectedProducts.filter(selection => selection.itemName !== product.name);
            setSelectedProducts(editedSelections)
        }
    }

    const totalItems = () => {
        if(selectedProducts.length === 0) {
            return;
        }
        else if (selectedProducts.length === 1) {
            return selectedProducts[0].count
        }
        else {
            const total = selectedProducts.reduce((prev, curr) => prev.count + curr.count)
            return total;
        }
    }

    const totaled = totalItems()

    console.log(selectedProducts)


    return (
        <main className={screenType !== "mobile" ? "main" : "mobile_main"}>
            <section className="product_section">
                <h1>Desserts</h1>

                <div className="products_grid">


                {products && products.map(product => {
                    screenType
                    const imageUrl = product.image[screenType]
                    const matchedProduct = selectedProducts.find(item => item.itemName === product.name);

                    return (
                        <div key={product.name} className="product_container">
                            <img aria-label={`Image of ${product.name}`}
                            src={imageUrl} className="product_image"/>

                            <div className="cart_button_container">


                                {!matchedProduct && (
                                    <div className="default_add" role="butto n" aria-label="Add to cart" onClick={() => addToCart(product)}>
                                        <img src={cartIcon}/>
                                        <p>Add to cart</p>
                                    </div>
                                )}

                                {matchedProduct && (
                                    <div className="added_product">

                                        <button type="button" aria-label="Remove Item" className="quantity_button" onClick={() => removeItem(product)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 10 2">
                                                <path d="M0 .375h10v1.25H0V.375Z"/>
                                            </svg>
                                        </button>

                                        <p className="product_count">{matchedProduct.count}</p>

                                        <button type="button" aria-label="Add Item" className="quantity_button" onClick={() => addToCart(product)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 10 10">
                                                <path d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
                                            </svg>
                                        </button>

                                    </div>
                                )}

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
                <h2>Your Cart ({totaled ? `${totaled}` : `0`})</h2>

                {selectedProducts && (
                    <div className={selectedProducts.length === 0 ? "empty_cart" : ""}>

                        <img src={selectedProducts.length === 0 ? emptyCart : ""}/>

                        {selectedProducts.length === 0 && <p className="empty_text">Your added items will appear hear</p>}

                    </div>
                )}

                <div>
                    {!selectedProducts && (
                        <div></div>
                    )}
                </div>

            </section>
        </main>
    )
}

export default App
