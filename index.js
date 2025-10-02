const express = require('express');
const session = require('express-session');
const multer = require('multer');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const packages = require('./packages.json'); //
const gallery = require('./gallery.json'); //


const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public_html')); // keep serving your HTML/CSS/JS
app.use(session({
  secret: 'wanderlust-secret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views'); 

// Database connection
const db = new sqlite3.Database('wanderlust.sqlite');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public_html/home.html'); 
});

app.get('/packages', (req, res) => {
  res.render('packages', { packages }); // pass JSON directly
});

app.get('/gallery', (req, res) => {
  res.render('gallery', { gallery }); // send gallery data to EJS
});


// Signup route
app.post('/signup', (req, res) => {
  const { fullname, email, password, confirmPassword, ContactNumber } = req.body;

  if (password !== confirmPassword) {
    return res.send(`
      <script>
        alert("❌ Error: Passwords do not match.");
        window.location.href = 'login.html';
      </script>
    `);
  }

  db.run(
    `INSERT INTO users(fullname, email, password, contact) VALUES(?, ?, ?, ?)`,
    [fullname, email, password, ContactNumber],
    (err) => {
      if (err) {
        console.error("DB Error:", err.message);
        if (err.message.includes("UNIQUE constraint failed: users.email")) {
          return res.send(`
            <script>
              alert("⚠️ This email is already registered. Please log in instead.");
              window.location.href = 'login.html';
            </script>
          `);
        }
        return res.send(`
          <script>
            alert("❌ Error creating account: ${err.message}");
            window.location.href = 'login.html';
          </script>
        `);
      }
      res.send(`
      <script>
      alert("🎉 New account created successfully! Please log in.");
      window.location.href = 'login.html';
      </script>
      `);
    }
  );
});


//  Login route
app.post('/login', (req, res) => {
  const { loginEmail, loginPassword } = req.body;
  db.get(
    `SELECT * FROM users WHERE email=? AND password=?`,
    [loginEmail, loginPassword],
    (err, row) => {
      if (row) {
        req.session.user = row;
        res.redirect('/myaccount');
      } else {
        res.send("Invalid login. Try again.");
      }
    }
  );
});

// myacc route
app.get('/myaccount', (req, res) => {
  if (!req.session.user) {
    return res.redirect('login.html');
  }
  res.render('myaccount', { user: req.session.user });
});


//  Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('login.html');
});

// storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public_html/uploads'); // folder to save uploaded images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Feedback form
app.post('/feedback', upload.single('image'), (req, res) => {
  const { name, email, phone, message } = req.body; // include email from form
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  db.run(
    `INSERT INTO feedback(name, email, phone, message, image) VALUES(?, ?, ?, ?, ?)`,
    [name, email, phone, message, imagePath],
    (err) => {
      if (err) {
        console.error("Feedback DB error:", err.message);
        return res.send("Error saving feedback.");
      }
      res.send(`
      <div style="font-family: Arial; text-align: center; padding: 50px;">
      <h2>🎉 Thank you for your feedback!</h2>
      <p>We really appreciate your input.</p>
      <a href="contactus.html" 
      style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px;">
      Go back to Contact Us
      </a>
      </div>
      `);
    }
  );
});

//  Feedback list
app.get('/feedback-list', (req, res) => {
  db.all(`SELECT * FROM feedback`, [], (err, rows) => {
    if (err) return res.send("Error fetching feedback.");
    res.json(rows);
  });
});

app.get('/myaccount-data', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json({ fullname: req.session.user.fullname, email: req.session.user.email });
});


// 404
app.use((req, res) => {
res.status(404).json({ error: "404 Page Not Found" });
});


// Start server
app.listen(port, () => {
  console.log(`Web server running at: http://localhost:${port}`);
  console.log("Type Ctrl+C to shut down the web server");
});


