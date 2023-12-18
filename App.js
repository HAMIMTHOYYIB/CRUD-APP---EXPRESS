const express = require('express');
const fs = require('fs');
const querystring = require('querystring');
const bodyparser = require('body-parser');

const app = express();

app.set('view engine','ejs')
app.use(bodyparser.urlencoded({ extended : true }))

// Homepage
app.get('/', (req, res) => {

    fs.readFile('./datas/files.json', 'utf8', (err, data) => {

        if (err) {
            console.error(err);
            res.status(500).send('Error on reading json files');
            return;
        }
        try {
            // data is parsed to jsondata
            const jsonData = JSON.parse(data);

            // json object is converted to js object
            const formattedata = jsonData.map(item => {
                return JSON.parse(item.formdetail);
            });
            // Here the the placeholder in home named tablerows is replaced with the formattedata
            res.render('Home', { tableRows: formattedata }); 

        } catch (error) {
            console.error(err);
            res.status(500).send('cannot goto Homepage datas');
        }
    });
}); 


// Form page
app.get('/form' , (req,res) => {
    res.render('Form')
})


// On submit the data will be added to json and home page is updated
app.post('/submit', (req, res) => {  
    const formData = req.body;

    fs.readFile('./datas/files.json', 'utf8', (err, data) => {
        let jsonData = [];
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }else{
            // Parse existing JSON data
            jsonData = JSON.parse(data);
        }

        // Add new form data to the existing JSON
        jsonData.push(formData);
        const formattedData = jsonData.map(item => {
            return JSON.parse(item.formdetail);
        });

        // Write updated JSON data back to the file
        fs.writeFile('./datas/files.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error on saving to JSON');
            };
            res.render('Home' , { tableRows: formattedData });
        });
    });
});


// // On delete the details in the specified row need to be deleted from json and show the rest
app.get('/delete/:index' , (req , res) => {

    let index = req.params.index  // to get the index from the parameter.
    fs.readFile('./datas/files.json' , 'utf-8' , (err , data) => {
        if (err) {
            console.log(err)
            res.status(500).send('Error on reading datas from json')
            return; // if error goes out from reading
        }
        let jsondata = JSON.parse(data);
        console.log(jsondata[index]);
        if (index >= 0 && index < jsondata.length) { // If the index is true at the boundries delete and update json
            jsondata.splice(index,1)

            fs.writeFile('./datas/files.json' , JSON.stringify(jsondata , null , 2) , 'utf-8',(err) => {
                if(err) {
                   console.log(err);
                   res.status(500).send('Error on updating json') 
                }
                res.redirect('/')
            })
        }else{
        res.status(500).send('Error on deleting data');
            }
    })
})


// Assuming you have an Express route for handling delete requests
// app.get('/delete/:index', (req, res) => {
    
//     const index = req.params.index; // Retrieve the index from the URL parameter

//     fs.readFile('./datas/files.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Error reading file');
//             return;
//         }

//         let jsonData = JSON.parse(data);

//         // Check if the index is within the bounds of the array
//         if (index >= 0 && index < jsonData.length) {
//             // Remove the element at the specified index
//             jsonData.splice(index, 1);

//             // Write the updated data back to the file
//             fs.writeFile('./datas/files.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
//                 if (err) {
//                     console.error(err);
//                     res.status(500).send('Error writing to file');
//                     return;
//                 }
//                 // Redirect back to the homepage or render it with updated data
//                 res.redirect('/');
//             });
//         } else {
//             res.status(500).send('Invalid index of row');
//         }
//     });
// });

const port = 8000;
app.listen(port , () => console.log(`Server has started on http://localhost:${port}`));