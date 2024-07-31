import { useState, useEffect } from "react"
import axios from 'axios'


const App = () => {

    const [screenWidth, setScreenWidth] = useState(() => {
        if(screen.width > 1000) {
            return "desktop"
        }
        else {
            return "mobile"
        }
    })

    console.log(screenWidth)

    const [products, setProducts] = useState([])

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


    return (
        <main>
            <section>
                <h1>Desserts</h1>
                {products.map(product => (
                    <div key={product.name} className="product_container">

                    </div>
                ))}
            </section>
        </main>
    )
}

export default App
