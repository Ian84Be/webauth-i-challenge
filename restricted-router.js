
const router = require('express').Router();

// endpoints for /api/restricted
router.get('/', async (req,res) => {
    try {
        res.status(200).json({message:'ok go'})
    }
    catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;
