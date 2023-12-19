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
        try {
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
        } catch (error) {
            console.error(err);
            res.status(500).send('cannot read json on submit ');
        }
      
    });
});

// On delete the details in the specified row need to be deleted from json and show the rest
app.get('/delete/:index' , (req , res) => {

    let index = req.params.index  // to get the index from the parameter.
    fs.readFile('./datas/files.json' , 'utf-8' , (err , data) => {
        if (err) {
            console.log(err)
            res.status(500).send('Error on reading datas from json')
            return; // if error goes out from reading
        }
        let jsondata = JSON.parse(data);
        console.log("Data deleted : ",jsondata[index]);
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


// On the Edit it shows a form with prefilled details of the the user.
app.get('/edit/:index' , (req,res) => {

    let index = parseInt(req.params.index)
    fs.readFile('./datas/files.json' , 'utf8' , (err,data) => {
        if(err){
            console.log(err)
            res.status(500).send('Cannot read jsondata on edit');
            return;
        }
        const jsonData = JSON.parse(data);
        if (index >= 0 && index < jsonData.length) {
            // Get the specific entry to be edited
            const Editdet = jsonData[index];
            const formData = JSON.parse(Editdet.formdetail);

            // Render the form with prefilled data for editing
            res.render('Editform', { formData, index: req.params.index });
        } else {
            res.status(404).send('Data not found for editing');
        }
    })
})

// On submiting the edit it updates the json data
app.post('/Update/:index', (req, res) => {

    let index = parseInt(req.params.index);
    const updatedFormData = req.body;

    fs.readFile('./datas/files.json', 'utf8', (err, data) => {

        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        let jsonData = JSON.parse(data);

        if (index >= 0 && index < jsonData.length) {
            jsonData[index].formdetail = JSON.stringify(updatedFormData);

            fs.writeFile('./datas/files.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error on updating JSON');
                }
                res.redirect('/'); // Redirect to the homepage after  updating
            });
        } else {
            res.status(404).send('Data not found for updating');
        }
    });
});

const port = 8000;
app.listen(port , () => console.log(`Server has started on http://localhost:${port}`));