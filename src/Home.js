import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'
import './Home.css';
import {ObjContainer} from "./services/object_container";
import {LoginPage} from "./components/Login/LoginPage";

let Header = ()=>{
    let onClick = ()=>{
        ObjContainer.resolve("user_manager").logout();
        ObjContainer.resolve("nav").emit("try_login");
    };
    return (
        <div className="Home-header">
            <div className={"row"}>
                <div className={"col-md-9"}>
                    <h2>Site Master</h2>
                </div>
                <div  className={"col-md-3"}>
                    {(ObjContainer.resolve("user_manager") || {isLoggedIn: ()=> false}).isLoggedIn() &&
                    <a  className="nav-link" onClick={onClick.bind(this)}>Logout</a>}
                </div>
            </div>


        </div>)
};
class NavItem extends Component{
    constructor(){
        super();
        this.state = {showChildren: false}
    }
    render() {
        let navTo = (link) => {
            if(this.props.item.children && this.props.item.children.length > 0){
                this.setState({showChildren:!this.state.showChildren});
            }else{
                ObjContainer.resolve("nav").navTo(link);
            }
            return false;
        };
        return (
            <div style={Object.assign({}, {
                backgroundColor: "#455464",
                color: "#FEFEFE",
                paddingTop: "8px",
                paddingBottom: "8px"
            }, (this.props.styles || {}))}>
                <a className="nav-link"
                   style={Object.assign({}, {color: "#FEFEFE", marginLeft: "5px"}, this.props.subItemStyles)}
                   onClick={navTo.bind(this, this.props.item.link)}>
                    {this.props.item.display}
                </a>
                {(this.props.item.children || [] ).map((item, index) => {
                    return (<NavItem key={"nav_item" + index} item={item}
                                     styles={{backgroundColor: "#343d47", marginTop: "2px",paddingBottom: "4px", paddingTop:"4px",display: (this.state.showChildren? "block" :"none") }}
                                     subItemStyles={{marginLeft: "20px"}}/>)
                })}
            </div>);
    }
}
let NavSeparator = () =>{
  return (<div style={{borderTop: "1px solid silver"}} />);
};
let LeftNav = (params) =>{
    return (
        <div style={{float:"left",width:"150px",borderLeft:"4px solid #333"}}>{params.nav.map((item,index)=>{
            return (
                <div key={"nav-item-" + index}>
                    <NavItem item={item} />
                    <NavSeparator />
                </div>)
            })}
        </div>);
};
let MainContent = (param) => {
    return (
        <div style={{float:"left",width:"900px",textAlight:"left"}} className="container">
            {param.children}
        </div>);
};
let SiteBody = (params) =>{
    return (
        <div>
            <LeftNav nav={params.nav} />
            <MainContent>
                {params.children}
             </MainContent>
        </div>)
};
class Home extends Component {
  constructor(){
      super();
      this.manager =
      this.state= {
          currentRouteItem:<div>No Route</div>,
          nav:[]
      }
  }
  async componentDidMount(){
      await ObjContainer.initialize().then(res => res);
      this.setState({currentRouteItem:ObjContainer.resolve("nav").getRouteContent((ObjContainer.resolve("nav").getState()).path)});
      ObjContainer.resolve("nav").addListener("nav",(item)=>{
          this.setState({currentRouteItem: ObjContainer.resolve("nav").getRouteContent(item)});
      });
      ObjContainer.resolve("nav").addListener("table_updated",()=>{
          this.setState({nav :ObjContainer.resolve("nav").getMenuList()});
      });
      this.setState({nav :ObjContainer.resolve("nav").getMenuList()});
      ObjContainer.resolve("nav").addListener("try_login",()=>{
          this.setState(this.state);
      })
  }
  render() {
    return (
      <div className="Home">
          <Header />
          {!(ObjContainer.resolve("user_manager") || {isLoggedIn: ()=> false}).isLoggedIn() && <LoginPage />}
          {(ObjContainer.resolve("user_manager") || {isLoggedIn: ()=> false}).isLoggedIn() &&
          <SiteBody nav={this.state.nav}>
              {this.state.currentRouteItem}
          </SiteBody>}

      </div>
    );
  }
}

export default Home;
