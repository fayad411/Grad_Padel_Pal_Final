const CoachReservation = require("../models/CoachReservation");
const Coaches = require("../models/Coach");
const Court = require("../models/Court");
const User = require("../models/User");
const authenticateJWT = require("../middleware/authmiddleware");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const { json } = require("body-parser");
const Company = require("../models/Company");
const CourtReservation = require("../models/CourtReservation");
const bcrypt = require('bcryptjs');

module.exports = (app) => {
    app.post('/signup', async (req, res) => {
        console.log(req.body);
        const { name, email, password, phone } = req.body;
    
        try {
            const emailExist = await User.findOne({ email: email });
            if (emailExist) return res.status(400).send('Email already exists');
    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            const user = new User({
                name,
                email,
                password: hashedPassword,
                phone
            });
    
            const savedUser = await user.save();
            const token = jwt.sign({ _id: savedUser._id }, 'Fayad');
            const body = { token, role: "user" };
            res.status(200).send(body);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
    
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        console.log(req.body);
    
        try {
            let user = await User.findOne({ email });
            let role = "user";
    
            if (!user) {
                let company = await Company.findOne({ email });
                if (company) {
                    role = "company";
                    const validPass = await bcrypt.compare(password, company.password);
                    if (!validPass) return res.status(400).send('Invalid password');
                    const token = jwt.sign({ _id: company._id }, 'Fayad');
                    res.status(200).send({ token, role });
                } else {
                    let coach = await Coaches.findOne({ email });
                    if (coach) {
                        const validPass = await bcrypt.compare(password, coach.password);
                        if (!validPass) return res.status(400).send('Invalid password');
                        const token = jwt.sign({ _id: coach._id }, 'Fayad');
                        role = "coach";
                        res.status(200).send({ token, role });
                    } else {
                        return res.status(400).send('Email or password is wrong');
                    }
                }
            } else {
                const validPass = await bcrypt.compare(password, user.password);
                if (!validPass) return res.status(400).send('Invalid password');
                const token = jwt.sign({ _id: user._id }, 'Fayad');
                console.log(token);
                res.status(200).send({ token, role });
            }
        } catch (error) {
            console.error("Error:", error.message);
            res.status(500).send("Internal Server Error");
        }
    });

    app.get('/user', authenticateJWT, async (req, res) => {
        const user = await User.findById(req.user._id);
        res.json(user);
    }
    );
    app.put('/user/imageUrl', authenticateJWT, async (req, res) => {
        const user = await User.findById(req.user._id);
        user.profile_image = req.body.imageUrl;
        await user.save();
        res.json(user);
});
}
