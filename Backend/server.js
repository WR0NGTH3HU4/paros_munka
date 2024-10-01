require('dotenv').config();
const express = require('express');
var mysql = require('mysql');
const uuid = require('uuid');
var cors = require('cors');
var CryptoJS = require("crypto-js");
var moment = require('moment');

const app = express();
const port = process.env.PORT;
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

var pool  = mysql.createPool({
  connectionLimit : process.env.CONNECTIONLIMIT,
  host            : process.env.DBHOST,
  user            : process.env.DBUSER,
  password        : process.env.DBPASS,
  database        : process.env.DBNAME
});

// get API version
app.get('/', (req, res) => {
  res.send(`API version : ${process.env.VERSION}`);
});

app.get('/recipes', (req, res) =>{
  pool.query(`SELECT catID, userID, title, description,time, additions, calory FROM recipes`, (err, results) =>{ 
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }

    res.status(200).send(results);
    return;
  });
});

//Kategóriák lekérése
app.get('/category', (req, res) =>{
  pool.query(`SELECT ID, name FROM category`, (err, results)=>{
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }

    res.status(200).send(results);
    return;
  })
})

//Új recept feltöltése
app.post('/upload/:userID', (req, res)=>{

  if (!req.params.userID) {
    res.status(203).send('Hiányzó azonosító!');
    return;
  }

  if(!req.body.title || !req.body.description || !req.body.time || !req.body.additions || !req.body.calory) {
    res.status(203).send('Nem adtál meg minden kötelező adatot!');
    return;
  }


  pool.query(`INSERT INTO recipes VALUES('${uuid.v4()}', ${req.body.catID}, '${req.params.userID}', '${req.body.title}', '${req.body.description}', '${req.body.time}', '${req.body.additions}', '${req.body.calory}')`, (err, results)=>{
    if (err){
      res.status(500).send('Hiba történt az adatbázis művelet közben!');
      return;
     }
     res.status(200).send('Recept felvéve!');
     return;
  });
 

})

// user regisztráció 
app.post('/reg', (req, res) => {

  // kötelező adatok ellenőrzése
  if (!req.body.name || !req.body.email || !req.body.passwd){
     res.status(203).send('Nem adtál meg minden kötelező adatot!');
     return;
  }

  // jelszavak ellenőrzése
  if (req.body.passwd != req.body.confirm){
    res.status(203).send('A megadott jelszavak nem egyeznek!');
    return;
  }
  
  // jelszó min kritériumoknak megfelelés
  if (!req.body.passwd.match(passwdRegExp)){
    res.status(203).send('A jelszó nem elég biztonságos!');
    return;
  }

  // email cím ellenőrzés
  pool.query(`SELECT * FROM users WHERE email='${req.body.email}'`, (err, results) => {
     
    if (err){
      res.status(500).send('Hiba történt az adatbázis elérése közben!');
      return;
     }
    
    // ha van már ilyen email cím
    if (results.length != 0){
      res.status(203).send('Ez az e-mail cím már regisztrálva van!');
      return;
     }
    
    // új felhasználó felvétele
    console.log(req.body.passwd)
    pool.query(`INSERT INTO users VALUES('${uuid.v4()}', '${req.body.name}', '${CryptoJS.SHA1(req.body.passwd)}','${req.body.email}', '${req.body.phone}', 'user', '1' )`, (err, results)=>{
      if (err){
        res.status(500).send('Hiba történt az adatbázis művelet közben!');
        console.log(err)
        return;
       }
       res.status(202).send('Sikeres regisztráció!');
       return;
    });
    return;
  });
 
});

// user belépés
app.post('/login', (req, res) => {

  //console.log(req.body);
  if (!req.body.email || !req.body.password) {
    res.status(203).send('Hiányzó adatok!');
    return;
  }
  console.log(`SELECT ID, name, email, role FROM users WHERE email ='${req.body.email}' AND password='${CryptoJS.SHA1(req.body.password)}'`);
  pool.query(`SELECT ID, name, email, role FROM users WHERE email ='${req.body.email}' AND password='${CryptoJS.SHA1(req.body.password)}'`, (err, results) =>{
    
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }
    
    if(results.length == 0){
      res.status(203).send('Hibás belépési adatok!');
      return;
    }

    res.status(202).send(results);
    return;
  });

});

// bejelentkezett felhasználó adatainak lekérése
app.get('/me/:id', logincheck, (req, res) => {

  if (!req.params.id) {
    res.status(203).send('Hiányzó azonosító!');
    return;
  }

  pool.query(`SELECT name, email, FROM users WHERE ID='${req.params.id}'`, (err, results) =>{ 
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }

    if (results.length == 0){
      res.status(203).send('Hibás azonosító!');
      return;
    }

    res.status(202).send(results);
    return;

  });
});

// felhasználó módosítása
app.patch('/users/:id', logincheck, (req, res) => {
  
  if (!req.params.id) {
    res.status(203).send('Hiányzó azonosító!');
    return;
  }

  if (!req.body.name || !req.body.email || !req.body.role) {
    res.status(203).send('Hiányzó adatok!');
    return;
  }

  //TODO: ne módosíthassa már meglévő email címre az email címét

  pool.query(`UPDATE users SET name='${req.body.name}', email='${req.body.email}', role='${req.body.role}' WHERE ID='${req.params.id}'`, (err, results) => {
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }

    if (results.affectedRows == 0){
      res.status(203).send('Hibás azonosító!');
      return;
    }

    res.status(200).send('Felhasználó adatok módosítva!');
    return;
  });
});

