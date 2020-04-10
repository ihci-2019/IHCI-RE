import * as React from 'react';
import './style.scss'
import Page from '../../../components/page'
import { SignView } from '../../../components/sign';


export default class RegisterPage extends React.Component{

  login = async () => {
    setTimeout(() => {
        location.href = '/login'
    }, 300);
  }

  register = async () => {
    setTimeout(() => {
        location.href = '/register'
    }, 300);
  }

  toHomePage = async () => {
    setTimeout(() => {
        location.href = '/'
    }, 100);
  }

    render () {
        return(
          <Page title = "注册" className = "register-page">  

            <div className="nav">
              <div className="max-w-con nav-con">
                  <img className="logo" src={require('./logo.png')} onClick={this.toHomePage}/>
                  <div className="division">iHCI俱乐部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iHCI实验室</div>
                  <div className="sign">
                    <div className="signin" onClick={this.login}>登陆</div>
                    <div className="signup" onClick={this.register}>注册</div>
                  </div>
              </div>
            </div>

            <div className="main">
              {/* <div className="logo">
                <img src={require('./logo@2x.png')} />
              </div> */}
              <div className="slogan">加入iHCI平台</div>
              <div className="register-block">
                <SignView sign="register"/>
              </div>        
            </div>        
          </Page>       
        )
    } 
}