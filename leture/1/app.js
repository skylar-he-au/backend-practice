const express = require('express');
const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//     res.json([hello])
// });

app.get('/users/:id', (req, res)=>{
    res.json({id: req.params.id});
})

app.get('/search', (req, res)=>{
    const q = req.query
    res.json({q})
})

app.post('/users', (req,res)=>{
    res.status(201).json(req.body)
})

app.listen(3000, () => {
    console.log('Server listening on port 3000')
});