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

app.post('/create_new_category', async(req, res)=>{
    try{
       // console.log(req.name);
        const {category_name} = req.body;
        const saveData= await pool.query('INSERT INTO categories (category_name) VALUES ($1)', [category_name]);
           
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

app.get('/get_all_products', async(req, res)=>{
    try{
        const getData= await pool.query('SELECT * FROM products');
        res.send(getData); 
    }catch(err){
        console.error(err.message);
    }
})


app.get('/list_all_categories', async(req, res)=>{
    try{
        const getData= await pool.query('SELECT * FROM categories');
        res.send(getData); 
    }catch(err){
        console.error(err.message);
    }
})

app.get('/get_products_based_on_id/:id', async(req, res)=>{
    try{
       // console.log(req.name);
        const category_id = req.params.id;
        const getProducts= await pool.query('SELECT products.name, products.price, categories.category_name FROM products JOIN categories ON products.category_id =  categories.id WHERE products.category_id = $1', [category_id]);
           
       res.send(getProducts.rows); 
        
    }catch(err){
        console.error(err.message);
    }
})