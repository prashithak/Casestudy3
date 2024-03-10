// Task1: initiate app and run server at 3000
const express=require('express');

const morgan=require('morgan');
const dotenv =require('dotenv');
const app =new express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'));
dotenv.config();
const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`listening ${PORT}`);
})


//
const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection 
const mongoose=require('mongoose');

mongoose.connect(process.env.mongoDB_URL).then(()=>{
    console.log('DB is connected');
})
.catch(()=>{
    console.log('DB is not connected');
})


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below
const EmployeeSchema=mongoose.Schema({  
    emp_id:Number,
    emp_name:String,
    emp_loc:String,
    emp_pos:String,
    emp_salary:Number
    })
    const employee=mongoose.model('employee',EmployeeSchema);





//TODO: get data from db  using api '/api/employeelist'
app.use('/api',employee);

app.get('/employeelist',async (req,res)=>{
    try {
        const data=await employee.find();
        res.status(200).send(data);
        } 
    catch (error)
     {
        res.status(404).send('no data found');
    }
})



//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/employeelist/:id',async (req,res)=>{
    try {
        const data=await employee.findById(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(404).send('no data found');
        
    }
})



//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post('/employeelist', async(req,res)=>{
   try{ 
    const data=new employee({
    emp_id:req.body.emp_id,
    emp_name :req.body.emp_name,
    emp_loc :req.body.emp_loc,
    emp_pos:req.body.emp_pos,
    emp_salary:req.body.emp_salary}
    );
    
    await data.save();
    res.status(200).send('post succesful');
   }
   catch(error)
   {
    res.status(404).send('post unsuccessful');
   }
})





//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const data = await employee.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(404).json({ message: 'Not deleted' });
    }
});


//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist/:id', async (req, res) => {
    try {
        const data = await employee.findByIdAndUpdate(req.params.id, {
            emp_name: req.body.emp_name,
            emp_loc: req.body.emp_loc,
            emp_pos: req.body.emp_pos,
            emp_salary: req.body.emp_salary
        }, { new: true });

        if (!data) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(404).json({ message: 'Not updated' });
    }
});


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});


