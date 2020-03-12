import * as React from 'react';
import './style.scss'
import Page from '../../../components/page'
import WxLoginDialog from '../../../components/wx-login-dialog'
import { SignView } from '../../../components/sign';


export default class LoginPage extends React.Component{

  state = {
    showWxDialog: false,
  }
    

  showWxDialogHandle = () => {
    this.setState({
        showWxDialog: true
    })
  }

  hideWxDialogHandle = () => {
    this.setState({
        showWxDialog: false
    })
  }

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
          <Page title = "登陆" className = "login-page">
            {
              this.state.showWxDialog && <WxLoginDialog state="auth" closeHandle={this.hideWxDialogHandle}/>
            }

            <div className="nav">
                <div className="max-w-con nav-con">
                    <img className="logo" src={require('./logo.png')} onClick={this.toHomePage}/>
                    {/* <div className="slogan">
                            <div className="english">All for the valuable code</div> 
                            <div className="chinese">一切为了有价值的代码</div>
                    </div> */}
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
              <div className="login-block">
                <SignView sign="login" showWxDialogHandle={this.showWxDialogHandle}/>
              </div>
            </div>
            
            
          </Page>
            
        )
    }
    
}
