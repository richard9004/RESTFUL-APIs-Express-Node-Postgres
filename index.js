const express = require('express');
const app = express();

const pool = require('./db');

app.use(express.json()); // Allows us to access the req.body 
app.use(express.urlencoded({extended:false})); // Allows us to access the req.body 

app.listen('5000', ()=>{
    console.log('DATABASE PORT RUNNING ON '+process.env.PORT);
    console.log('CONNECTED TO '+process.env.DATABASE);
});

app.get('/',(req, res)=>{
    
    res.send('Product Losting here');
});

app.post('/post_data',(req, res)=>{
    const {name} = req.body;
    console.log(name);
    res.status('201').send('Product is created');
});

app.post('/create_new_store', async(req, res)=>{
    try{
       // console.log(req.name);
        const {store_name} = req.body;
        const saveData= await pool.query('INSERT INTO stores (store_name) VALUES ($1)', [store_name]);
           
        res.json(saveData.rows[0]); 
        
    }catch(err){
        console.error(err.message);
    }
})

app.post('/create_new_category', async(req, res)=>{
    try{
       // console.log(req.name);
        const {category_name, store_id} = req.body;
        const saveData= await pool.query('INSERT INTO categories (category_name,store_id) VALUES ($1,$2)', [category_name,store_id]);
           
        res.json(saveData.rows[0]); 
        
    }catch(err){
        console.error(err.message);
    }
})

app.post('/create_new_product', async(req, res)=>{
    try{
       // console.log(req.name);
        const {name, description,price,phone,category_id} = req.body;
        const saveData= await pool.query('INSERT INTO products (name, description, price, phone, category_id) VALUES ($1, $2, $3, $4, $5)', [name, description,price,phone,category_id]);
           
        res.json(saveData.rows[0]); 
        
    }catch(err){
        console.error(err.message);
    }
})

app.get('/list_all_categories/:store_id', async(req, res)=>{
    try{
        const store_id = req.params.store_id;
        const getData= await pool.query('SELECT categories.category_name, stores.store_name FROM categories JOIN stores ON categories.store_id=stores.id WHERE categories.store_id=$1',[store_id]);
        res.send(getData.rows); 
    }catch(err){
        console.error(err.message);
    }
})

app.get('/get_products_based_on_id/:id', async(req, res)=>{
    try{
       // console.log(req.name);
        const category_id = req.params.id;
        const getProducts= await pool.query('SELECT products.name, products.price, categories.category_name, stores.store_name FROM products JOIN categories ON products.category_id = categories.id JOIN stores ON categories.store_id=stores.id WHERE products.category_id = $1', [category_id]);
           
       res.send(getProducts.rows); 
        
    }catch(err){
        console.error(err.message);
    }
})

app.get('/get_all_products_under_store/:id', async(req, res)=>{
    try{
       // console.log(req.name);
        const store_id = req.params.id;
        const getProducts= await pool.query('SELECT products.name, products.price, categories.category_name, stores.store_name FROM products JOIN categories ON products.category_id = categories.id JOIN stores ON categories.store_id=stores.id WHERE stores.id = $1', [store_id]);
           
       res.send(getProducts.rows); 
        
    }catch(err){
        console.error(err.message);
    }
})

app.get('/search/:id', async(req, res)=>{
    try{
        var use_and='';
        var use_and_multiple='';

        var count = Object.keys(req.query).length;
       

        if(count){
             use_and = " AND ";
        }

       
        var product_name=req.query.product_name;
        var category_name=req.query.category_name;

        var product_like_query='';
        var category_like_query='';

        if(product_name!=''){
             product_like_query = `products.name LIKE '${product_name}%'`;
        }

        if(category_name!=''){
            use_and_multiple = "OR "; 
            category_like_query = `categories.category_name LIKE '${category_name}%'`;
        }
      

        
        const store_id = req.params.id;
        const getProducts= await pool.query(`SELECT products.name, products.price, categories.category_name, stores.store_name FROM products JOIN categories ON products.category_id = categories.id JOIN stores ON categories.store_id=stores.id WHERE stores.id = ${store_id} ${use_and} ${product_like_query} ${use_and_multiple} ${category_like_query}`);
           
       // res.send(`SELECT products.name, products.price, categories.category_name, stores.store_name FROM products JOIN categories ON products.category_id = categories.id JOIN stores ON categories.store_id=stores.id WHERE stores.id = ${store_id} ${use_and} ${product_like_query} ${use_and_multiple} ${category_like_query}`); 
       res.send(getProducts.rows); 
    }catch(err){
        console.error(err.message);
    }
})