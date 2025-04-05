const RB=ReactBootstrap;
const {Alert, Card, Button, Table} = ReactBootstrap;
const firebaseConfig = {
  apiKey: "AIzaSyBs9jeRra7hpwtB7PdWeQFEscMwgWGPVVI",
  authDomain: "web2566-8670f.firebaseapp.com",
  projectId: "web2566-8670f",
  storageBucket: "web2566-8670f.appspot.com",
  messagingSenderId: "969586781576",
  appId: "1:969586781576:web:33d7d023625c46435bde3d"
};
firebase.initializeApp(firebaseConfig);      
const db = firebase.firestore();

function StudentTable({data, app}){
  return <table className='table'>
  <tr>
      <td>รหัสนักศึกษา</td>
      <td>คำนำหน้า</td>
      <td>ชื่อ</td>
      <td>นามสกุล</td>
      <td>อีเมล</td>
      </tr>
      {
        data.map((s)=><tr>
        <td>{s.id}</td>
        <td>{s.title}</td>
        <td>{s.fname}</td>
        <td>{s.lname}</td>
        <td>{s.email}</td>
        <td><EditButton std={s} app={app}/></td>
        <td><DeleteButton std={s} app={app}/></td>        
        </tr> )
      }
  </table>
}



function TextInput({label,app,value,style}){
  return <label className="form-label">
  {label}:    
   <input className="form-control" style={style}
   value={app.state[value]} onChange={(ev)=>{
       var s={};
       s[value]=ev.target.value;
       app.setState(s)}
   }></input>
 </label>;  
}

function EditButton({ std, app }) {
  return (
    <Button variant="warning" size="sm" onClick={() => app.edit(std)} >
      แก้ไข
    </Button>
  );
}

function DeleteButton({ std, app }) {
  return (
    <Button variant="danger" size="sm" onClick={() => app.delete(std)}>
      ลบ
    </Button>
  );
}

class App extends React.Component {
  title = (
    <Alert variant="info" style={{ backgroundColor: '#051094', color: 'white' }}>
      <b>เรียกใช้ฐานข้อมูล Firebase ด้วย React</b>
    </Alert>
  );
  footer = (
    <div>
      By 643020602-0 Chayada Wichaiyo <br />
      College of Computing, Khon Kaen University
    </div>
  );
  
  state = {
      scene: 0,
      students:[],
      stdid:"",
      stdtitle:"",
      stdfname:"",
      stdlname:"",
      stdemail:"",
  }
    
  edit(std){      
      this.setState({
       stdid    : std.id,
       stdtitle : std.title,
       stdfname : std.fname,
       stdlname : std.lname,
       stdemail : std.email,
      })
   }


  readData(){
      db.collection("students").get().then((querySnapshot) => {
          var stdlist=[];
          querySnapshot.forEach((doc) => {
              stdlist.push({id:doc.id,... doc.data()});                
          });
          console.log(stdlist);
          this.setState({students: stdlist});
      });
  }

  autoRead(){
      db.collection("students").onSnapshot((querySnapshot) => {
          var stdlist=[];
          querySnapshot.forEach((doc) => {
              stdlist.push({id:doc.id,... doc.data()});                
          });          
          this.setState({students: stdlist});
      });
  }
  
  insertData(){
      db.collection("students").doc(this.state.stdid).set({
         title : this.state.stdtitle,
         fname : this.state.stdfname,
         lname : this.state.stdlname,
         email : this.state.stdemail,
      });
  }

  delete(std){
      if(confirm("ต้องการลบข้อมูล")){
         db.collection("students").doc(std.id).delete();
      }
  }

  
  render() {
      return (
        <Card>
          <Card.Header>{this.title}</Card.Header>  
          <Card.Body>
            <Button onClick={()=>this.readData()} style={{ backgroundColor: '#051094', color: 'white' }}>Read Data</Button>{"\u00A0"}
            <Button onClick={()=>this.autoRead()} style={{ backgroundColor: '#051094', color: 'white' }}>Auto Read</Button>
            <div>
            <StudentTable data={this.state.students} app={this}/>  
            </div>
          </Card.Body>
          <Card.Footer>
          <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา</b><br/>
          <TextInput label="รหัสนักศึกษา" app={this} value="stdid" style={{width:120, marginRight: 10}}/>  
          <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{width:100, marginRight: 10}} />
          <TextInput label="ชื่อ" app={this} value="stdfname" style={{width:120, marginRight: 10}}/>
          <TextInput label="สกุล" app={this} value="stdlname" style={{width:120, marginRight: 10}}/>
          <TextInput label="อีเมล" app={this} value="stdemail" style={{width:150, marginRight: 10}} />        
          <Button onClick={()=>this.insertData()}style={{ backgroundColor: '#051094', color: 'white' }}>Save</Button>
          </Card.Footer>
          <Card.Footer>{this.footer}</Card.Footer>
        </Card>          
      );
    }        
}


const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);