const router = require('express').Router()
const { format, startOfDay } = require('date-fns')
const db = require('../../models')


//get route to render events for today
router.get('/event', async (req, res) => {
    try{
        const events = await db.Event.find({"start.date": startOfDay( new Date()).toISOString()})
        if(events) {
            res.send(events)
        } else {
            res.send({
                message: "Nothing Scheduled today!"
            })
        }
    }catch(error) {
        res.status(500).send(error)({msg: 'Get events failed!'})
    }
})

router.get('/allevents', async (req, res) => {
    try{
        const allEvents = await db.Event.find({})
        res.json({allEvents})
    }catch(error) {
        res.status(500).send(error)
    }
})

// post /createEvent == create a new event
router.post('/createEvent', async (req, res) => {
    try{
        // create our new event
        const newEvent = db.Event({

            kind: req.body.kind,
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            creator: {
              name: req.body.name,
              userId: req.body.userId,
            },
            start: {
              date: req.body.start.date,
              time: { hours: req.body.start.time.hours, minutes: req.body.start.time.minutes, ap: req.body.start.time.ap, allday: req.body.start.time.allday },
            },
            end: {
              date: req.body.end.date,
              time: { hours: req.body.end.time.hours, minutes: req.body.end.time.minutes, ap: req.body.end.time.ap, allday: req.body.end.time.allday },
            }
        
        })
        
        await newEvent.save()

        // const foundEvent = await db.Event.findOne({
        //     name: req.body.name,
        //     _id: req.body._id
        // }).populate('users')
        // res.json({ msg: 'Users Populated!'})
        // console.log(foundEvent)
    }catch(error) {
        res.status(500).json({msg: 'Event creation failed!'})
    }
})

router.put('/editevent/:id', async (req, res) => {
    try {
        const { body } = req
        let updateEvent = await db.Event.findByIdAndUpdate(req.params.id, body)
        
        res.send(updateEvent)
        // console.log(updateEvent)
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
})

router.delete('/deleteevent/:id', async (req, res) => {
    try{
        const deleteEvent = await db.Event.findByIdAndDelete(req.params.id)
        // res.redirect('/api-v1/calendar/allEvents')
    }catch(error){
        res.status(500).json({msg: 'Event deletion failed!'})
    }
})

module.exports = router