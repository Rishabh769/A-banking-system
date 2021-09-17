const express = require("express");
const path = require("path");
const app = express();
const port = 80;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./models/user');
require('./models/transactionHistory');
const User = mongoose.model('User');
const History = mongoose.model('History');

// var MongoClient= mongodb.MongoClient;




mongoose.connect("mongodb+srv://rishabh-769:123@tsf-data.v1mk4.mongodb.net/tsf?retryWrites=true&w=majority",{useNewUrlParser: true});

// app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())
// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory





// ENDPOINTS
app.get('/', (req, res)=>{
    const params = {}
    res.status(200).render('home.pug', params);
})
app.get('/aboutus', (req, res)=>{
    const params = {}
    res.status(200).render('aboutus.pug', params);
})

app.get('/allaccounts', (req, res)=>{
  User.find()
  .then((users) => {
    console.log(users)
    res.render('allaccounts', { title: 'All Account Holders', users });
  })
.catch(() => { res.send('Sorry! Something went wrong.'); });
});


// app.get('/transactions', (req, res)=>{
//     const params = {}
//     res.status(200).render('transactions.pug', params);
// })

app.get('/transactions', (req, res) => {
    History.find()
      .then((histories) => {
        res.render('transactions', { title: 'Listing Transactions', histories });
      })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
  
  });

app.get('/moneysender', (req, res)=>{
    User.find().then((users) => {
      console.log(users)
    res.render('moneysender', { users });
    })
   
})

app.post('/', (req, res) => {
  var balance = req.body.amount;
  var name1 = req.body.name1;
  var name2 = req.body.name2;
  const history = new History({
    Creditor: name1,
    Recipient: name2,
    Amount: balance
  });
  history.save();

  User.findOne({Username: name1 }, (err, user) => {
    if (err)
        console.log(err);
    else
        User.findOne({ Username: name2 }, (err, receipt) => {
            if (err)
              console.log(err);
            else{                  
              user.Balance -= Number(balance);
              user.save();
              console.log(user);
              receipt.Balance += Number(balance);
              receipt.save();
              console.log(receipt);
            }
            })
          }) 
       
  res.redirect('transactions');
});

// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
})