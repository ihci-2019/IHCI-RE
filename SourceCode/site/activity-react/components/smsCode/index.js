import React from 'react'
import api, { authApi } from '../../utils/api';
import './style.scss'

export default class SMSBlock extends React.Component{
    state = {
        //#1
        //count: '',
        count: 60,
        enable: true,
        number: 0,
        captchaCode:'',
        captchaImg :'',
        captchaText:'',
        numberCheck:true,
        captchCodeCheck:false,
    }
    componentDidMount = async () =>{
        //#1 注释了这一部分，代表不使用缓存来实现当用户跳到其他页面再跳回来时，验证码依旧有效，而是指直接重新来过
        //var dateEnd = new Date()
        //var dateBegin = new Date(window.sessionStorage.getItem('dateBegin'))
        //const count =  60-parseInt((dateEnd.getTime()- dateBegin.getTime())/1000)
        //this.setState({
            //count: count > 0? count: 60,
            //number:parseInt(window.sessionStorage.getItem('number'))|| 0,
            //numberCheck:window.sessionStorage.getItem('numberCheck') !==''?!window.sessionStorage.getItem('numberCheck'):true

        //},()=>{
            //if(this.state.count !== 60){
                //this.countDown()
            //}
            //console.log(this.state.numberCheck)
        //})
        this.getCaptchaImg()
        
    }
    
    checkSMSNumber = async () =>{
        if(this.state.number === 3){
            this.setState({
                numberCheck:false,
            },()=>{
                window.sessionStorage.setItem('numberCheck',false)
            })
        }else{
            var number = this.state.number
            number += 1
            this.setState({
                number: number
            }, () => {
                window.sessionStorage.setItem('number',number)
            })
        }
    }
    GetSMSHandle = async () =>{
        
        if(this.props.phoneEmpty){
            window.toast("请输入手机号")
        }
        if(this.state.enable && !this.props.phoneEmpty){
            await this.checkSMSNumber()
            if(this.state.numberCheck || this.state.captchCodeCheck){
                
                const result = await api('/api/createSMS',{
                    method:'POST',
                    body:{
                        phoneNumber:this.props.phoneNumber
                    }
                })
                
                if(result.state.code === 0 ){//若成功发送验证码
                    //#1
                    //var dateBegin = new Date()
                    //window.sessionStorage.setItem('dateBegin',dateBegin)
                    this.countDown()
                }else{
                    window.toast(result.state.msg || "请重新输入")
                    this.getCaptchaImg()
                    this.setState({
                        captchCodeCheck:false
                    })
                }
            }else{
                window.toast("请输入图片验证码")
            }
    }
}
    //倒计时函数
    countDown = () =>{
        //开始倒计时后，设置发送验证码按钮为不可点击
        this.setState({
            enable:false,
        })
        var timer = setInterval(() => {
            var count = this.state.count  
            count -=1
            if(count < 1){//倒计时结束，重置
                count = 60
                this.setState({
                    enable: true,
                    count: count
                })
                    //#1
                    //,()=>{
                    //window.sessionStorage.removeItem('count')
                //})
                clearInterval(timer)
            }else{
                this.setState({
                    count: count
                    })
                }               
            },1000)
    }

    captchaInputHandle = (e) =>{
        const code = e.target.value

        if(code.toUpperCase() === this.state.captchaText.toUpperCase()){
            this.setState({
                captchaCode: code,
                captchCodeCheck: true,
                enable: true
            })
        }
        if(code.toUpperCase() !== this.state.captchaText.toUpperCase()){
            this.setState({
                captchaCode: code,
                captchCodeCheck: false
            })
        }

    }
    getCaptchaImg = async () =>{
        const result = await api('/api/createCaptcha',{
            method:'POST',
            body:{}
        })
        if(result.state.code === 0){
   
            this.setState({
                captchaImg: result.data.img,
                captchaText:result.data.text
            })
            
        }
        
    }
    render () {
        const disabled = this.state.count===60&&(this.state.numberCheck||(!this.state.numberCheck&&this.state.captchCodeCheck))? "disabled" : ""
        
        return(
            <div className = "sms-block">
                <input type="number" pattern="[0-9]*" className = "input-code" placeholder = "4位验证码" value = {this.props.smsCode} onChange = {this.props.smsCodeInputHandle}></input>
                {
                    <div className ={this.state.count===60&&(this.state.numberCheck||(!this.state.numberCheck&&this.state.captchCodeCheck)) ? 'active-btn' : 'inactive-btn'} onClick = {this.GetSMSHandle}>{this.state.enable? '获取验证码':`${this.state.count}秒后重发`}</div>
                }
                
            {
                !this.state.numberCheck?
                <div>
                    <input className = "input-code" placeholder={"图片验证码"} value = {this.state.captchaCode} onChange={this.captchaInputHandle}></input>
                    {this.state.captchCodeCheck?<img className="right" src={require('./right.png')}></img>:<img className = "error" src={require('./error.png')}></img>}
                    <div onClick = {this.getCaptchaImg} dangerouslySetInnerHTML = {{__html:this.state.captchaImg}}></div>
                    <div className = "change-icon" onClick = {this.getCaptchaImg}>看不清，换一张</div>
                </div>
                :""
            }
            </div>                    
        )
    }
}
