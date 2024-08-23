const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Función para cifrar la contraseña
function hashPassword(password) {
    const hash = crypto.createHash('sha512');
    hash.update(password);
    return hash.digest('hex');
}

function verificarToken(req, res, next) {
    const token = req.headers.authorization; // Obtén el token del encabezado

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    next();
}


//conexion a la base de datos
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.etswubb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log('> Connected to MongoDB');
}).catch((err) => {
    console.log('Error: ', err.message);
});

const app = express();
app.use(cors())
app.use(express.json());
app.listen(3000, () => {
    console.log(`> Server Started at ${3000}`);
});


const DetalleVenta = mongoose.model('DetalleVenta', {
    name: String,
    direccion: String,
    numerotel: String,
    correo: String,
    producto: String,
    cantidad: String
});

const Users = mongoose.model('Users', {
    fullname: String,
    email: String,
    password: String
});

const Productos= mongoose.model('Productos', {
    name: String,
    descripcion: String,
    presio: Number
    
});

app.post('/user', async (req, res) => {
    const users = new Users(req.body);
    try {
        await users.save();
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/vender', async (req, res) => {
    const venta = new DetalleVenta(req.body);
    try {
        await venta.save();
        res.send(venta);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await Users.find();
        res.send(users);
    } catch (error) {
        res.status(500).send
    }
});

app.patch('/animals/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const _id = req.params.id;
        await Animals.findByIdAndUpdate(_id, req.body);
        res.send({ message: "Animal was updated" });
    } catch (error) {
        res.status(500
        ).send(error);
    }
});

app.delete('/animals/:id', async (req, res) => {
    try {
        const animal = await Animals.findByIdAndDelete(req.params.id);
        if (!animal) {
            res.status(404).send("No animal found");
        }
        res.send({ message: "Animal was deleted" });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/register', verificarToken,async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = hashPassword(req.body.password);

    const user = new Users({
        name: name,
        email: email,
        password: password
    });

    try {
        await user.save();
        res.send({ message: "User was registered" });
    } catch (error) {
        res.status(500
        ).send(error);
    }
});

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await Users.findOne({ email: email, password: password });
        if (!user) {
            return res.send({ message: "User not found" });
        }
        console.log("Iniciando secion desde el navegador")
        return res.send({ message: "Welcome"});
    } catch (error) {
        return res.status(500
        ).send(error);
    }
});
