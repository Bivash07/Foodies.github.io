const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");


require("./db/conn");
const Register = require("./models/registers");


const port = process.env.PORT || 4400;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// console.log(path.join(__dirname, "../public"));  (this will give complete path of public folder)
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views" , template_path);
hbs.registerPartials(partials_path)

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/", (req,res) => {
    res.render("index")
});

app.get("/register", (req,res) => {
    res.render("register");
})

// create a new user in our database
app.post("/register", async (req,res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if( password === cpassword ){

            const registerPerson = new Register({
                email : req.body.email,
                password : password,
                confirmpassword : cpassword,
                phone : req.body.phone
            })

            const registered = await registerPerson.save();
            res.status(201).render("index");

        }else{
            res.send("passwords are not matching")
        }


    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/login", (req,res) => {
    res.render("login");
})

app.get("/home", (req,res) => {
    res.render("home");
})

app.get("/menu", (req,res) => {
    res.render("Menu");
})

// login check

app.post("/login", async(req,res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        //console.log(`email is ${email} and password is ${password}`)

        const useremail = await Register.findOne({email:email});
        // res.send(useremail);
        // res.send(useremail.password);
        // console.log(useremail);

        if ( useremail.password === password ) {
            res.status(201).render("home");
        } else {
            // res.send("password is not matching");
            res.status(400).send("Invalid login Details");
        }

    } catch (error) {
        // res.status(400).send("invalid Email")
        res.status(400).send("Invalid login Details");
    }
})

// generate Recipe page

app.get("/recipe", (req,res) => {
    res.render("recipe");
})

app.listen(port, () => {
    console.log(`server is running at port no. ${port}`);
})




const Order = require("./models/orders");

// Define a route to handle order submission
app.post('/order', async (req, res) => {
    try {
        // Extract item name, price, and receiverName from request body
        const { itemName, itemPrice, receiverName } = req.body;

        // Create a new order instance
        const order = new Order({
            receiverName, // Add receiverName to the order
            itemName,
            itemPrice
            
        });

        // Save the order to the database
        await order.save();

        // Send success response
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
