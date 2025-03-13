import colors from 'colors'
import server from './server'

const port = process.env.PORT || 4001



server.listen(port, () => {
    console.log(colors.green.bold('servidorxd en el puerto'), port)
})





// interface Product {
//     id:number
//     price:number
//     name:string
//  }

//  interface FullPorduct extends Product{
 
//     image:string
//  }

// //  interface ProductID{
// //     id:Product['id']
// //  }

//  type ProductID = Pick<Product, "id">

//  let product2 : Product = {
//     id:1,
//     price:30,
//     name:"tablet",
    
//  }

//  let product : FullPorduct = {
//     id:1,
//     price:30,
//     name:"tablet",
//     image:"product.jpg"
//  }