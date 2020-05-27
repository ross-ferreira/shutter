import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css'

const NavBar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails,setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();


  useEffect(() => {
    //check docs https://materializecss.com/modals.html
    M.Modal.init(searchModal.current)
  }, [])


  //State is initially NULL!!!
  const renderList = () => {
    if (state) {
      return [

        <li key={"1"}><a><i data-target="modal1" style={{ color: "black" }} className="material-icons modal-trigger">search</i></a></li>,
        <li key={"3"}><Link to="/mysubscribedposts"><i style={{ color: "black" }} className="material-icons">panorama</i></Link></li>,
        <li key={"5"}><Link to="/createpost"><i style={{ color: "black" }} className="material-icons">add_a_photo</i></Link></li>,
        <li key={"4"}><Link to="/profile">Profile</Link></li>,
        <li key={"2"}><a className="nav-user-name"><strong>Hello, {state.name}!</strong></a></li>,
        <button key={"6"}
          className="waves-effect waves-light btn cyan lighten-2"
          onClick={() => {
            localStorage.clear();
            dispatch({ type: "CLEAR" })
            history.push('/signin')
          }}
        >Sign Out
        </button>
      ]

    } else {
      return [
        <li key={"4"}><Link to="/signin">Signin</Link></li>,
        <li key={"5"}><Link to="/signup">Signup</Link></li>
      ]
    }
  }

  const fetchUserRecords = (query) =>{
    setSearch(query);
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query:query
      })
    }).then(res=>res.json())
    .then(results=>{
      setUserDetails(results.userRecord)
    })
  }

  

  return (
    <nav>
      <div className="nav-wrapper">
        <Link to={state ? "/" : "/signin"} className="brand-logo">SHUTTER</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderList()}
        </ul>
      </div>
      <div id="modal1" className="modal" ref={searchModal} style={{ color: "black " }}>
        <div className="modal-content">
          <input
            type="text"
            placeholder="Search Users"
            value={search}
            onChange={(e) => { fetchUserRecords(e.target.value) }} 
          />
          <ul className="collection">
            {userDetails.map(item=>
              <Link to={ item._id !== state._id ? "/profile/" + item._id : "/profile"}>
                <li key={item._id} className="collection-item" onClick={()=>{
                  M.Modal.getInstance(searchModal.current).close();
                  setSearch("");
                }} >{item.email}</li>
              </Link>
            )}
          </ul>
        </div>
        <div className="modal-footer">
          <button href="#!" className="modal-close btn-flat" onClick={()=>setSearch("")} >Close</button>
        </div>
      </div>
    </nav>

  )
}

export default NavBar