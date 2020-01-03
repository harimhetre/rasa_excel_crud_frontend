import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import "react-table-6/react-table.css";
import { Container, Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { Table } from "react-bootstrap";
import LoopIcon from "@material-ui/icons/Loop";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import {ExportCSV} from './Component/ExportCSV'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from 'react-loading-overlay';


const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  input: {
    display: "none"
  },
  buttonSuccess: {
    backgroundColor: 'green[500]',
    '&:hover': {
      backgroundColor: 'green[700]',
    },
  },
  fabProgress: {
    color: 'green[500]',
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: 'green[500]',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));
function App() {
  const classes = useStyles();
  const [data, setData] = useState();
  const [editId, setEditId] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [editCategory1, setEditCategory1] = useState(false);
  const [editCategory2, setEditCategory2] = useState(false);
  const [editCategory3, setEditCategory3] = useState(false);
  const [editIncidentRequest, setIncidentRequest] = useState(false);
  const [model, setModel] = React.useState("");
  const [prediction1, setPrediction1] = React.useState(null);
  const [prediction2, setPrediction2] = React.useState([]);
  const [prediction3, setPrediction3] = React.useState([]);
  const [confidence1, setConfidence1] = React.useState([]);
  const [confidence2, setConfidence2] = React.useState([]);
  const [confidence3, setConfidence3] = React.useState([]);
  const [confidence4, setConfidence4] = React.useState([]);
  const [incidentRequestPrediction, setIncidentPrediction] = React.useState([]);
  const [pageNo, setPageNo] = React.useState(1);
  const [category1Data, setCategory1Data] = React.useState([])
  const [category2Data, setCategory2Data] = React.useState([])
  const [category3Data, setCategory3Data] = React.useState([])
  const [category4Data, setCategory4Data] = React.useState([])
  const [totalRecord, setTotalRecord] = React.useState(null)
  const [loading] = React.useState(false);
  const [currentRecords, setCurrentRecords] = React.useState(null);
  const [LoaderUpdate, setLoaderUpdate] = React.useState(false);
  const [LoaderTrain , setLoaderTrain] = React.useState(false);
  const [pageStartIndex, setPageStartIndex] = React.useState(1);
  const [pageEndIndex, setPageEndIndex] = React.useState(0);
  const handleUploadFile = event => {
    const data = new FormData();
    data.append("myFile", event.target.files[0]);
    setFileData(data);
    axios
      .post("http://localhost:7000/upload/uploadEmailExcelFile", data)
      .then(response => {
        // console.log(response);
        getData();
        get_50_records(); // do something with the response
      });
  };

  function getData (){

   
    let prediction1Array = []
    let prediction2Array = []
    let prediction3Array = []
    let prediction4Array = []
    let confidence1Array = []
    let confidence2Array = []
    let confidence3Array = []
    let confidence4Array = []
    axios.get("http://localhost:7000/getExcelData/getAllData").then(result => {
      setData(result.data.data);
      setTotalRecord(result.data.data.length);

      let data1 = result.data.data
      for(let i=0; i< data1.length; i++){
        if(data1[i].Category1 !== null || data1[i].Category1 !== undefined){
          prediction1Array.push(data1[i].Category1)
        }
        if(data1[i].Confidence1 !== null || data1[i].Confidence1 !== undefined){
          confidence1Array.push(data1[i].Confidence1)
        }
        if(data1[i].Confidence2 !== null || data1[i].Confidence2 !== undefined){
          confidence2Array.push(data1[i].Confidence2)
        }
        if(data1[i].Confidence3 !== null || data1[i].Confidence3 !== undefined){
          confidence3Array.push(data1[i].Confidence3)
        }
        if(data1[i].Confidence4 !== null || data1[i].Confidence4 !== undefined){
          confidence4Array.push(data1[i].Confidence4)
        }
        if(data1[i].Category2 !== null || data1[i].Category2 !== undefined){
          prediction2Array.push(data1[i].Category2)
        }
        if(data1[i].Category3 !== null || data1[i].Category3 !== undefined){
          prediction3Array.push(data1[i].Category3)
        }
        if(data1[i].IncidentORRequest !== null || data1[i].IncidentORRequest !== undefined){
          prediction4Array.push(data1[i].IncidentORRequest)
        }
      } 
      axios.get("http://localhost:7000/category/getCategory").then(catResult => {
          // console.log("catResult", catResult.data.data[0].category1);
          setCategory1Data(catResult.data.data[0].category1)
          setCategory2Data(catResult.data.data[0].category2)
          setCategory3Data(catResult.data.data[0].category3)
          setCategory4Data(catResult.data.data[0].category4)
      })   
      setPrediction1(prediction1Array);
      setPrediction2(prediction2Array);
      setPrediction3(prediction3Array);
      setIncidentPrediction(prediction4Array);

      setConfidence1(confidence1Array);
      setConfidence2(confidence2Array);
      setConfidence3(confidence3Array);
      setConfidence4(confidence4Array);
    });
  };


  // const onsubmit = event => {
  //   getData();
  // };

  React.useEffect(() => {
    
  },[pageNo])

  const handleChange = event => {
    setModel(event.target.value);
    // console.log("Value", event.target.id);
  };

  const get_50_records = () => {
    let payload = {
      pageNo : pageNo,
      size: 50
    }
    // console.log("payload", payload);
    
     axios
    .post("http://localhost:7000/getExcelData/getData", payload)
    .then(response => {
      // console.log("response", response.data.data._id);
      setCurrentRecords(response.data.data)
    });
  }
  const handleChangeEdit = async (result,event) => { 
      let column_name=event.target.id
      let payload ={};
      if(column_name === "Category1"){
          payload = {
          _id: result._id,
           Category1:event.target.value,
           Category2:result.Category2,
           Category3: result.Category3,
           Confidence2: result.Confidence2,
           Confidence3: result.Confidence3,
           Confidence4: result.Confidence4,
           IncidentORRequest: result.IncidentORRequest
         };
      }else if(column_name === "Category2"){
        payload = {
          _id: result._id,
           Category1: result.Category1,
           Category2: event.target.value,
           Category3: result.Category3,
           Confidence1: result.Confidence1,
           Confidence3: result.Confidence3,
           Confidence4: result.Confidence4,
           IncidentORRequest: result.IncidentORRequest
         };
      }else if(column_name === "Category3"){
          payload = {
          _id: result._id,
           Category1: result.Category1,
           Category2: result.Category2,
           Category3: event.target.value,
           Confidence2: result.Confidence2,
           Confidence1: result.Confidence1,
           Confidence4: result.Confidence4,
           IncidentORRequest: result.IncidentORRequest
         };

      }else if(column_name === "Category4"){
        payload = {
          _id: result._id,
           Category1: result.Category1,
           Category2: result.Category2,
           Category3: result.Category3,
           Confidence2: result.Confidence2,
           Confidence3: result.Confidence3,
           Confidence1: result.Confidence1,
           IncidentORRequest: event.target.value,
         };
      }
     
     await axios
        .post("http://localhost:7000/updateExcel/updateData", payload)
        .then(response => {
          get_50_records()
        });
  };

  const updatePrediction =async event => {
 
    
    for (let i = 0; i < data.length; i++) {
      let payload = {
        _id: data[i]._id,
        Category1: prediction1[i],
        Category2: prediction2[i],
        Category3: prediction3[i],
        IncidentORRequest: incidentRequestPrediction[i],
        Confidence1: confidence1[i],
        Confidence2: confidence2[i],
        Confidence3: confidence3[i],
        Confidence4: confidence4[i],
      };
      console.log("payload",payload);
      setLoaderUpdate(true)
     await axios
        .post("http://localhost:7000/updateExcel/updateData", payload)
        .then(response => {
          // console.log(response); // do something with the response
        });
    }
    {get_50_records ()
      toast.success("Success Notification !", {
        position: toast.POSITION.TOP_CENTER
      })
    setLoaderUpdate(false)};
  };

const rasaTrainModel = async (event) => {
  console.log("event", model);
  if (model === 1) {    
    let prediction = [];
    let confidence = []
    console.log("data", data);
    
    for (let i = 0; i < data.length; i++) {
     
      
      setLoaderTrain(true)
    await axios
        .post("http://localhost:5005/model/parse", {
          text: data[i].Description
        })
        .then(async response => {        
         prediction.push(response.data.intent.name);
         confidence.push(response.data.intent.confidence)
         
        });
    }
    setPrediction1(prediction);
    setConfidence1(confidence)
    {
      console.log("hkjhbjkhbjhbj");
      toast.success("Model 1 Trained Successfully", {
        position: toast.POSITION.TOP_CENTER
      })
      setLoaderTrain(false)
    }
    
  } else if (model === 2) {
    let prediction = [];
    let confidence = []
    for (let j = 0; j < data.length; j++) {
      setLoaderTrain(true)
     await axios
        .post("http://localhost:5006/model/parse", {
          text: data[j].Description
        })
        .then(response => {
          prediction.push(response.data.intent.name);
          confidence.push(response.data.intent.confidence)
            // console.log(response); // do something with the response
        });
    }
    setPrediction2(prediction);
    setConfidence2(confidence)
    {
      toast.success("Model 2 Trained Successfully", {
        position: toast.POSITION.TOP_CENTER
      })
      setLoaderTrain(false)
    }
  } else if (model === 3) {
    let prediction = [];
    let confidence = []
    setLoaderTrain(true)
    for (let x = 0; x < data.length; x++) {
     await axios
        .post("http://localhost:5007/model/parse", {
          text: data[x].Description
        })
        .then(response => {
          prediction.push(response.data.intent.name);
          confidence.push(response.data.intent.confidence)
          // console.log(response.data.intent.name); // do something with the response
        });
    }
    setPrediction3(prediction);
    setConfidence3(confidence)
    {
      toast.success("Model 3 Trained Successfully", {
        position: toast.POSITION.TOP_CENTER
      })
      setLoaderTrain(false)
      
    }
  } else if (model === 4) {
    let prediction = [];
    let confidence = []
    for (let y = 0; y < data.length; y++) {
      setLoaderTrain(true)
     await axios
        .post("http://localhost:5008/model/parse", {
          text: data[y].Description
        })
        .then(response => {
          prediction.push(response.data.intent.name);
          confidence.push(response.data.intent.confidence)
          // console.log(response.data.intent.name); // do something with the response
        });
    }
    setIncidentPrediction(prediction);
    setConfidence4(confidence)
    {
      toast.success("Model 4 Trained Successfully", {
        position: toast.POSITION.TOP_CENTER
      })
      setLoaderTrain(false)
    }
  }else {
    {
      toast.error("Please select Model", {
        position: toast.POSITION.TOP_CENTER
      })
    }
  }

  }

  const onClickEditCategory1 = (result, event) => {
    setEditCategory1(true);
    setEditCategory2(false);
    setEditCategory3(false);
    setIncidentRequest(false);
    setEditId(result._id);
  };
  const onClickEditCategory2 = (result, event) => {
    setEditCategory2(true);
    setEditCategory1(false);
    setEditCategory3(false);
    setIncidentRequest(false);
    setEditId(result._id);
  };
  const onClickEditCategory3 = (result, event) => {
    setEditCategory3(true);
    setEditCategory1(false);
    setEditCategory2(false);
    setIncidentRequest(false);
    setEditId(result._id);
  };
  const onClickeditIncidentRequest = (result, event) => {
    setIncidentRequest(true);
    setEditCategory1(false);
    setEditCategory2(false);
    setEditCategory3(false);
    setEditId(result._id);
  };
 

React.useEffect(() => {
  setPageEndIndex(pageNo*50)
  getData();
  get_50_records();
}, [pageNo])
const onClickNext =  () => {
  setPageNo(pageNo + 1)
  
  setPageStartIndex(pageEndIndex + 1)

 
  }
const onClickPrevious = () => {
  setPageNo(pageNo - 1)
  
  setPageStartIndex(pageStartIndex - 50)
  setPageEndIndex(pageEndIndex - 50)

}
 
  let onSearch = (e) => {
    var input, filter, table, tr, td, i, txtValue;
  input = e.target.value;
  filter = input.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
    console.log("table", table);
    console.log("tr", tr);
    
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    console.log("td", td);
    return
    if (td) {
    
      
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        console.log("inside ig");
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
  }     
  return (
    <LoadingOverlay
    active={LoaderTrain || LoaderUpdate}
    spinner
    text='Loading your content...'
    style={[{height: 80}]}
    >
    <div style={{ textAlign: "left" }}>   

      <h3 style={{ textAlign: "center" }}>Upload and Select Excel File</h3>
      <Container maxWidth="lg" className={classes.root}>
        <input
          className={classes.input}
          id="contained-button-file"
          multiple
          type="file"
          onChange={event => handleUploadFile(event)}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Upload Excel
          </Button>
        </label>

        <FormControl variant="outlined" style={{ width: "12%" }}>
          <InputLabel id="demo-simple-select-outlined-label">Select Model</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={model}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select Model</em>
            </MenuItem>
            <MenuItem value={1}>Model 1</MenuItem>
            <MenuItem value={2}>Model 2</MenuItem>
            <MenuItem value={3}>Model 3</MenuItem>
            <MenuItem value={4}>Model 4</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          startIcon={<LoopIcon />}
          disabled={loading}
          onClick={event => rasaTrainModel(event)}
        >
          Train {LoaderTrain && <CircularProgress size={24} color= "inherit"/>}
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<LoopIcon />}
          onClick={event => updatePrediction(event)}
        >
          Update {LoaderUpdate && <CircularProgress size={24} color= "inherit"/>}
        </Button>
        <ExportCSV  />

      </Container>
      <input type="text" id="myInput" onChange={(e) => onSearch(e)} placeholder="Search for names.."></input>
      <Container maxWidth="lg" style={{ marginTop: "2%" }}>
        <Table striped bordered hover id="myTable">
          <thead>
            <tr>
              <th>Index</th>
              <th>Description</th>
              <th>Category 1</th>
              <th>Confidence</th>
              <th>Category 2</th>
              <th>Confidence </th>
              <th>Category 3</th>
              <th>Confidence </th>
              <th>Incident/Request</th>
              <th>Confidence </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords !== undefined && currentRecords !== null
              ? currentRecords.map((result, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{result.Description}</td>
                      
                      {editCategory1 && result._id === editId ? (
                        <td>
                          <select
                            class="form-control"
                            id="Category1"
                            onChange={(event)=> handleChangeEdit(result,event)}
                          >
                           {/* {filteredCategory1.map(MakeItem)} */}
                           {category1Data.map((result, index) => {
                             return (
                              <option key={index+1} value={result}>{result}</option>
                             ) 
                           })}
                            
                          
                          </select>
                        </td>
                      ) : (
                        <td onClick={() => onClickEditCategory1(result)}>
                          {result.Category1}
                        </td>
                      )}
                      <td>
                          {result.Confidence1}
                        </td>

                      {editCategory2 && result._id === editId ? (
                        <td>
                          <select
                            class="form-control"
                            id="Category2"
                            onChange={(event)=> handleChangeEdit(result,event)}
                          >
                              {category2Data.map((result, index) => {
                             return (
                              <option key={index} value={result}>{result}</option>
                             ) 
                           })}
                            
                          </select>
                        </td>
                      ) : (
                        <td onClick={() => onClickEditCategory2(result)}>
                          
                          {result.Category2}
                        </td>
                      )}
                      <td>
                          {result.Confidence2}
                        </td>
                      {editCategory3 && result._id === editId ? (
                        <td>
                          <select
                            class="form-control"
                            id="Category3"
                            onChange={(event)=> handleChangeEdit(result,event)}
                          >
                             {category3Data.map((result, index) => {
                             return (
                              <option key={index} value={result}>{result}</option>
                             ) 
                           })}
                            }
                          </select>
                        </td>
                      ) : (
                        <td onClick={() => onClickEditCategory3(result)}>
                          {result.Category3}
                        </td>
                      )}
                      <td>
                          {result.Confidence3}
                        </td>
                      {editIncidentRequest && result._id === editId ? (
                        <td>
                          <select
                            class="form-control"
                            id="Category4"
                            onChange={(event)=> handleChangeEdit(result,event)}
                          >
                               {category4Data.map((result, index) => {
                             return (
                              <option key={index} value={result}>{result}</option>
                             ) 
                           })}
                          </select>  
                        </td>
                      ) : (
                        <td onClick={() => onClickeditIncidentRequest(result)}>
                          {result.IncidentORRequest}
                        </td>
                      )}
                      <td>
                          {result.Confidence4}
                        </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </Table>
       
         <div className="box-footer">
          <div className="row">
            <div className="col-sm-12 col-md-5">
              {pageNo === 0 ? null: (
                <div className="dataTables_info" role="status" aria-live="polite">
                Showing {pageStartIndex} to {pageEndIndex} of {totalRecord} entries
              </div>
              )}
              
            </div>
            <div className="col-sm-12 col-md-7">
              <div className="dataTables_paginate">
                <ul className="pagination">
                  {pageNo === 1 || pageNo === 0 ? null : (
                    <li
                      className="page-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => onClickPrevious()}
                    >
                      <a aria-label="Previous" className="page-link page-link">
                        <span>Previous</span>
                      </a>
                    </li>
                  )}
                  {pageNo === 0 ? null : (
                    <li className="page-item active">
                      <a className="page-link page-link">
                        {pageNo}
                        <span className="sr-only">(current)</span>
                      </a>
                    </li>
                  )}
                  {pageNo === 0 ? null : (
                    <li
                      className="page-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => onClickNext()}
                    >
                      <a aria-label="Next" className="page-link page-link">
                        <span>Next</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </Container>
    </div>
    </LoadingOverlay>
  );
}

export default App;