// jelszó módosítás
app.patch('/passmod/:id', logincheck, (req, res) => {
  
  if (!req.params.id) {
    res.status(203).send('Hiányzó azonosító!');
    return;
  }

  if (!req.body.oldpass || !req.body.newpass || !req.body.confirm) {
    res.status(203).send('Hiányzó adatok!');
    return;
  }

   // jelszavak ellenőrzése
   if (req.body.newpass !== req.body.confirm) {
    res.status(203).send('A megadott jelszavak nem egyeznek!');
    return;
  }
  
  // jelszó min kritériumoknak megfelelés
  if (!req.body.newpass.match(passwdRegExp)) {
    res.status(203).send('A jelszó nem elég biztonságos!');
    return;
  }

  // megnézzük, hogy jó-e a megadott jelenlegi jelszó
  pool.query(`SELECT password FROM users WHERE ID='${req.params.id}'`, (err, results) => {
    if (err) {
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }

    if (results.length === 0) {
      res.status(203).send('Hibás azonosító!');
      return;
    }

    if (results[0].password !== CryptoJS.SHA1(req.body.oldpass).toString()) {
      res.status(203).send('A jelenlegi jelszó nem megfelelő!');
      return;
    }

    pool.query(`UPDATE users SET password=SHA1('${req.body.newpass}') WHERE ID='${req.params.id}'`, (err, results) => {
      if (err) {
        res.status(500).send('Hiba történt az adatbázis műveletek közben!');
        return;
      }
  
      if (results.affectedRows === 0) {
        res.status(203).send('Hibás azonosító!');
        return;
      }
  
      res.status(200).send('A jelszó módosítva!');
      return;
    });
  });
});

//e-mail módosítása
app.patch('/emailmod/:id', logincheck, (req, res) => {
  if (!req.params.id) {
      res.status(400).send('Hiányzó azonosító!');
      return;
  }

  // Ellenőrizzük, hogy az új e-mail és a jelszó megvan
  if (!req.body.newEmail || !req.body.currentPassword) {
      res.status(400).send('Hiányzó adatok!');
      return;
  }

  // Ellenőrizzük, hogy a megadott jelszó helyes-e
  pool.query(`SELECT password FROM users WHERE ID='${req.params.id}'`, (err, results) => {
      if (err) {
          res.status(500).send('Hiba történt az adatbázis lekérése közben!');
          return;
      }

      if (results.length === 0) {
          res.status(400).send('Hibás azonosító!');
          return;
      }

      if (results[0].password !== CryptoJS.SHA1(req.body.currentPassword).toString()) {
          res.status(400).send('A megadott jelszó nem megfelelő!');
          return;
      }

      // Frissítjük az új e-mail címet
      pool.query(`UPDATE users SET email='${req.body.newEmail}' WHERE ID='${req.params.id}'`, (err, results) => {
          if (err) {
              res.status(500).send('Hiba történt az adatbázis műveletek közben!');
              return;
          }

          if (results.affectedRows === 0) {
              res.status(400).send('Hibás azonosító!');
              return;
          }

          res.status(200).send('Az e-mail cím módosítva!');
      });
  });
});

app.get('/users', admincheck, (req, res) =>{
  pool.query(`SELECT ID, name, email, role FROM users`, (err, results) => {
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }
    res.status(200).send(results);
    return;
  });
})

app.listen(port, () => {
  //console.log(process.env) ;
  console.log(`Server listening on port ${port}...`);
});

app.delete('/users/:id', logincheck, (req, res) => {
  const userId = req.params.id;

  if (!userId) {
      res.status(400).send('Hiányzó azonosító!'); // Bad Request for missing ID
      return;
  }

  // Use parameterized query to prevent SQL injection
  pool.query(`DELETE FROM users WHERE ID = ?`, [userId], (err, results) => {
      if (err) {
          res.status(500).send('Hiba történt az adatbázis lekérés közben!'); // Internal Server Error
          return;
      }

      if (results.affectedRows === 0) {
          res.status(404).send('Hibás azonosító!'); // Not Found for invalid ID
          return;
      }

      res.status(200).send('Felhasználó törölve!'); // Success
  });
});

// bejelentkezés ellenőrzése
function logincheck(req, res, next){
  let token = req.header('Authorization');
  
  if (!token){
    res.status(400).send('Jelentkezz be!');
    return;
  }

  pool.query(`SELECT * FROM users WHERE ID='${token}'`, (err, results) => {
    if (results.length == 0){
      res.status(400).send('Hibás authentikáció!');
      return;
    } 

    next();
  });

  return;
}
// jogosulstág ellenőrzése
function admincheck(req, res, next) {
  let token = req.header('Authorization');

  if (!token) {
      res.status(400).send('Jelentkezz be!');
      return;
  }

  // A "Bearer " szó leírása
  const userId = token.split(' ')[1]; // "Bearer <token>" => <token>

  pool.query(`SELECT role FROM users WHERE ID='${userId}'`, (err, results) => {
      if (results.length === 0) {
          res.status(400).send('Hibás authentikáció!');
          return;
      }
      if (results[0].role !== 'admin') {
          res.status(400).send('Nincs jogosultságod!');
          return;
      }
      next();
  });

  return;
}