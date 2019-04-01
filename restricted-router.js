
const router = require('express').Router();

router.get('/', async (req,res) => {
    try {
        res.status(200).json({message:'ok go'})
    }
    catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;
