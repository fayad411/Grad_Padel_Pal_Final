
const CoachReservation = require("../models/CoachReservation");
const Coach = require("../models/Coach");
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
        app.get('/company/by/id/:id', async (req, res) => {
            const company = await Company.findById(req.params.id);
            res.json(company);
        }
        );

        app.delete('/user/reserve/court/:id', authenticateJWT, async (req, res) => {
            try {
                const reservation = await CourtReservation.findById(req.params.id);
                
        
                if (!reservation) {
                    return res.status(404).json({ error: 'Reservation not found' });
                }
                    await CourtReservation.deleteOne({ _id: req.params.id });
                    return res.json('Reservation deleted');
            
            } catch (error) {
                console.error('Error deleting reservation:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        



        app.put('/reserve/slot', authenticateJWT, async (req, res) => {
            const { _id } = req.body;
            console.log("log id",_id);
            const reservation = await CoachReservation.findById(_id );
            console.log("log reservation",reservation);
            if (!reservation) return res.status(400).send('Reservation not found');
            if (reservation.slots.includes(req.user._id)) {
                return res.status(400).send('You already reserved this slot');
            }
            if (reservation.slots.length >= reservation.max_capacity) {
                return res.status(400).send('Reservation is full');
            }

            reservation.slots.push(req.user._id);
            await reservation.save();
            res.json(reservation);
        }
        );

        app.get('/user/reservations', authenticateJWT, async (req, res) => {
            try {
                const courtReservationsfromdb = await CourtReservation.find({ user_id: req.user._id })
                const courtReservations = [];
                for (let i = 0; i < courtReservationsfromdb.length; i++) {
                    const court = await Court.findById(courtReservationsfromdb[i].court_id);
                    courtReservations.push({ 
                        user_id : courtReservationsfromdb[i].user_id ,
                        phone : courtReservationsfromdb[i].phone ,
                        startingTime : courtReservationsfromdb[i].startingTime ,
                        endingTime : courtReservationsfromdb[i].endingTime, 
                        court_name: court? court.name : "Court",
                        location : court? court.location : "Cairo stadium , Nasr City",
                        img_url : court? (court.img_url? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg") : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg",
                        _id : courtReservationsfromdb[i]._id
                    });
                }


        
                const coachReservationsfromdb = await CoachReservation.find({ slots: req.user._id })
                const coachReservations = [];
                for (let i = 0; i < coachReservationsfromdb.length; i++) {
                    const coach = await Coach.findById(coachReservationsfromdb[i].coach_id);
                    const court = await Court.findById(coachReservationsfromdb[i].court_id);
                    coachReservations.push({ 
                        user_id : coachReservationsfromdb[i].user_id ,
                        phone : coachReservationsfromdb[i].phone ,
                        startingTime : coachReservationsfromdb[i].startingTime ,
                        endingTime : coachReservationsfromdb[i].endingTime,
                        coach_name: coach.name , 
                        location : court? court.location : "Cairo stadium , Nasr City", 
                        coach_img : coach.profile_image,
                        court_img : court? (court.img_url? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg") : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg"
                    });
                }

        
                const userReservations = {
                    courtReservations: courtReservations,
                    coachReservations: coachReservations
                };
        
                res.json(userReservations);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        
        
        app.get('/coaches/reservations', async (req, res) => {
            try {
                console.log("coaches reservations");
                const reservations = await CoachReservation.find();
        
                const modifiedReservations = [];
                // Iterate over each reservation
                for (let reservation of reservations) {
                    // Find coach by ID and add coach name to reservation
                    const coach = await Coach.findById(reservation.coach_id);
                    const court = await Court.findById(reservation.court_id);
                    console.log("court", court);
                    modifiedReservations.push({
                        reservation,
                        coach_name: coach.name,
                        location: court ? court.location : "Cairo stadium, Nasr City",
                        coach_img: coach.profile_image,
                        court_img: court ? (court.img_url ? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg") : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg"
                    });
                }
        
                res.json(modifiedReservations);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        
        

        app.get('coaches/reservations/:id', async (req, res) => {
            const reservations = await CoachReservation.find({ coach_id: req.params.id });
            res.json(reservations);
        }
        );

        
        app.post('/company/reserve/court', authenticateJWT, async (req, res) => {
            try {
                const { court_id, startingTime, endingTime } = req.body;
                const court = await Court.findById(court_id);
                const company = await Company.findById(court.company_id);
                const user_id = req.user._id;
        
                var user = await User.findById(user_id);
        
                // Check for existing reservations for the same time slot
                const reservations = await CourtReservation.find({ court_id });
                for (let i = 0; i < reservations.length; i++) {
                    if (
                        (startingTime >= reservations[i].startingTime && startingTime < reservations[i].endingTime) ||
                        (endingTime > reservations[i].startingTime && endingTime <= reservations[i].endingTime)
                    ) {
                        return res.status(400).send('Court is already reserved at this time');
                    }
                }
        
                // Handle user type
                if (!user) {
                    user = await Coach.findById(user_id);
                    if (!user) {
                        user = await Company.findById(user_id);
                    } else {
                        // Handle coach reservation
                        const coachReservation = new CoachReservation({
                            coach_id: user_id,
                            court_id,
                            startingTime,
                            endingTime,
                            phone: user.phone,
                            slots: [],
                            max_capacity: req.body.max_capacity,
                            price: req.body.price,
                        });
                        await coachReservation.save();
                    }
                }

                console.log("court_id" , court_id);
                const reservation = new CourtReservation({
                    court_id,
                    user_id,
                    phone: company.phone,
                    startingTime,
                    endingTime
                });
                const savedReservation = await reservation.save();
                return res.status(200).send(savedReservation);
            } catch (err) {
                console.error(err);
                return res.status(500).send('Internal server error');
            }
        });
        

        app.post('/company/courts/location/all', async (req, res) => {
            try {
                const company_id = req.body._id;
                const location = req.body.location;
                const courts = await Court.find({ company_id, location });
        
                const courtsWithReservations = [];
                for (const court of courts) {
                    const reservations = await CourtReservation.find({ court_id: court._id });
                    console.log("reservations" , reservations);  
                    courtsWithReservations.push({ court, reservations: reservations });
                }
                res.json(courtsWithReservations);
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        



        app.post('/signup/company', async (req, res) => {
            const { name, email, password, phone } = req.body;
        
            try {
                const emailExist = await Company.findOne({ email: email });
                if (emailExist) return res.status(400).send('Email already exists');
        
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
        
                const company = new Company({
                    name,
                    email,
                    password: hashedPassword,
                    phone
                });
        
                const savedCompany = await company.save();
                const token = jwt.sign({ _id: savedCompany._id }, 'Fayad');
                const body = { token, role: "company" };
        
                res.status(200).send(body);
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        });   
    app.put('/company/imageUrl' ,authenticateJWT , async (req , res) => {
        const company = await Company.findById(req.user._id);
        const newCompany = { ...company._doc, profile_image: req.body.imageUrl };
        await Company.updateOne({ _id: req.user._id }, newCompany);
        console.log(newCompany);
        res.json(newCompany);
    }
    );

    app.post('/login/company', async (req, res) => {
        const { email, password } = req.body;
        const company = await Company.findOne   ({ email: email });
        if (!company) return res.status(400).send('Email or password is wrong');
        const validPass = await bcrypt.compare(password, company.password);
        if (!validPass) return res.status(400).send('Invalid password');
        const token = jwt.sign({ _id    : company._id
        }, 'Fayad');
        res.header('auth-token', token).send(token);
    }
    );

    app.get('/company', authenticateJWT, async (req, res) => {
        console.log(req.user);
        const company = await Company.findById(req.user._id);
        console.log(company);
        res.json(company);
    });

    app.post('/company/courts', async (req, res) => {
        const courts = await Court.find  ({ company_id: req.body._id });
        courts.forEach(court => {
            court.img_url = court.img_url? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg";
        });


        res.json(courts);
    }
    );

    app.get('/company/courts', authenticateJWT, async (req, res) => {
        const courts = await Court.find({ company_id: req.user._id });
        courts.forEach(court => {
            court.img_url = court.img_url? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg";
        });


        res.json(courts);
    }
    );

    app.post('/company/new/court', authenticateJWT ,async (req, res) => {
        const { name, location, price } = req.body;
        const court = new Court({
            name,
            location,
            price,
            company_id: req.user._id,
            img_url: req.body.img_url? req.body.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg"
        });
        try {
            const savedCourt = await court.save();
            res.json(savedCourt);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    );

    app.post('/company/court', authenticateJWT, async (req, res) => {
        console.log(req.body);
        const court = await Court.findById(req.body._id);
        if (court.company_id === req.user._id) {
            // delete all reservations for this court
            await CourtReservation.deleteMany({ court_id: req.body._id });
            await CoachReservation.deleteMany({ court_id : req.body._id });

            await Court.deleteOne({ _id: req.body._id });
            res.json('Court deleted');
        }
        else {
            res.json('You are not authorized to delete this court');
        }
    }
    );

    app.put('/company/update/many/courts', authenticateJWT, async (req, res) => {
        const courts = req.body.updatedCourts;
        for (let i = 0; i < courts.length; i++) {
            // append company_id to each court
            courts[i].company_id = req.user._id;
                await Court.updateOne({ _id: courts[i]._id }, { $set: courts[i] });
        }
        console.log(courts);
        res.json('Courts updated');
    }
    );

    app.get('/company/loacions', authenticateJWT, async (req, res) => {
        const courts = await Court.find({ company_id: req.user._id });
        const locations = [];
        console.log(courts);
        courts.forEach(court => {
            if (!locations.includes(court.location)) {
                court.img_url = court.img_url? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg";
                locations.push(court.location);
            }
        });
        const locationsWithCourts = [];
        locations.forEach(location => {
            const courtsInLocation = courts.filter(court => court.location === location);
            locationsWithCourts.push({ location, courts: courtsInLocation.length });
        });
        res.json(locationsWithCourts);
    }
    );

    app.post('/company/locations' , async (req , res) => {
        const company_id = req.body._id;
        const locations = [];
        const courts = await Court.find({ company_id: company_id });
        console.log(courts);
        courts.forEach(court => {
            if (!locations.includes(court.location)) {
                court.img_url = court.img_url? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg";
                locations.push(court.location);
            }
        });
        const locationsWithCourts = [];
        locations.forEach(location => {
            const courtsInLocation = courts.filter(court => court.location === location);
            locationsWithCourts.push({ location, courts: courtsInLocation.length });
        });
        res.json(locationsWithCourts);
    }
    );
    app.put('/company/court', authenticateJWT, async (req, res) => {
        const court = await Court.findById(req.body._id);
        if (court.company_id === req.user._id) {
            await Court.updateOne
            ({ _id: req.body._id }, { $set: req.body });

            res.json('Court updated');
        }
        else {
            res.json('You are not authorized to update this court');
        }

    }
    );

    app.get('/company/Locations/all', async (req, res) => {
        const courts = await Court.find();
        const locations = [];
        courts.forEach(court => {
            if (!locations.includes(court.location)) {
                court.img_url = court.img_url? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg";
                locations.push(court.location);
            }
        });
        res.json(locations);
    }
    );

    app.post('/company/reservations', async (req, res) => {
        const reservations = await CourtReservation.find({ company_id: req.body._id });
        res.json(reservations);
    });

    app.post('/company/info', async (req, res) => {
        const company = await Company.findById(req.body._id);
        res.json(company);
    }
    );

    // get company with all its courts and reservations
    app.post('/company/fullinfo', async (req, res) => {
        const company = await Company.findById(req.body._id);
        const courts = await Court.find({ company_id: req.body._id });
        courts.forEach(court => {
            court.img_url = court.img_url? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg";
        });


        const reservations = await CourtReservation.find({ company_id: req.body._id });
        res.json({ company, courts, reservations });
    }
    );

    app.get('/company/courts/locations' , async (req , res) => {
        const courts = await Court.find();
        const locations = [];
        courts.forEach(court => {
            if (!locations.includes(court.location)) {
                court.img_url = court.img_url? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg";
                locations.push(court.location);
            }
        });
        res.json(locations);
    }   
);
    app.get('/company/courts/location/:location', async (req, res) => {
        const courts = await Court.find({ location: req.params.location });
        //add company name to each court
        for (let i = 0; i < courts.length; i++) {
            const company = await Company.findById(courts[i].company_id);
            courts[i].company_name = company.name;
            courts[i].img_url = courts[i].img_url? courts[i].img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg";
        }
        res.json(courts);
    }
    );

    app.get('/company/courts/locations', async (req, res) => {
        const courts = await Court.find({ company_id: req.body._id });
        const locations = [];
        courts.forEach(court => {
            if (!locations.includes(court.location)) {
                court.img_url = court.img_url? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg";
                locations.push(court.location);
            }
        });
        res.json(locations);
    }
    );

    app.get('/companies', async (req, res) => {
        const companies = await Company.find();
        for (let i = 0; i < companies.length; i++) {
            const courts = await Court.find({ company_id: companies[i]._id });
            
            const locations = [];
            courts.forEach(court => {
                if (!locations.includes(court.location)) {
                    court.img_url = court.img_url? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg";
                    locations.push(court.location);
                }
            });
            companies[i] = { company: companies[i], locations };
        }

        res.json(companies);
    }
    );

    app.post('/company/locations/for', async (req, res) => {
        console.log(req.body);
        const company_id = req.body._id;
        console.log(company_id);
        const locations = [];
        const courts = await Court.find({ company_id: company_id });
        courts.forEach(court => {
            if (!locations.includes(court.location)) {
                court.img_url = court.img_url? court.img_url : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg";
                locations.push(court.location);
            }
        });

        res.json(locations);
    }
    );  
    


}
