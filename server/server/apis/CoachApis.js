
const CoachReservation = require("../models/CoachReservation");
const Coaches = require('../models/Coach');
const Court = require("../models/Court");
const User = require("../models/User");
const authenticateJWT = require("../middleware/authmiddleware");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const { json } = require("body-parser");
const bcrypt = require('bcryptjs');

module.exports = (app) => {
    app.post('/signup/coach', async (req, res) => {
        const { name, email, password, phone, aboutMe } = req.body;
    
        try {
            const emailExist = await Coaches.findOne({ email: email });
            if (emailExist) return res.status(400).send('Email already exists');
    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            const coach = new Coaches({
                name,
                email,
                password: hashedPassword,
                phone,
                about_me: aboutMe
            });
    
            const savedCoach = await coach.save();
            const token = jwt.sign({ _id: savedCoach._id }, 'Fayad');
            const body = { token, role: "coach" };
    
            res.status(200).send(body);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
    

    app.put('/coach/imageUrl', authenticateJWT, async (req, res) => {
        const coach = await Coaches.findById(req.user._id);
        coach.profile_image = req.body.imageUrl;
        await coach.save();
        res.json(coach);
    }
    );

    app.post('/login/coach', async (req, res) => {
        const { email, password } = req.body;
        const coach = await Coaches.findOne({ email: email });
        if (!coach) return res.status(400).send('Email or password is wrong');

        const validPass = await bcrypt.compare(password, coach.password);
        if (!validPass) return res.status(400).send('Invalid password');
        const token = jwt.sign({ _id    : coach._id
        }, 'Fayad');    
        res.header('auth-token', token).send(token);
    }
    );

    app.get('/coach', authenticateJWT, async (req, res) => {
        const coach = await Coaches.findById(req.user._id);
        res.json(coach);
    });

    app.post('/coach/reservations', async (req, res) => {
        const reservations = await CoachReservation.find({ coach_id: req.body._id });
        res.json(reservations);
    });

    app.post('/coach/info', async (req, res) => {
        const coach = await Coaches.findById  (req.body._id);
        res.json(coach);
    }
    );

    

}




